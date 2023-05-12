import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Auth from "../utils/AuthService";
// components
import AudioPlayerComponent from "../components/AudioPlayer";
import BigLedBox from "../components/BigLedBox";
import { useHistory } from "react-router-dom";
import { loggedInActions } from "../store/loggedInSlice";

// audio player and big led box
const Home: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        console.log("what is logged in", Auth.loggedIn());
        Auth.loggedIn() ? dispatch(loggedInActions.login()) : dispatch(loggedInActions.logout());
    }, [history, dispatch]);

    return (
        <>
            <AudioPlayerComponent />
            <BigLedBox />
        </>
    );
};

export default Home;
