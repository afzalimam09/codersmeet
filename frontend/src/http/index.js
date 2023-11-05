import axios from "axios";
const apiURL = process.env.REACT_APP_API_URL;

const api = axios.create({
    baseURL: `${apiURL}/api/v1`,
    withCredentials: true,
    headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
    },
});

export const sendOTP = (data) => api.post("/auth/send-otp", data);
export const verifyOTP = (data) => api.post("/auth/verify-otp", data);
export const activate = (data) => api.post("/auth/activate", data);
export const logout = () => api.post("/auth/logout");
export const createRoom = (data) => api.post("/rooms", data);
export const getAllRooms = () => api.get("/rooms");
export const getRoom = (roomId) => api.get(`/rooms/${roomId}`);

api.interceptors.response.use(
    (config) => {
        return config;
    },
    async (error) => {
        const originalRequest = error.config;
        const isTokenExpired =
            error.response.data.error.name === "TokenExpiredError";

        if (
            (error.response.status === 401 || isTokenExpired) &&
            originalRequest &&
            !originalRequest._isRetry
        ) {
            originalRequest._isRetry = true;
            try {
                await axios.get(`${apiURL}/api/v1/auth/refresh`, {
                    withCredentials: true,
                });

                return api.request(originalRequest);
            } catch (error) {
                console.log(error);
            }
        }
        throw error;
    }
);

export default api;
