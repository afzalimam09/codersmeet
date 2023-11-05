import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import activateSlice from "./activateSlice";

export const store = configureStore({
    reducer: {
        auth: authReducer,
        activate: activateSlice,
    },
});
