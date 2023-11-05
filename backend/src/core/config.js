import dotenv from "dotenv-safe";
dotenv.config();

export default {
    db: {
        str: process.env.DB_URL,
        options: {
            useNewUrlParser: true,
            useUnifiedTopology: false,
        },
    },
    otp: {
        hashSecret: process.env.OTP_HASH_SECRET,
        ttl: process.env.OTP_TTL,
    },
    jwt: {
        accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
        refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
    },
    cloudinary: {
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
        api_key: process.env.CLOUDINARY_API_NAME,
        api_secret: process.env.CLOUDINARY_API_SECRET,
    },
};
