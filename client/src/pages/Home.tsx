import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Auth from "../utils/AuthService";

import AudioPlayerComponent from "../components/AudioPlayer";
import { useHistory } from "react-router-dom";
import { loggedInActions } from "../store/loggedInSlice";
import { Canvas } from "../components/Canvas";
import { ArtScroller } from "../components/ArtScroller";
import { PresetButtons } from "../components/PresetButtons";

// audio player and big led box
const Home: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const history = useHistory();

    useEffect(() => {
        Auth.loggedIn() ? dispatch(loggedInActions.login()) : dispatch(loggedInActions.logout());
    }, [history, dispatch]);

    return (
        <>
            <AudioPlayerComponent />
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <ArtScroller />
                <PresetButtons />
                <Canvas />
            </div>
        </>
    );
};

export default Home;
