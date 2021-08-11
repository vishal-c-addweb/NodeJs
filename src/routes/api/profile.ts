import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import HttpStatusCodes from "http-status-codes";

import auth from "../../middleware/auth";
import Profile, { IProfile } from "../../models/Profile";
import Request from "../../types/Request";
import User, { IUser } from "../../models/User";
import { success,error } from "../../response_builder/responsefunction";
import responsecode  from "../../response_builder/responsecode";

const router: Router = Router();

// @route   GET api/profile/me
// @desc    Get current user's profile
// @access  Private
router.get("/me", auth, async (req: Request, res: Response) => {
  try {
    
    const profile: IProfile = await Profile.findOne({
      user: req.userId,
    }).populate("user", ["avatar", "email"]);

    if (!profile) {
      let meta :object ={ message:"Bad Request", status:"Failed" };
      res.status(responsecode.Bad_Request).json(error(meta));
    }

    let meta :object ={ message:"User Profile", status:"success" }
    res.status(responsecode.Success).json(success(meta,profile));
  
  } catch (err) {
  
    console.error(err.message);
    let meta :object ={ message:"Server error", status:"Failed" };
    res.status(responsecode.Internal_Server_Error).json(error(meta));
  
  }
});

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
  ],
  async (req: Request, res: Response) => {
    
    const errors = validationResult(req);
    
    if (!errors.isEmpty()) {
      let meta :object ={ message:"Bad Request", status:"Failed" };
      res.status(responsecode.Bad_Request).json(error(meta));
    }

    const { firstName, lastName, username } = req.body;

    // Build profile object based on IProfile
    const profileFields = {
      user: req.userId,
      firstName,
      lastName,
      username,
    };

    try {
      
      let user: IUser = await User.findOne({ _id: req.userId });

      if (!user) {
        let meta :object ={ message:"Bad Request", status:"Failed" };
        res.status(responsecode.Bad_Request).json(error(meta));
      }

      let profile: IProfile = await Profile.findOne({ user: req.userId });
      
      if (profile) {
        // Update
        profile = await Profile.findOneAndUpdate(
          { user: req.userId },
          { $set: profileFields },
          { new: true }
        );

        let meta :object ={ message:"User Profile", status:"success" }
        res.status(responsecode.Success).json(success(meta,profile));
      
      }

      // Create
      profile = new Profile(profileFields);

      await profile.save();

      let meta :object ={ message:"User Created", status:"success" }
      res.status(responsecode.Created).json(success(meta,profile));
    
    } catch (err) {
    
      console.error(err.message);
      let meta :object ={ message:"Server error", status:"Failed" };
      res.status(responsecode.Internal_Server_Error).json(error(meta));
    
    }
  }
);

// @route   GET api/profile
// @desc    Get all profiles
// @access  Public
router.get("/", auth, async (_req: Request, res: Response) => {
  try {
    
    const profiles = await Profile.find().populate("user", ["avatar", "email"]);
    let meta :object ={ message:"User Profile", status:"success" }
    res.status(responsecode.Success).json(success(meta,profiles));
  
  } catch (err) {
  
    console.error(err.message);
    let meta :object ={ message:"Server error", status:"Failed" };
    res.status(responsecode.Internal_Server_Error).json(error(meta));
  
  }
});

// @route   GET api/profile/user/:userId
// @desc    Get profile by userId
// @access  Public
router.get("/user/:userId", async (req: Request, res: Response) => {
  try {
    
    const profile: IProfile = await Profile.findOne({
      user: req.params.userId,
    }).populate("user", ["avatar", "email"]);

    if (!profile){
      let meta :object ={ message:"Bad Request", status:"Failed" };
      res.status(responsecode.Bad_Request).json(error(meta));
    }
    
    let meta :object ={ message:"User Profile", status:"success" }
    res.status(responsecode.Success).json(success(meta,profile));
  
  } catch (err) {
    console.error(err.message);
    
    if (err.kind === "ObjectId") {
      let meta :object ={ message:"Bad Request", status:"Failed" };
      res.status(responsecode.Bad_Request).json(error(meta));
    }
    
    let meta :object ={ message:"Server error", status:"Failed" };
    res.status(responsecode.Internal_Server_Error).json(error(meta));
  
  }
});

// @route   DELETE api/profile
// @desc    Delete profile and user
// @access  Private
router.delete("/", auth, async (req: Request, res: Response) => {
  try {
  
    // Remove profile
    await Profile.findOneAndRemove({ user: req.userId });
    // Remove user
    await User.findOneAndRemove({ _id: req.userId });

    let meta :object ={ message:"User Removed", status:"Success" };
    res.status(responsecode.Success).json(error(meta));
  
  } catch (err) {
  
    console.error(err.message);
    let meta :object ={ message:"Server error", status:"Failed" };
    res.status(responsecode.Internal_Server_Error).json(error(meta));
  
  }
});

export default router;
