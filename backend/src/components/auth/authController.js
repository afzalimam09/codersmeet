import config from "../../core/config.js";
import AppError from "../../helper/appError.js";
import catchAsync from "../../helper/catchAsync.js";
import User from "../../models/userModel.js";
import Refresh from "../../models/refreshModel.js";
import {
    generateOTP,
    generateTokens,
    hashOTP,
    sendOTPbySMS,
    uploadUserImage,
    verifyAccessTokens,
    verifyRefreshTokens,
    verifySentOTP,
} from "./authService.js";

const storeRefreshTokenIntoDB = async (token, userId) => {
    const data = await Refresh.findOne({ userId });
    if (!data) {
        //for the first time
        await Refresh.create({ token, userId });
    } else {
        //just update the new token
        data.token = token;
        await data.save();
    }
};

const createSendToken = async (user, statusCode, req, res) => {
    const { accessToken, refreshToken } = generateTokens({
        _id: user._id,
    });

    await storeRefreshTokenIntoDB(refreshToken, user._id);

    res.cookie("refreshToken", refreshToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
    });

    res.cookie("accessToken", accessToken, {
        maxAge: 1000 * 60 * 60 * 24 * 30,
        httpOnly: true,
    });

    const { __v, updatedAt, ...others } = user._doc;

    res.status(statusCode).json({
        status: "success",
        message: "OTP verified and loggedIn",
        isAuth: true,
        user: others,
    });
};

export const sendOTP = catchAsync(async (req, res, next) => {
    const { phone } = req.body;
    if (!phone) {
        return next(new AppError("Mobile number is required!", 400));
    }

    // Generate OTP
    // const otp = generateOTP();
    const otp = 1234;
    //calculate expires time and hash the otp
    const ttl = config.otp.ttl * 60 * 1000; //in milli seconds
    const expires = Date.now() + ttl;
    const data = `${phone}.${otp}.${expires}`;
    const hash = hashOTP(data);

    //send otp to mobile
    // await sendOTPbySMS(phone, otp); //will enable in the production

    res.status(200).json({
        status: "success",
        message: "OTP send successfully",
        hash: `${hash}_${expires}`,
        phone,
    });
});

export const verifyOTP = catchAsync(async (req, res, next) => {
    const { otp, hash, phone } = req.body;
    if (!otp || !hash || !phone) {
        return next(new AppError("OTP, hash and phone are required!", 400));
    }

    const [hashedOtp, expires] = hash.split("_");
    if (Date.now() > expires) {
        return next(new AppError("OTP expired!", 401));
    }

    const data = `${phone}.${otp}.${expires}`;
    const isValid = verifySentOTP(hashedOtp, data);

    if (!isValid) {
        return next(new AppError("Invalid OTP", 401));
    }

    //Find user in the db, create new user if not exists already
    let user = await User.findOne({ phone });
    if (!user) {
        user = await User.create({ phone });
    }

    //everything is okay, then send token to client
    createSendToken(user, 200, req, res);
});

export const activate = catchAsync(async (req, res, next) => {
    const { name, avatar } = req.body;
    if (!name || !avatar) {
        return next(new AppError("Name and Avatar are required!", 400));
    }

    // Uplaod user image to cloudinary
    const imageUrl = await uploadUserImage(name, avatar);

    // Update user
    const updatedUser = await User.findByIdAndUpdate(
        req.user._id,
        { name, avatar: imageUrl, activated: true },
        { new: true, runValidators: true }
    );

    const { __v, updatedAt, ...others } = updatedUser._doc;

    res.status(200).json({
        status: "success",
        user: others,
        isAuth: true,
    });
});

export const refresh = catchAsync(async (req, res, next) => {
    //get refresh token from cookie
    const { refreshToken } = req.cookies;

    if (!refreshToken) {
        return next(
            new AppError(
                "You are not logged in, please login to get access",
                401
            )
        ); //401 - Unauthorized
    }

    //check if token is valid
    const decoded = await verifyRefreshTokens(refreshToken);

    //check if token is in db
    const token = await Refresh.findOne({
        userId: decoded._id,
        token: refreshToken,
    });
    if (!token) {
        return next(
            new AppError(
                "You are not logged in, please login to get access",
                401
            )
        ); //401 - Unauthorized
    }

    //Check if user exist
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belongs to this token does no longer exist.",
                401
            )
        );
    }

    //generate new token
    //put in cookie and db
    //send response
    //all above three task is done by the below function
    createSendToken(currentUser, 200, req, res);
});

// Middleware to protect the protected route
export const protect = catchAsync(async (req, res, next) => {
    let accessToken;

    // 1) Get the token and check it's there
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith("Bearer")
    ) {
        accessToken = req.headers.authorization.split(" ")[1];
    } else if (req.cookies.accessToken) {
        accessToken = req.cookies.accessToken;
    }

    if (!accessToken) {
        return next(
            new AppError(
                "You are not logged in, please login to get access",
                401
            )
        ); //401 - Unauthorized
    }

    // 2) Varification of token
    const decoded = await verifyAccessTokens(accessToken);

    // 3) Check if user still exists
    const currentUser = await User.findById(decoded._id);
    if (!currentUser) {
        return next(
            new AppError(
                "The user belongs to this token does no longer exist.",
                401
            )
        );
    }

    // Grant access to the prodected rout
    req.user = currentUser;
    res.locals.user = currentUser;

    next();
});

export const logout = catchAsync(async (req, res) => {
    const { refreshToken } = req.cookies;
    //remove token from db
    await Refresh.deleteOne({ token: refreshToken });
    //remove token from cookie
    res.clearCookie("refreshToken");
    res.clearCookie("accessToken");

    req.user = undefined;
    res.locals.user = undefined;

    res.json({
        message: "User logged out",
        user: null,
        isAuth: false,
    });
});
