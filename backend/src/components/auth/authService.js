import crypto from "crypto";
import config from "../../core/config.js";
import jwt from "jsonwebtoken";
import { promisify } from "util";
import { cloudinary } from "../../utils/cloudinary.js";
const { sign, verify } = jwt;

const generateOTP = () => {
    return crypto.randomInt(1000, 9999);
};

const hashOTP = (data) => {
    return crypto
        .createHmac("sha256", config.otp.hashSecret)
        .update(data)
        .digest("hex");
};

const sendOTPbySMS = async (phone, otp) => {
    return await twilio.messages.create({
        to: phone,
        from: "+916206864101",
        body: `Your Coders Meet OTP is ${otp}`,
    });
};

const verifySentOTP = (hashedOTP, data) => {
    const computedHash = hashOTP(data);
    return computedHash === hashedOTP;
};

const generateTokens = (payload) => {
    const accessToken = sign(payload, config.jwt.accessTokenSecret, {
        expiresIn: "10m",
    });
    const refreshToken = sign(payload, config.jwt.refreshTokenSecret, {
        expiresIn: "90d",
    });

    return { accessToken, refreshToken };
};

const verifyAccessTokens = async (token) => {
    return await promisify(verify)(token, config.jwt.accessTokenSecret);
};
const verifyRefreshTokens = async (token) => {
    return await promisify(verify)(token, config.jwt.refreshTokenSecret);
};

const uploadUserImage = async (name, avatar) => {
    const imageTitle = name.split(" ").join("-") + "-" + Date.now();
    const uploadRes = await cloudinary.uploader.upload(avatar, {
        upload_preset: "codersmeet",
        overwrite: true,
        folder: `codersmeet/users`,
        public_id: imageTitle,
        unique_filename: true,
        transformation: [{ width: 150, height: 150 }],
    });
    return uploadRes.secure_url;
};

export {
    generateOTP,
    hashOTP,
    sendOTPbySMS,
    verifySentOTP,
    generateTokens,
    verifyAccessTokens,
    uploadUserImage,
    verifyRefreshTokens,
};
