import config from "config";
import { Router, Response } from "express";
import { check, validationResult } from "express-validator/check";
import gravatar from "gravatar";
import HttpStatusCodes from "http-status-codes";
import jwt from "jsonwebtoken";

import auth from "../../middleware/auth";
import checkauth from "../../middleware/checkauth";
import Payload from "../../types/Payload";
import Request from "../../types/Request";
import Department, { IDepartment } from "../../models/Department";
import { response } from "express";
import { success,error } from "../../response_builder/responsefunction";
import responsecode  from "../../response_builder/responsecode";

const router: Router = Router();

//get all Departments
router.get ('/' , checkauth, async (_req: Request, res: Response) => {
    try {
        
        const departments = await Department.find();
        let meta :object ={ message:"Departments Data", status:"success" }
        res.status(responsecode.Success).json(success(meta,departments));
    
    } catch (err) {
    
        let meta :object ={ message:"Server error", status:"Failed" };
        res.status(responsecode.Internal_Server_Error).json(error(meta));
    
    }
}); 

//Create Department
router.post ('/' , 
    [
        checkauth,
        check("departmentName","Please include Valid Department Name").isLength({ min:5 })
    ],
     async(req: Request, res: Response) => {
        
        const errors = validationResult(req);
        
        if (!errors.isEmpty()) {
            let meta :object ={ message:"Bad Request error", status:"Failed" };
            res.status(responsecode.Bad_Request).json(error(meta));
        }

        const { departmentName } = req.body;

        // Build employee object based on IEmployee
        const departmentFields = {
            departmentName
          };

        try {
            
            let department : IDepartment = await Department.findOne({ departmentName });
            
            if (department) {
                let meta :object ={ message:"Bad Request department is already exists", status:"Failed" };
                res.status(responsecode.Bad_Request).json(error(meta));
            }
            else {
                // Create
                department = new Department(departmentFields);
        
                await department.save();
                
                let meta :object ={ message:"Department Created", status:"Success" };
                res.status(responsecode.Created).json(success(meta,department));
        
            }

        } catch (err) {
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta));
        }
});

export default router;