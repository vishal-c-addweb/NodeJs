import { Response } from "express";
import { validationResult } from "express-validator/check";
import Request from "../types/Request";
import Department, { IDepartment } from "../models/Department";
import { success,error,dataArray } from "../response_builder/responsefunction";
import responsecode  from "../response_builder/responsecode";

const DepartmentController = {

    /**
     * Request a data from department
     * @param req
     * @param res
     * @returns {*}
     */
    index: async(req: Request, res: Response) => {
        try {
            const departments = await Department.find();
            const count = await Department.countDocuments(departments);
            let meta :object = { message:"Departments Data", status:"success", records:count };
            res.status(responsecode.Success).json(success(meta,departments));
        
        } catch (err) {
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * Create a new department
     * @param req
     * @param res
     * @returns {*}
     */
    create: async(req: Request, res: Response) => {
        const errors = validationResult(req);

        const { departmentName } = req.body;

        // Build employee object based on IEmployee
        const departmentFields = {
            departmentName
          };

        try {
            
            if (!errors.isEmpty()) {
                let meta :object = { message:"Bad Request error", status:"Failed",errors: errors.array()};
                res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            } else {

                let department : IDepartment = await Department.findOne({ departmentName });
                
                if (department) {
                    let meta :object = { message:"Bad Request department is already exists", status:"Failed" };
                    res.status(responsecode.Bad_Request).json(error(meta,dataArray));
                }
                else {
                    // Create
                    department = new Department(departmentFields);
            
                    await department.save();
                    
                    let meta :object = { message:"Department Created", status:"Success" };
                    res.status(responsecode.Created).json(success(meta,department));
                }
            }

        } catch (err) {
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    }
};

export default DepartmentController;