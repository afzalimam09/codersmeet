import React, { useState } from "react";
import Card from "../../../components/Card/Card";
import Button from "../../../components/Button/Button";
import styles from "./StepAvatar.module.css";
import { useDispatch, useSelector } from "react-redux";
import { setAvatar } from "../../../redux/activateSlice";
import { activate } from "../../../http";
import { setAuth } from "../../../redux/authSlice";
import Loader from "../../../components/Loader/Loader";

const StepAvatar = ({ onNext }) => {
    const dispatch = useDispatch();
    const { name, avatar } = useSelector((state) => state.activate);
    const [image, setImage] = useState("/images/monkey-avatar.png");
    const [loading, setLoading] = useState(false);
    const captureImage = (e) => {
        const file = e.target.files[0];
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
            setImage(reader.result);
            dispatch(setAvatar(reader.result));
        };
    };
    const handleSubmit = async () => {
        if (!name || !avatar) return;
        setLoading(true);
        try {
            const { data } = await activate({ name, avatar });
            if (data.isAuth) {
                dispatch(setAuth(data));
            }
            console.log(data);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <Loader message="Activation in progress...." />;
    return (
        <>
            <Card title={`Okay, ${name}!`} icon={"monkey-emoji"}>
                <p className={styles.subHeading}>How's this photo</p>
                <div className={styles.avatarWrapper}>
                    <img
                        className={styles.avatarImage}
                        src={image}
                        alt="avatar"
                    />
                </div>
                <div className={styles.avatarBox}>
                    <input
                        onChange={captureImage}
                        type="file"
                        className={styles.avatarInput}
                        id="avatarInput"
                    />
                    <label className={styles.avatarLabel} htmlFor="avatarInput">
                        Choose a different photo
                    </label>
                </div>
                <div>
                    <Button onClick={handleSubmit} text={"Next"} />
                </div>
            </Card>
        </>
    );
};

export default StepAvatar;
