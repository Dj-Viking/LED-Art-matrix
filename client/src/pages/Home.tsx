import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Auth from "../utils/AuthService";

import AudioPlayerComponent from "../components/AudioPlayer/AudioPlayer";
import { useHistory } from "react-router-dom";
import { loggedInActions } from "../store/loggedInSlice";
import { Canvas } from "../components/Canvas";
import { ArtScroller } from "../components/ArtScroller";
import { PresetButtons } from "../components/PresetButtons";
import { MIDIListenerWrapper } from "../components/MIDIListenerWrapper";
import { Slider } from "../components/Slider";
import styled from "styled-components";

const HomeDevicesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

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
            <HomeDevicesWrapper>
                <ArtScroller />
                <PresetButtons />
                <MIDIListenerWrapper />
                <Slider />

                <Canvas />
            </HomeDevicesWrapper>
        </>
    );
};

export default Home;
