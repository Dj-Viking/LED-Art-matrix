import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import { AuthService as Auth } from "../utils/AuthService";
import { login, logout } from "../actions/logged-in-actions";
// components
import AudioPlayerComponent from "../components/AudioPlayer";
import BigLedBox from "../components/BigLedBox";
import { useHistory } from "react-router-dom";

// audio player and big led box
const Home: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        Auth.loggedIn() ? dispatch(login()) : dispatch(logout());
    }, [history, dispatch]);

    return (
        <>
            <AudioPlayerComponent />
            <BigLedBox />
        </>
    );
};

export default Home;
