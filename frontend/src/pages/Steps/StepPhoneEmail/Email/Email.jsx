import React, { useState } from "react";
import Card from "../../../../components/Card/Card";
import Button from "../../../../components/Button/Button";
import TextInput from "../../../../components/TextInput/TextInput";
import styles from "../PhoneEmail.module.css";

const Email = ({ onNext }) => {
    const [email, setEmail] = useState("");

    return (
        <Card title={"Enter your Email Id"} icon={"email-emoji"}>
            <TextInput
                value={email}
                type="email"
                onChange={(e) => setEmail(e.target.value)}
            />
            <div>
                <div className={styles.actionBtnWrap}>
                    <Button onClick={onNext} text={"Next"} />
                </div>
                <p className={styles.bottomParagraph}>
                    By entering your email, you're agreeing to our Terms of
                    Service and Privacy Policy. Thanks!
                </p>
            </div>
        </Card>
    );
};

export default Email;
