import "./App.css";
import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
    Outlet,
} from "react-router-dom";
import Home from "./pages/Home/Home";
import Navigation from "./components/Navigation/Navigation";
import Authenticate from "./pages/Authenticate/Authenticate";
import Activate from "./pages/Activate/Activate";
import { useSelector } from "react-redux";
import { useLoadingWithRefresh } from "./hooks/useLoadingWithRefresh";
import Loader from "./components/Loader/Loader";
import Rooms from "./pages/Rooms/Rooms";
import Room from "./pages/Room/Room";

function App() {
    const { loading } = useLoadingWithRefresh();
    console.log(loading);

    return loading ? (
        <Loader message="Loading, Please wait ...." />
    ) : (
        <BrowserRouter>
            <Navigation />
            <Routes>
                <Route element={<GuestRoute />}>
                    <Route path="/" exact element={<Home />} />
                    <Route path="/authenticate" element={<Authenticate />} />
                </Route>

                <Route element={<SemiProtectedRoute />}>
                    <Route path="/activate" element={<Activate />} />
                </Route>

                <Route element={<ProtectedRoute />}>
                    <Route path="/rooms" element={<Rooms />} />
                    <Route path="/room/:id" element={<Room />} />
                </Route>
            </Routes>
        </BrowserRouter>
    );
}

const GuestRoute = () => {
    const { isAuth } = useSelector((state) => state.auth);
    return isAuth ? <Navigate to={"/rooms"} replace /> : <Outlet />;
};

const SemiProtectedRoute = () => {
    const { user, isAuth } = useSelector((state) => state.auth);
    return !isAuth ? (
        <Navigate to={"/"} replace />
    ) : isAuth && !user.activated ? (
        <Outlet />
    ) : (
        <Navigate to={"/rooms"} />
    );
};

const ProtectedRoute = () => {
    const { user, isAuth } = useSelector((state) => state.auth);
    return !isAuth ? (
        <Navigate to={"/"} replace />
    ) : isAuth && !user.activated ? (
        <Navigate to={"/activate"} />
    ) : (
        <Outlet />
    );
};

export default App;
