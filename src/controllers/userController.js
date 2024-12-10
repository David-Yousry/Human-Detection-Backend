const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const catchAsync = require("../utils/catchAsync");
const AppError = require("../utils/appError");

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    // SEND RESPONSE
    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(404).json({
      status: "failed",
      message: err,
    });
  }
};

exports.getAllSpecifiedRoleUsers = async (req, res, next) => {
  try {
    const { role } = req.params;
    const isNameSpecified = req.query.name;

    let users = await User.find({ role });

    if (isNameSpecified){
    const filteredUsers = [];
      users.forEach((user) => {
        if (user.username.startsWith(isNameSpecified)) {
          filteredUsers.push(user);
        }
      });
      users = filteredUsers;
    }
    

    if (users.length === 0) {
      return res.status(404).json({
        status: "fail",
        message: `No users found with role: ${role}`,
      });
    }


    res.status(200).json({
      status: "success",
      results: users.length,
      data: {
        users,
      },
    });
  } catch (err) {
    res.status(500).json({
      status: "fail",
      message: err.message,
    });
  }
};


exports.getLatestUsersByRole = async (req, res, next) => {
  try {
    const roles = User.schema.path('role').enumValues; // to get roles from UserModel 

    // initialize it to store users grouped by role
    const usersByRole = {};

    // add latest users for each role
    for (const role of roles) {
      const users = await User.find({ role })
        .sort({ CreatedAt: -1 }) // -1 for desc order
        .limit(5);

      usersByRole[role] = users;
    }

    res.status(200).json({
      status: 'success',
      data: usersByRole,
    });
  } catch (err) {
    res.status(500).json({
      status: 'fail',
      message: err.message,
    });
  }
};

exports.updateMe = catchAsync(async (req, res, next) => {
  // 1) Create error if user POSTs password data
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        "This route is not for password updates. Please use /updateMyPassword.",
        400
      )
    );
  }

  // 2) Filtered out unwanted fields names that are not allowed to be updated
  const filteredBody = filterObj(req.body, "username", "email");

  // 3) Update user document
  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: "success",
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {

  const user = await User.findById(req.params.id);
  if (!user) {
    return next(new AppError("No user found with that ID", 404));
  }
  await User.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: "success",
    data: null,
  });
});
