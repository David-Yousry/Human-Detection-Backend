const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

// create user
router.route("/")
  .post(
    authController.protect,
    authController.restrictTo("admin"),
    authController.createUser,
    authController.emailPasswordOnRegistration)
  .get(authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers
  );


router
  .route('/latestByRole')
  .get(authController.protect, authController.restrictTo('admin'), userController.getLatestUsersByRole);


router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updateMe", authController.protect, userController.updateMe);

router.get("/myInfo", authController.protect, userController.getMyInfo);

router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);

router.patch("/updateIsLocked",authController.updateIsLockedByEmail);

// any rote that contains /something e.g /updateMe , should be above the /:id route
// because the "updateMe" will be considered as the id
router
  .route('/:id')
  .get(authController.protect,
    authController.restrictTo("admin"),
    userController.getUser)
  .patch(authController.protect,
    authController.restrictTo("admin"),
    userController.updateUser)
  .delete(authController.protect,
    authController.restrictTo("admin"),
    userController.deleteUser);


router
  .route('/getAll/:role')
  .get(authController.protect,
    authController.restrictTo("admin"),
    userController.getAllSpecifiedRoleUsers
  )


module.exports = router;
