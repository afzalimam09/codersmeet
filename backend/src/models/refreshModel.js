import mongoose from "mongoose";
import db from "../connections/dbConnections.js";

const Schema = mongoose.Schema;

// Creating schema
const refreshSchema = new Schema(
    {
        token: {
            type: String,
            required: [true, "token is required!"],
        },
        userId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
    },
    { timestamps: true }
);

// Creating model
export default db.model("Refresh", refreshSchema, "tokens");
