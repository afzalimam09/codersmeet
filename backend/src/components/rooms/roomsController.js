import AppError from "../../helper/appError.js";
import catchAsync from "../../helper/catchAsync.js";
import Room from "../../models/roomModel.js";

export const createRoom = catchAsync(async (req, res, next) => {
    const { topic, roomType } = req.body;
    if (!topic || !roomType) {
        return next(new AppError("topic and roomType is required!", 400));
    }

    //create room into db;
    const room = await Room.create({
        topic,
        roomType,
        ownerId: req.user._id,
        speakers: [req.user._id],
    });

    const { __v, updatedAt, ...others } = room._doc;

    res.status(200).json({
        status: "success",
        message: "rooms created successfully",
        room: others,
    });
});

export const getAllRooms = catchAsync(async (req, res, next) => {
    const roomTypes = ["open"];
    const rooms = await Room.find({ roomType: { $in: roomTypes } })
        .populate("speakers")
        .populate("ownerId")
        .exec();

    res.status(200).json({
        status: "success",
        message: "All rooms fetched!",
        rooms,
    });
});

export const getSingleRoom = catchAsync(async (req, res, next) => {
    const { roomId } = req.params;

    const room = await Room.findOne({ _id: roomId });

    res.status(200).json({
        status: "success",
        message: "Room data fetched!",
        room,
    });
});
