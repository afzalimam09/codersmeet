import React, { useState } from "react";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import styles from "./StepOtp.module.css";
import TextInput from "../../../components/TextInput/TextInput";
import { verifyOTP } from "../../../http";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { setAuth } from "../../../redux/authSlice";

const StepOtp = ({ onNext }) => {
    const { phone, hash } = useSelector((state) => state.auth.otp);
    const dispatch = useDispatch();
    const [otp, setOtp] = useState("");

    const handleSubmit = async () => {
        if (!otp || !phone || !hash) return;
        try {
            const { data } = await verifyOTP({ otp, phone, hash });
            dispatch(setAuth(data));
            console.log(data);
        } catch (error) {
            console.log(error);
        }
    };
    return (
        <>
            <div className={styles.cardWrapper}>
                <Card
                    title={"Enter the code we just texted you"}
                    icon={"lock-emoji"}
                >
                    <TextInput
                        value={otp}
                        type="number"
                        onChange={(e) => setOtp(e.target.value)}
                    />
                    <div>
                        <div className={styles.actionBtnWrap}>
                            <Button onClick={handleSubmit} text={"Next"} />
                        </div>
                        <p className={styles.bottomParagraph}>
                            By entering your number, you're agreeing to our
                            Terms of Service and Privacy Policy. Thanks!
                        </p>
                    </div>
                </Card>
            </div>
        </>
    );
};

export default StepOtp;
