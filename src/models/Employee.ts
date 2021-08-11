import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the Employee Schema for TypeScript.
 * @param employeeId :number
 * @param name :string
 * @param salary :string
 */

export interface IEmployee extends Document {
    employeeId: number;
    name: string;
    salary: number;
}

export interface MulterRequest extends Request {
    file: any;
}

const employeeSchema: Schema = new Schema({
    employeeId: {
        type: Number,
        required: true,
        unique: true,
    },
    name: {
        type: String,
        required: true
    },
    salary: {
        type: Number,
        required: true
    }
});

const Employee: Model<IEmployee> = model("Employee",employeeSchema);

export default Employee;