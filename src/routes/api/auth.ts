import bcrypt from "bcryptjs";
import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import auth from "../../middleware/auth";
import Payload from "../../types/Payload";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import { success,error } from "../../response_builder/responsefunction";
import responsecode  from "../../response_builder/responsecode";

const router: Router = Router();

// @route   GET api/auth
// @desc    Get authenticated user given the token
// @access  Private
router.get("/", auth, async (req: Request, res: Response) => {
  
  try {

    const user: IUser = await User.findById(req.userId).select("-password");
    let meta :object = { message:"User Data", status:"success" };
    res.status(responsecode.Success).json(success(meta,user));

  } catch (err) {

    console.error(err.message);
    let meta :object ={ message:"Server error", status:"Failed" };
    res.status(responsecode.Internal_Server_Error).json(error(meta));

  }
});

// @route   POST api/auth
// @desc    Login user and get token
// @access  Public
router.post(
  "/",
  [
    check("email", "Please include a valid email").isEmail(),
    check("password", "Password is required").exists()
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

      if (!user) {
        let meta :object ={ message:"Invalid Credential", status:"Failed" };
        res.status(responsecode.Success).json(error(meta));
      }

      const isMatch = await bcrypt.compare(password, user.password);

      if (!isMatch) {
        let meta :object ={ message:"Invalid Credential", status:"Failed" };
        res.status(responsecode.Unauthorized).json(error(meta));
      }

      else {
        
        const payload: Payload = {
          userId: user.id
        };
  
        jwt.sign(
          payload,
          config.get("jwtSecret"),
          { expiresIn: config.get("jwtExpiration") },
          (err, token) => {
            if (err) throw err;
            res.json({ token });
          }
        );
      }
      
    } catch (err) {

      console.error(err.message);
      let meta :object ={ message:"Server error", status:"Failed" };
      res.status(responsecode.Internal_Server_Error).json(error(meta)); 
    }
  }
);

export default router;
