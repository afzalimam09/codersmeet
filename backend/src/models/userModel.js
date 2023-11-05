import mongoose from "mongoose";
import db from "../connections/dbConnections.js";

const Schema = mongoose.Schema;

// Creating schema
const userSchema = new Schema(
    {
        phone: {
            type: String,
            unique: true,
            required: [true, "Phone is required!"],
        },
        name: {
            type: String,
            required: false,
        },
        avatar: {
            type: String,
            required: false,
        },
        activated: {
            type: Boolean,
            default: false,
        },
    },
    { timestamps: true }
);

// Creating model
export default db.model("User", userSchema);
