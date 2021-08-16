import { Document,Model,model,Schema } from "mongoose";

/**
 * Interface to model the Restorunt Schema for Typescript
 * @param rollNo :number
 * @param name :string
 * @param school : string
 * @param subject : object
 * @param image : string
 */

export interface IStudent extends Document {
    rollNo: number;
    name: string;
    school: string;
    subject: object;
    image: string;
}

const studentSchema: Schema = new Schema({
    rollNo: {
        type: Number,
        required: true,
        unique: true
    },
    name: {
        type: String,
        required: true
    },
    school: {
        type: String,
        required: true
    },
    subject: {
        type: Object,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

studentSchema.index({name:"text",school:"text"});

const Student: Model<IStudent> = model("Student",studentSchema);

export default Student;