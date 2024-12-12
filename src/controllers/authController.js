const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("./../utils/catchAsync");
const AppError = require("./../utils/appError");
const crypto = require("crypto");
const { promisify } = require("util");
const sendEmail = require('./../utils/email');

const Robot = require("../models/robotModel");
const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

exports.createUser = catchAsync(async (req, res, next) => {
  // generate random password
  let randomPassword = undefined;
  if (!req.body.password) {
    randomPassword = crypto.randomBytes(12).toString('hex');
    req.body.password = randomPassword;
  }
  const newUser = await User.create({
    // create means it will save the data to the database
    username: req.body.username,
    email: req.body.email,
    //TODO: we left the pass here just for fast creation of users
    password: req.body.password,
    passwordConfirm: req.body.password,
    role: req.body.role,
    autoGeneratedPassword: randomPassword,
  });



  res.status(201).json({
    status: "success",
    data: {
      user: newUser,
    },
  });
  req.user.email = newUser.email;
  next();
});

exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;

  // 1) Check if email and password exist
  if (!email || !password) {
    return next(new AppError("Please provide email and password!", 400));
  }
  // 2) Check if user exists && password is correct
  const user = await User.findOne({ email }).select("+password");

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError("Incorrect email or password", 401));
  }

  // 3) If everything ok, send token to client
  const token = signToken(user._id);

  res.status(200).json({
    status: "success",
    token,
    role: user.role,
    isLocked: user.isLocked
  });
});


exports.protect = catchAsync(async (req, res, next) => {
  // 1) Getting token and check of it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }


  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  // 2) Verification token
  // the verify function needs a call back function to proccess after returning the result
  // and to make it return a promise we use promisify
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  console.log(decoded);

  // 3) Check if user still exists
  const currentUser = await User.findById(decoded.id);
  if (!currentUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exist.',
        401
      )
    );
  }

  // 4) Check if user changed password after the token was issued
  if (currentUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again.', 401)
    );
  }

  // GRANT ACCESS TO PROTECTED ROUTE
  req.user = currentUser;
  next();
});


exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    // roles ['admin', 'lead-guide']. role='user'
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action', 403)
      );
    }

    next();
  };
};



exports.forgotPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.body.email });

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  // 2) Generate the random reset token
  const resetToken = user.createPasswordResetToken();
  await user.save({ validateBeforeSave: false });
  // when we save here we need to specify validateBeforeSave: false
  // because we are not providing all the required fields in the schema like password

  // 3) Send it to user's email
  const resetURL = `${req.get(
    'host'
  )}/api/v1/users/resetPassword/${resetToken}`;


  const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Your password reset token (valid for 10 min)',
      message
    });


    res.status(200).json({
      status: 'success',
      message: 'Token sent to email!'
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});



exports.resetPassword = catchAsync(async (req, res, next) => {
  // 1) Get user based on the token
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() }
  });

  // 2) If token has not expired, and there is user, set the new password
  if (!user) {
    return next(new AppError('Token is invalid or has expired', 400));
  }
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();

  // 3) Update changedPasswordAt property for the user
  // 4) Log the user in, send JWT
  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});

exports.updateIsLockedByEmail = catchAsync(async (req, res, next) => {
  const { email, isLocked } = req.body;


  if (isLocked !== 0 && isLocked !== 1) {
    return next(new AppError('Invalid value for isLocked, it must be 0 or 1.', 400));
  }

  const user = await User.findOneAndUpdate(
    { email },
    { isLocked },
    {
      new: true,
      runValidators: true
    }
  );

  if (!user) {
    return next(new AppError('No user found with that email.', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      user,
    },
  });
});



exports.updatePassword = catchAsync(async (req, res, next) => {
  // 1) Get user from collection
  const user = await User.findById(req.user.id).select('+password');


  // 2) Check if POSTed current password is correct
  if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
    return next(new AppError('Your current password is wrong.', 401));
  }

  // 3) If so, update password
  // User.findByIdAndUpdate will NOT work as intended!
  user.password = req.body.password;
  user.passwordConfirm = req.body.passwordConfirm;
  await user.save();

  // 4) Log user in, send JWT

  const token = signToken(user._id);

  res.status(200).json({
    status: 'success',
    token
  });
});


exports.emailPasswordOnRegistration = catchAsync(async (req, res, next) => {
  // 1) Get user based on POSTed email
  const user = await User.findOne({ email: req.user.email }).select('+autoGeneratedPassword');

  if (!user) {
    return next(new AppError('There is no user with email address.', 404));
  }

  if (user.autoGeneratedPassword === undefined) {
    return;
  }
  const password = user.autoGeneratedPassword;


  const message = `Here is your auto generated password: ${password}.\nIf you don't understand what is this about, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Here\'s your auto generated password ',
      message
    });

    user.autoGeneratedPassword = undefined;
    user.save({ validateBeforeSave: false });

  } catch (err) {
    return next(
      new AppError('There was an error sending the email. Try again later!'),
      500
    );
  }
});