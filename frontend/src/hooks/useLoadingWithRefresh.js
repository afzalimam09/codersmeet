import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { setAuth } from "../redux/authSlice";

export function useLoadingWithRefresh() {
    const [loading, setLoading] = useState(true);
    const dispatch = useDispatch();
    useEffect(() => {
        (async () => {
            try {
                const { data } = await axios.get(
                    `${process.env.REACT_APP_API_URL}/api/v1/auth/refresh`,
                    { withCredentials: true }
                );
                dispatch(setAuth(data));
            } catch (error) {
                console.log(error);
            } finally {
                setLoading(false);
            }
        })();
    }, [dispatch]);

    return { loading };
}
