const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

// create user
router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  authController.createUser,
  authController.emailPasswordOnRegisteration,
);


router
  .route('/latestByRole')
  .get(authController.protect, authController.restrictTo('admin'), userController.getLatestUsersByRole);


router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updateMe", authController.protect, userController.updateMe);

router.get("/myInfo", authController.protect, userController.getMyInfo);

router.delete(
  "/deleteUser/:id",
  authController.protect,
  authController.restrictTo("admin"),
  userController.deleteUser
);

router
  .route("/updatePassword")
  .patch(authController.protect, authController.updatePassword);


router
  .route('/')
  .get(authController.protect,
    authController.restrictTo("admin"),
    userController.getAllUsers

  )

router
  .route('/:role')
  .get(authController.protect,
    authController.restrictTo("admin"),
    userController.getAllSpecifiedRoleUsers

  )


module.exports = router;
