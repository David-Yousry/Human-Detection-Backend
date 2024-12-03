const express = require("express");
const userController = require("../controllers/userController");
const authController = require("../controllers/authController");
const router = express.Router();

// create user
router.post(
  "/",
  authController.protect,
  authController.restrictTo("admin"),
  authController.createUser
);



router.post("/login", authController.login);

router.post("/forgotPassword", authController.forgotPassword);
router.patch("/resetPassword/:token", authController.resetPassword);

router.patch("/updateMe", authController.protect, userController.updateMe);

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

module.exports = router;
