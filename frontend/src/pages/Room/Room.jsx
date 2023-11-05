import { useWebRTC } from "../../hooks/useWebRTC";
import styles from "./Room.module.css";
import { useNavigate, useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getRoom } from "../../http";

const Room = () => {
    const { id: roomId } = useParams();
    const user = useSelector((state) => state.auth.user);
    const { clients, provideRef, handleMute } = useWebRTC(roomId, user);
    const navigate = useNavigate();
    const [room, setRoom] = useState(null);
    const [isMute, setMute] = useState(true);

    useEffect(() => {
        handleMute(isMute, user._id);
    }, [isMute]);

    useEffect(() => {
        const fetchRoom = async () => {
            const { data } = await getRoom(roomId);
            setRoom(() => data?.room);
        };
        fetchRoom();
    }, [roomId]);

    const handleMuteClick = (clientId) => {
        if (clientId !== user._id) return;
        setMute((isMute) => !isMute);
    };

    return (
        <div>
            <div className="container">
                <button onClick={() => navigate("/")} className={styles.goBack}>
                    <img src="/images/arrow-left.png" alt="arrow left" />
                    <span>All voice rooms</span>
                </button>
            </div>
            <div className={styles.clientsWrap}>
                <div className={styles.header}>
                    <h2 className={styles.topic}>{room?.topic}</h2>
                    <div className={styles.actions}>
                        <button className={styles.actionBtn}>
                            <img src="/images/palm.png" alt="palm-icon" />
                        </button>
                        <button
                            onClick={() => navigate("/")}
                            className={styles.actionBtn}
                        >
                            <img src="/images/win.png" alt="win-icon" />
                            <span>Leave Quitly</span>
                        </button>
                    </div>
                </div>
                <div className={styles.clientsList}>
                    {clients.map((client) => (
                        <div key={client._id} className={styles.client}>
                            <div className={styles.userHead}>
                                <audio
                                    ref={(instance) =>
                                        provideRef(instance, client._id)
                                    }
                                    // controls
                                    autoPlay
                                ></audio>
                                <img
                                    className={styles.userAvatar}
                                    src={client.avatar}
                                    alt="avatar"
                                />
                                <button
                                    onClick={() => handleMuteClick(client._id)}
                                    className={styles.micBtn}
                                >
                                    {client.muted ? (
                                        <img
                                            src="/images/mic-mute.png"
                                            alt="mic-mute-icon"
                                        />
                                    ) : (
                                        <img
                                            src="/images/mic.png"
                                            alt="mic-icon"
                                        />
                                    )}
                                </button>
                            </div>
                            <h4>{client.name}</h4>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Room;
