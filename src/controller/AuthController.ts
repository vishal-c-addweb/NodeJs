import bcrypt from "bcryptjs"
import config from "config";
import {  Response } from "express";
import {  validationResult } from "express-validator/check";
import jwt from "jsonwebtoken";

import Payload from "../types/Payload"
import Request from "../types/Request";
import User, { IUser } from "../models/User";
import { success,error,dataArray } from "../response_builder/responsefunction";
import responsecode  from "../response_builder/responsecode";

const AuthController = {

    /**
     * Request a data from User
     * @param req
     * @param res
     * @returns {*}
     */
    index: async (req: Request, res: Response) => {
  
        try {
      
          const user: IUser = await User.findById(req.userId).select("-password");
          let meta :object = { message:"User Data", status:"success" };
          res.status(responsecode.Success).json(success(meta,user));
      
        } catch (err) {
      
          console.error(err.message);
          let meta :object = { message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
      
        }
    },

    /**
     * Login & get JWT token
     * @param req
     * @param res
     * @returns {*}
     */
    login: async (req: Request, res: Response) => {
    
        const errors = validationResult(req);
    
        const { email, password } = req.body;
        
        try {
    
          let user: IUser = await User.findOne({ email });
    
          if (!errors.isEmpty()) {
            let meta :object = { message:"Bad Request", status:"Failed", errors: errors.array()};
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          } else {
            if (!user) {
              let meta :object ={ message:"Invalid Credential", status:"Failed" };
              res.status(responsecode.Success).json(error(meta,dataArray));
            }
            const isMatch = await bcrypt.compare(password, user.password);
      
            if (!isMatch) {
              let meta :object ={ message:"Invalid Credential", status:"Failed" };
              res.status(responsecode.Unauthorized).json(error(meta,dataArray));
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
          } 
        } catch (err) {
    
          console.error(err.message);
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray)); 
        }
    }
};

export default AuthController;