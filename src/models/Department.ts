import { Document, Model, model, Schema } from "mongoose";

/**
 * Interface to model the Department Schema for Typescript
 * @param departmentName :string
 */

export interface IDepartment extends Document {
    departmentName : string;
}

const departmentSchema: Schema = new Schema({
    departmentName: {
        type : String,
        required : true
    }
});

const Department: Model<IDepartment> = model("Department",departmentSchema);

export default Department;