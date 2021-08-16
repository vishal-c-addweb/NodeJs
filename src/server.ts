const Employee = require('./models/Employee');

import bodyParser from "body-parser";
import express from "express";

import connectDB from "../config/database";
import auth from "./routes/api/auth";
import user from "./routes/api/user";
import profile from "./routes/api/profile";
import employee from "./routes/api/employee";
import department from "./routes/api/department";
import student from "./routes/api/student";
import { seedDepartment } from "./seed/department-seeder";
import { seedEmployee } from "./seed/employee-seeder";

const app = express();

// Connect to MongoDB
connectDB();

// Express configuration
app.set("port", process.env.PORT || 5000);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

// @route   GET /
// @desc    Test Base API
// @access  Public
app.get("/", (_req, res) => {
  res.send("API Running");
});

app.use("/api/auth", auth);
app.use("/api/user", user);
app.use("/api/profile", profile);
app.use("/api/employee", employee);
app.use("/api/department", department);
app.use("/api/student", student);

const port = app.get("port");
const server = app.listen(port, () =>
  console.log(`Server started on port ${port}`)
);

export default server;
