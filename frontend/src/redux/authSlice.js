import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuth: false,
    user: null,
    otp: {
        hash: "",
        phone: "",
    },
};

export const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        setAuth: (state, action) => {
            const { user, isAuth } = action.payload;
            state.isAuth = isAuth;
            state.user = user;
        },
        setOtp: (state, action) => {
            const { hash, phone } = action.payload;
            state.otp.phone = phone;
            state.otp.hash = hash;
        },
    },
});

// Action creators are generated for each case reducer function
export const { setAuth, setOtp } = authSlice.actions;

export default authSlice.reducer;
