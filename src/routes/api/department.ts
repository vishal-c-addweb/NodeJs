import { Router } from "express";
import { check } from "express-validator/check";
import checkauth from "../../middleware/checkauth";
import DepartmentController from "../../controller/DepartmentController";

const router: Router = Router();

router.get("/", checkauth, DepartmentController.index);

//Create Department
router.post ('/' , 
    [
        checkauth,
        check("departmentName","Please include Valid Department Name").isLength({ min:5 })
    ],DepartmentController.create);

export default router;