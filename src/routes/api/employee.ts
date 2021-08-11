import { Router, Response, response } from "express";
import { check, validationResult } from "express-validator/check";

import auth from "../../middleware/auth";
import checkauth from "../../middleware/checkauth";
import Request from "../../types/Request";
import Employee, { IEmployee } from "../../models/Employee";
import { success,error } from "../../response_builder/responsefunction";
import responsecode  from "../../response_builder/responsecode";

const path = require("path");

const multer = require('multer');

const storage = multer.diskStorage({
  destination: './uploads/images',
  filename: (req: Request,file: any,cb: any) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
})

const upload = multer({
  storage: storage,
});

const router: Router = Router();

//get all employees
router.get( "/", checkauth, async (_req: Request, res: Response) => {
    try {
        const employees = await Employee.find().populate("employee",["employeeId","name","salary"]);
        let meta :object ={ message:"Employees Data", status:"success" }
        res.status(responsecode.Success).json(success(meta,employees));

    } catch (err) {
        let meta :object ={ message:"Server error", status:"Failed" };
        res.status(responsecode.Internal_Server_Error).json(error(meta));
    }
});

//Create employees
router.post(
    "/",
    [
      auth,
      check("employeeId", "Employee id is required").isNumeric(),
      check("name", "Name is required").isLength({ min:5 }),
      check("salary", "Salary is required").isNumeric(),
    ],
    async (req: Request, res: Response) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        let meta :object ={ message:"Bad Request", status:"Failed" };
        res.status(responsecode.Bad_Request).json(error(meta));
      }
  
      const { employeeId, name, salary } = req.body;
  
      // Build profile object based on IProfile
      const employeeFields = {
        employeeId,
        name,
        salary,
      };
  
      try {
        let employee: IEmployee = await Employee.findOne({ employeeId });
  
        if (employee) {
          let meta :object ={ message:"Bad Request employee is already exists", status:"Failed" };
          res.status(responsecode.Bad_Request).json(error(meta));
        }
        else {
            // Create
            employee = new Employee(employeeFields);
    
            await employee.save();
            let meta :object ={ message:"Employee Created", status:"success" };
            res.status(responsecode.Created).json(success(meta,employee));  
        }
        
        
      } catch (err) {
        console.error(err.message);
        let meta :object ={ message:"Server error", status:"Failed" };
        res.status(responsecode.Internal_Server_Error).json(error(meta));
      }
    }
  );

// @route   GET api/employee/id
// @desc    Get employee by id
// @access  Private
router.get("/:id", checkauth , async(req: Request, res:Response) => {
    try {
        const ids = req.params.id.split(",");
        const employee = await Employee.find({ '_id': {$in: ids}});

        if (!employee) {
            let meta :object ={ message:"Employee not found", status:"Failed" };
            res.status(responsecode.Not_Found).json(error(meta));
        }

        let meta :object ={ message:"Employee Data", status:"Success" };
        res.status(responsecode.Success).json(success(meta,employee));

    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            let meta :object ={ message:"Employee not found", status:"Failed" };
            res.status(responsecode.Not_Found).json(error(meta));
        }
        let meta :object ={ message:"Server error", status:"Failed" };
        res.status(responsecode.Internal_Server_Error).json(error(meta));
    }
});

// @route   Search api/employee/?name=
// @desc    Search name
// @access  Private
router.get("/search/:name", checkauth , async(req: Request, res:Response) => {
    try {
        const regex = new RegExp(req.params.name,'i');
        const employee = await Employee.find({ name : regex });

        if (!employee) {
            let meta :object ={ message:"Employee not found", status:"Failed" };
            res.status(responsecode.Not_Found).json(error(meta));
        }

        let meta :object ={ message:"Employee Data", status:"Success" };
        res.status(responsecode.Success).json(success(meta,employee));

    } catch (err) {
        console.error(err.message);
        if (err.kind == "ObjectId") {
            let meta :object ={ message:"Employee not found", status:"Failed" };
            res.status(responsecode.Not_Found).json(error(meta));
        }
        let meta :object ={ message:"Server error", status:"Failed" };
        res.status(responsecode.Internal_Server_Error).json(error(meta));
    }
});

//upload and image 
router.post("/upload" , checkauth, upload.single('profile') ,async(req: Request, res:Response) => {
  try {
    
      let meta :object ={  success: 1,profile_url: `http://localhost:5000/nodeJs/uploads/images/${req.file.filename}` };
      res.json(error(meta));
  
    } catch (err) {
  
      console.error(err.message);
  
      if (err.kind == "ObjectId") {
        let meta :object ={ message:"Image not uploaded", status:"Failed" };
        res.status(responsecode.Not_Found).json(error(meta));
      }
  
      let meta :object ={ message:"Server error", status:"Failed" };
      res.status(responsecode.Internal_Server_Error).json(error(meta));

  } 
});

// @route   DELETE api/employee/:id
// @desc    Delete employee
// @access  Private
router.delete("/:id",auth, async (req: Request, res: Response) => {
    try {
      // Remove employee
      await Employee.findOneAndRemove({ _id: req.params.id });
        
      let meta :object ={ message:"Employee Deleted", status:"Success" };
      res.status(responsecode.Success).json(error(meta));
    
    } catch (err) {
    
      console.error(err.message);
      let meta :object ={ message:"Server error", status:"Failed" };
      res.status(responsecode.Internal_Server_Error).json(error(meta));
    
    }
});

export default router;