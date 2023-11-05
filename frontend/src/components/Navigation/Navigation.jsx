import React from "react";
import { Link } from "react-router-dom";
import styles from "./Navigation.module.css";
import { logout } from "../../http";
import { useDispatch, useSelector } from "react-redux";
import { setAuth } from "../../redux/authSlice";

const brandStyle = {
    color: "#fff",
    textDecoration: "none",
    fontWeight: "bold",
    fontSize: "22px",
    display: "flex",
    alignItems: "center",
};

const logoText = {
    marginLeft: "10px",
};

const Navigation = () => {
    const dispatch = useDispatch();
    const { isAuth, user } = useSelector((state) => state.auth);

    const handleLogout = async () => {
        try {
            const { data } = await logout();
            dispatch(setAuth(data));
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <nav className={`${styles.navbar} container`}>
            <Link style={brandStyle} to="/">
                <img src="/images/logo.png" alt="logo" />
                <span style={logoText}>CodersMeet</span>
            </Link>
            {isAuth && (
                <div className={styles.navRight}>
                    <h3>{user?.name}</h3>
                    <Link to="/">
                        <img
                            className={styles.avatar}
                            src={
                                user.avatar
                                    ? user.avatar
                                    : "/images/monkey-avatar.png"
                            }
                            alt="avatar"
                            width="40"
                            height="40"
                        />
                    </Link>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        <img src="/images/logout.png" alt="logout" />
                    </button>
                </div>
            )}
        </nav>
    );
};

export default Navigation;
