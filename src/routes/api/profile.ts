import { Router } from "express";
import { check } from "express-validator/check";
import auth from "../../middleware/auth";
import ProfileController from "../../controller/ProfileController";
const router: Router = Router();



// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", auth, ProfileController.index);

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, ProfileController.me);

// @route   POST api/profile
// @desc    Create or update user's profile
// @access  Private
router.post(
  "/",
  [
    auth,
    check("firstName", "First Name is required").not().isEmpty(),
    check("lastName", "Last Name is required").not().isEmpty(),
    check("username", "Username is required").not().isEmpty(),
  ],ProfileController.create);


// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Public
router.get("/user/:userId", auth, ProfileController.find);

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.delete("/", auth, ProfileController.delete);

export default router;
