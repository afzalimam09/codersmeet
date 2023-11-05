import mongoose from "mongoose";
import db from "../connections/dbConnections.js";

const Schema = mongoose.Schema;

// Creating schema
const roomSchema = new Schema(
    {
        topic: {
            type: String,
            required: [true, "topic is required!"],
        },
        roomType: {
            type: String,
            required: [true, "Room type is required!"],
        },
        ownerId: {
            type: Schema.Types.ObjectId,
            ref: "User",
        },
        speakers: {
            type: [{ type: Schema.Types.ObjectId, ref: "User" }],
            required: false,
        },
    },
    { timestamps: true }
);

// Creating model
export default db.model("Room", roomSchema, "rooms");
