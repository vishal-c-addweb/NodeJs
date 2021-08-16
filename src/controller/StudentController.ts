import { Response } from "express";
import { validationResult } from "express-validator/check";
import Request from "../types/Request";
import Student, { IStudent } from "../models/Student";
import { success,error,dataArray } from "../response_builder/responsefunction";
import responsecode  from "../response_builder/responsecode";

const StudentController = {

    /**
     * Request a data from student
     * @param req
     * @param res
     * @returns {*}
     */
    index: async(req: Request,res: Response) => {
        try {
            const student = await Student.find();
            let meta :object = { message:"Student Data", status:"Success"};
            res.status(responsecode.Success).json(success(meta,student));
        } catch(err) {
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },


    /**
     * Create a new student
     * @param req
     * @param res
     * @returns {*}
     */
    create: async (req: Request, res: Response) => {
        const errors = validationResult(req);
  
        const { rollNo, name, school, subject, image } = req.body;
        
        // Build student object based on IStudent
        const studentFields = {
            rollNo,
            name,
            school,
            subject,
            image,
        };

  
        try {
            let student: IStudent = await Student.findOne({ rollNo });
            
            if (!errors.isEmpty()) {
                let meta :object ={ message:"Bad Request", status:"Failed", errors: errors.array() };
                res.status(responsecode.Bad_Request).json(error(meta,dataArray));
            } else {
                if (student) {
                    let meta :object ={ message:"Bad Request Student is already exists", status:"Failed" };
                    res.status(responsecode.Bad_Request).json(error(meta,dataArray));
                }
                else {
                    // Create
                    student = new Student(studentFields);
                    await student.save();
                    let meta :object ={ message:"Student Created", status:"success" };
                    res.status(responsecode.Created).json(success(meta,student));  
                }
            }
        } catch (err) {
            console.error(err.message);
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * search student by name
     * @param req
     * @param res
     * @returns {*}
     */
    search: async(req: Request, res:Response) => {
        try {
            const text = req.params.text;
            const student = await Student.find({ $text :{ $search:text  }});
      
            if (!student) {
                let meta :object ={ message:"Student not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
      
            let meta :object ={ message:"Student Data", status:"Success" };
            res.status(responsecode.Success).json(success(meta,student));
      
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                let meta :object = { message:"Student not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * paginate results
     * @param req
     * @param res
     * @returns {*}
     */
    pagination: async(req: Request,res: Response) => {
        try {
            const page = parseInt(req.params.page);
            const limit = parseInt(req.params.limit);
            const skipIndex = (page - 1) * limit;
            const result = await Student.find().sort({_id:1}).skip(skipIndex).limit(limit);
            const count = await Student.countDocuments(result);
            const length =  result.length;
            let meta :object ={ message:"Student Data", status:"Success",page:page,records:count,pagesize:length};
            res.status(responsecode.Success).json(success(meta,result));
        } catch (err) {
          console.error(err.message);
          if (err.kind == "ObjectId") {
              let meta :object = { message:"Student not found", status:"Failed" };
              res.status(responsecode.Not_Found).json(error(meta,dataArray));
          }
          let meta :object ={ message:"Server error", status:"Failed" };
          res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    },

    /**
     * search student & paginate student
     * @param req
     * @param res
     * @returns {*}
     */
    searchWithPagination: async(req: Request, res:Response) => {
        try {
            const page = parseInt(req.params.page);
            const limit = parseInt(req.params.limit);
            const skipIndex = (page - 1) * limit;
            const text = req.params.text;
            const student = await Student.aggregate([{$match:{$text :{ $search:text }}},{$sort:{rollNo:1}},{$skip:skipIndex},{$limit:limit}]);
            const count = await Student.countDocuments(student); 
            if (!student) {
                let meta :object ={ message:"Student not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
      
            let meta :object ={ message:"Student Data", status:"Success",page:page,records:count,pagesize:student.length};
            res.status(responsecode.Success).json(success(meta,student));
      
        } catch (err) {
            console.error(err.message);
            if (err.kind == "ObjectId") {
                let meta :object = { message:"Student not found", status:"Failed" };
                res.status(responsecode.Not_Found).json(error(meta,dataArray));
            }
            let meta :object ={ message:"Server error", status:"Failed" };
            res.status(responsecode.Internal_Server_Error).json(error(meta,dataArray));
        }
    }

};

export default StudentController;