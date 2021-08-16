import {  Response } from "express";
import {  validationResult } from "express-validator/check";
import Request from "../types/Request";
import User, { IUser } from "../models/User";
import Profile, { IProfile } from "../models/Profile";
import { success,error,dataArray } from "../response_builder/responsefunction";
import responsecode  from "../response_builder/responsecode";

const ProfileController = {

     /**
     * Get All User Profile
     * @param req
     * @param res
     * @returns {*}
     */
    index: async (_req: Request, res: Response) => {
        try {
          
          const profiles = await Profile.find().populate("user", ["avatar", "email"]);
          let meta :object ={ message:"User Profile", status:"success" };
          res.status(responsecode.Success).json(success(meta,profiles));
        
        } catch (err) {
        
          console.error(err.message);
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        }
    },

    /**
     * Get Auth User Profile
     * @param req
     * @param res
     * @returns {*}
     */
    me: async (req: Request, res: Response) => {
        try {
          
          const profile: IProfile = await Profile.findOne({
            user: req.userId,
          }).populate("user", ["avatar", "email"]);
      
          if (!profile) {
            let meta :object ={ message:"Bad Request", status:"Failed" };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          }
      
          let meta :object ={ message:"User Profile", status:"success" }
          res.status(responsecode.Success).json(success(meta,profile));
        
        } catch (err) {
        
          console.error(err.message);
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        }
    },
    /**
     * Create a User Profile
     * @param req
     * @param res
     * @returns {*}
     */
    create: async (req: Request, res: Response) => {
    
        const errors = validationResult(req);
    
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
              
          if (!errors.isEmpty()) {
            let meta :object ={ message:"Bad Request", status:"Failed", errors: errors.array() };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          } else {
            if (!user) {
              let meta :object ={ message:"Bad Request", status:"Failed" };
              res.status(responsecode.Bad_Request).json(error(meta,dataArray));
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
          }
        } catch (err) {
        
          console.error(err.message);
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        }
    },

    /**
     * find a User Profile by id
     * @param req
     * @param res
     * @returns {*}
     */
    find: async (req: Request, res: Response) => {
        try {
          
          const profile: IProfile = await Profile.findOne({
            user: req.params.userId,
          }).populate("user", ["avatar", "email"]);
      
          if (!profile){
            let meta :object ={ message:"Bad Request", status:"Failed" };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          }
          
          let meta :object ={ message:"User Profile", status:"success" }
          res.status(responsecode.Success).json(success(meta,profile));
        
        } catch (err) {
          console.error(err.message);
          
          if (err.kind === "ObjectId") {
            let meta :object ={ message:"Bad Request", status:"Failed" };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          }
          
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        }
    },

    /**
     * delete User Profile by id
     * @param req
     * @param res
     * @returns {*}
     */
    delete: async (req: Request, res: Response) => {
        try {
        
          // Remove profile
          let profile = await Profile.findOneAndRemove({ user: req.userId });
          if (profile) {
              // Remove user
            await User.findOneAndRemove({ _id: req.userId });
      
            let meta :object ={ message:"User Removed", status:"Success" };
            res.status(responsecode.Success).json(error(meta,dataArray));
          } else {
            let meta :object ={ message:"User & profile not found", status:"Failed" };
            res.status(responsecode.Not_Found).json(error(meta,dataArray));
          }
        
        } catch (err) {
        
          console.error(err.message);
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        }
    }
};

export default ProfileController;