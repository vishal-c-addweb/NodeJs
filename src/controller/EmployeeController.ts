import { Response } from "express";
import { validationResult } from "express-validator/check";
import Request from "../types/Request";
import Employee, { IEmployee } from "../models/Employee";
import { success,error,dataArray } from "../response_builder/responsefunction";
import responsecode  from "../response_builder/responsecode";

const EmployeeController = {

    /**
     * Request a data from Employee
     * @param req
     * @param res
     * @returns {*}
     */
    index: async (_req: Request, res: Response) => {
        try {
            const employees = await Employee.find().populate("employee",["employeeId","name","salary"]);
            let meta :object = { message:"Employees Data", status:"success" }
            res.status(responsecode.Success).json(success(meta,employees));
    
        } catch (err) {
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * Create a new Employee
     * @param req
     * @param res
     * @returns {*}
     */
    create: async (req: Request, res: Response) => {
     
        const errors = validationResult(req);
    
        const { employeeId, name, salary } = req.body;
    
        // Build profile object based on IProfile
        const employeeFields = {
          employeeId,
          name,
          salary,
        };
    
        try {
          
          let employee: IEmployee = await Employee.findOne({ employeeId });
          
          if (!errors.isEmpty()) {
            let meta :object = { message:"Bad Request", status:"Failed", errors: errors.array() };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          }
          else {  
            if (employee) {
              let meta :object = { message:"Bad Request employee is already exists", status:"Failed" };
              res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            }
            else {
                // Create
                employee = new Employee(employeeFields);
                await employee.save();
                let meta :object = { message:"Employee Created", status:"success" };
                res.status(responsecode.Created).json(success(meta,employee));  
            }
          }
        } catch (err) {
            console.error(err.message);
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },
    
    /**
     * Update a Employee by id
     * @param req
     * @param res
     * @returns {*}
     */
    update: async(req: Request, res:Response) => {
      
        const errors = validationResult(req);
    
        const { employeeId, name, salary } = req.body;
    
        // Build profile object based on IProfile
        const employeeFields = {
          employeeId,
          name,
          salary,
        };

        try {
          if (!errors.isEmpty()) {
            let meta: object = { message:"Bad Request", status:"Failed", errors: errors.array() };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          }
          else {
            const employee = await Employee.findByIdAndUpdate(req.params.id,employeeFields,function(err,data){
              let meta :object = { message:"Employee Updated", status:"success" };
              res.status(responsecode.Success).json(success(meta,data));
            });
          } 
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                let meta :object = { message:"Employee id not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * find a Employee by id
     * @param req
     * @param res
     * @returns {*}
     */
    find: async(req: Request, res:Response) => {
        try {
            const ids = req.params.id.split(",");
            let employee; 
    
            if (ids) {
               employee = await Employee.find({ '_id': {$in: ids}});
    
               if (!employee) {
                  let meta :object ={ message:"Employee not found", status:"Failed" };
                  res.status(responsecode.Not_Found).json(error(meta,dataArray));
                }
                else {
                  let meta :object = { message:"Employee Data", status:"Success" };
                  res.status(responsecode.Success).json(success(meta,employee));
                }
            } else {
              let meta :object ={ message:"Bad Request URL Parameter is required!", status:"Failed" };
              res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            }        
    
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                let meta :object ={ message:"Employee not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * delete a Employee by id
     * @param req
     * @param res
     * @returns {*}
     */
    delete: async (req: Request, res: Response) => {
        try {
          // Remove employee
          let id = req.params.id;
    
          if (id) {
            let employee = await Employee.findOneAndRemove({ _id: id});
            
            if (employee) {
              let meta :object = { message:"Employee Deleted", status:"Success" };
              res.status(responsecode.Success).json(error(meta,dataArray));
            } else {
              let meta :object = { message:"Employee not found with this Id", status:"Failed" };
              res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
          } else {
            let meta :object ={ message:"Bad Request URL Parameter is required!", status:"Failed" };
            res.status(responsecode.Bad_Request).json(error(meta,dataArray));
          }   
        } catch (err) {
          console.error(err.message);
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        }
    },

    /**
     * find a Employee by name
     * @param req
     * @param res
     * @returns {*}
     */
    search: async(req: Request, res:Response) => {
        try {
            const regex = new RegExp(req.params.name,'i');
            
            if (regex) {
              const employee = await Employee.findOne({ $text :{ $search: req.params.name }});
      
              if (!employee) {
                  let meta :object ={ message:"Employee not found with this Name", status:"Failed" };
                  res.status(responsecode.Not_Found).json(error(meta,dataArray));
              }
              else {
                let meta :object ={ message:"Employee Data", status:"Success" };
                res.status(responsecode.Success).json(success(meta,employee));
              }
            } else {
              let meta :object ={ message:"Bad Request URL Parameter is required!", status:"Failed" };
              res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            }
            
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                let meta :object = { message:"Employee not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
      },

    /**
     * upload image
     * @param req
     * @param res
     * @returns {*}
     */
    upload: async(req: Request, res:Response) => {
        try {
          
            let meta :object = {  success: 1,profile_url: `http://localhost:5000/nodeJs/uploads/images/${req.file.filename}` };
            res.json(error(meta,dataArray));
        
          } catch (err) {
        
            console.error(err.message);
        
            if (err.kind == "ObjectId") {
              let meta :object = { message:"Image not uploaded", status:"Failed" };
              res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
        
            let meta :object = { message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        
        } 
    },

    /**
     * paginate records
     * @param req
     * @param res
     * @returns {*}
     */
    pagination: async(req: Request,res: Response) => {
        try {
            const page = parseInt(req.params.page);
            const limit = parseInt(req.params.limit);
            const skipIndex = (page - 1) * limit;
            if (page || limit || skipIndex) {
              const result = await Employee.find().sort({_id:1}).skip(skipIndex).limit(limit);
              let meta :object = { message:"Employee Data", status:"Success" };
              res.status(responsecode.Success).json(success(meta,result));
            }
            else {
              let meta :object = { message:"Bad Request URL Parameter is required!", status:"Failed" };
              res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            }
        } catch (err) {
          console.error(err.message);
          if (err.kind == "ObjectId") {
              let meta :object = { message:"Employee not found", status:"Failed" };
              res.status(responsecode.Not_Found).json(error(meta,dataArray));
          }
          let meta :object = { message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    }
};

export default EmployeeController;