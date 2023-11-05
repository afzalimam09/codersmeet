import React, { useState } from "react";
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import TextInput from "../../../../components/TextInput/TextInput";
import styles from "../PhoneEmail.module.css";
import { sendOTP } from "../../../../http";
import { useDispatch } from "react-redux";
import { setOtp } from "../../../../redux/authSlice";

const Phone = ({ onNext }) => {
    const dispatch = useDispatch();
    const [phone, setPhone] = useState("");

    const handleSubmit = async () => {
        if (!phone) return;
        try {
            const { data } = await sendOTP({ phone });
            console.log(data);
            dispatch(setOtp({ phone: data?.phone, hash: data?.hash }));
            onNext();
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <Card title={"Enter your phone number"} icon={"phone"}>
            <TextInput
                type="number"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
            />
            <div>
                <div className={styles.actionBtnWrap}>
                    <Button onClick={handleSubmit} text={"Next"} />
                </div>
                <p className={styles.bottomParagraph}>
                    By entering your number, you're agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Phone;
