import { Router } from "express";
import { check } from "express-validator/check";

import auth from "../../middleware/auth";
import AuthController from "../../controller/AuthController";

const router: Router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", auth, AuthController.index);

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
  ],
  AuthController.login);

export default router;
