import { Router } from "express";
import { check } from "express-validator/check";

import checkauth from "../../middleware/checkauth";
import Request from "../../types/Request";
import StudentController from "../../controller/StudentController";

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

//get All students
router.get("/",checkauth,StudentController.index);

//Create Student
router.post(
    "/",
    [
        checkauth,
        check("rollNo","enter valid Roll Number").isNumeric(),
        check("name","enter valid student name").isLength({ min:5 }),
        check("school","enter valid school name"),
        check("subject","enter a valid subject"),
        check("image","enter valid image url")
    ],
    StudentController.create);

//search text
router.get("/search/:text", checkauth , StudentController.search);

//search with pagination
router.get("/search/:text/:page/:limit", checkauth , StudentController.searchWithPagination);

//pagination
router.get('/:page/:limit',checkauth,StudentController.pagination);

export default router;