/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect } from "react";
import { useDispatch } from "react-redux";
import Auth from "../utils/AuthService";

import AudioPlayerComponent from "../components/AudioPlayer/AudioPlayer";
import { useHistory } from "react-router-dom";
import { loggedInActions } from "../store/loggedInSlice";
import { Canvas } from "../components/Canvas";
import { ArtScroller } from "../components/ArtScroller";
import { PresetButtons } from "../components/PresetButtons";
import { MIDIListenerWrapper } from "../components/MIDIListenerWrapper";
import { AudioSliderThing1, AudioSliderThing2, Slider } from "../components/Slider";
import styled from "styled-components";
import { AudioContextStartButton, GainControl, ShowAudioPlayerButton } from "../components/AudioPlayer/AudioAnalyserInit";
import { INITIAL_GAIN } from "../constants";
import { ShowScrollerButtonToggle } from "../components/ArtScroller.style";


const HomeDevicesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

// audio player and big led box
const Home: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const history = useHistory();

    const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
    const [showscroller, setshowscroller] = React.useState(false);
    const [gain, setGain] = React.useState(INITIAL_GAIN);

    useEffect(() => {
        Auth.loggedIn() ? dispatch(loggedInActions.login()) : dispatch(loggedInActions.logout());
    }, [history, dispatch]);

    return (
        <>
            <ShowAudioPlayerButton showAudioPlayer={showAudioPlayer} setShowAudioPlayer={setShowAudioPlayer}/>
            {
                showAudioPlayer ? (
                    <AudioPlayerComponent />
                ) : (
                    <>
                        <GainControl gain={gain} setGain={setGain} />
                        <AudioContextStartButton />
                    </>
                ) 
            }
            <HomeDevicesWrapper>
                <ShowScrollerButtonToggle setshowscroller={setshowscroller} showscroller={showscroller} />
                {
                    showscroller && (
                        <ArtScroller />
                    )
                }
                <PresetButtons />
                <MIDIListenerWrapper />
                <Slider />
                <AudioSliderThing1 />
                <AudioSliderThing2 />

                <Canvas />
            </HomeDevicesWrapper>
        </>
    );
};

export default Home;
