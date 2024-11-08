const express = require("express");
const {
  authenticate,
  authorizeAdmin,
} = require("../middlewares/authMiddleware");
const {
  createUser,
  loginUser,
  logoutCurrentUser,
  getAllUsers,
  getCurrentUserProfile,
  updateCurrentUserProfile,
  deleteUser,
  getSingleUser,
  updateUserById
} = require("../controllers/userController");
const router = express.Router();

router
  .route("/")
  .post(createUser)
  .get(authenticate, authorizeAdmin, getAllUsers);

router.post("/auth", loginUser);
router.post("/logout", logoutCurrentUser);

router.route("/profile")
    .get(authenticate, getCurrentUserProfile)
    .put(authenticate, updateCurrentUserProfile)
            

    //ADMIN ROUTES
router.route('/:id')
        .delete(authenticate, authorizeAdmin, deleteUser)
        .get(authenticate, authorizeAdmin, getSingleUser)
        .put(authenticate, authorizeAdmin, updateUserById)

module.exports = router;
