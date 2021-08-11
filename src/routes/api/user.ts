import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import { success,error } from "../../response_builder/responsefunction";
import responsecode  from "../../response_builder/responsecode";

const router: Router = Router();

// @route   POST api/user
// @desc    Register user given their email and password, returns the token upon successful registration
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 })
  ],
  async (req: Request, res: Response) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      let meta :object ={ message:"Bad Request", status:"Failed" };
      res.status(responsecode.Bad_Request).json(error(meta));

    }

    const { email, password } = req.body;
    try {
      let user: IUser = await User.findOne({ email });

      if (user) {
        let meta :object ={ message:"Bad Request User already exists", status:"Failed" };
        res.status(responsecode.Bad_Request).json(error(meta));
      }

      const options: gravatar.Options = {
        s: "200",
        r: "pg",
        d: "mm"
      };

      const avatar = gravatar.url(email, options);

      const salt = await bcrypt.genSalt(10);
      const hashed = await bcrypt.hash(password, salt);

      // Build user object based on IUser
      const userFields = {
        email,
        password: hashed,
        avatar
      };

      user = new User(userFields);

      await user.save();

      const payload: Payload = {
        userId: user.id
      };

      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: config.get("jwtExpiration") },
        (err, token) => {
          if (err) throw err;
          res.status(responsecode.Success).json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      let meta :object ={ message:"Server error", status:"Failed" };
      res.status(responsecode.Internal_Server_Error).json(error(meta));
    }
  }
);

export default router;
