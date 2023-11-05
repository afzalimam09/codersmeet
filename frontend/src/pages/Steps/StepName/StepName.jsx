import React, { useState } from "react";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import TextInput from "../../../components/TextInput/TextInput";
import { useDispatch, useSelector } from "react-redux";
import { setName } from "../../../redux/activateSlice";
import styles from "./StepName.module.css";

const StepName = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name } = useSelector((state) => state.activate);
    const [fullname, setFullname] = useState(name);

    const nextStep = () => {
        if (!fullname) return;
        dispatch(setName(fullname));
        onNext();
    };

    return (
        <>
            <Card title={"What is your fullname"} icon={"goggle-emoji"}>
                <TextInput
                    value={fullname}
                    type="text"
                    onChange={(e) => setFullname(e.target.value)}
                />
                <div>
                    <p className={styles.paragraph}>
                        People use real names at coders meet!
                    </p>
                    <div>
                        <Button onClick={nextStep} text={"Next"} />
                    </div>
                </div>
            </Card>
        </>
    );
};

export default StepName;
