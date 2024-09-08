/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
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
import { getGlobalState } from "../store/store";
import { audioActions } from "../store/audioSlice";

const INITIAL_GAIN = 0.01;

const HomeDevicesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ShowAudioPlayerButton = (props: { showAudioPlayer: boolean, setShowAudioPlayer: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {
    
    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "0.5em" }}>
            <button className="nav-button" style={{ cursor: "pointer",  margin: "0 auto", color: "white", padding: "0.5em" }} onClick={() => props.setShowAudioPlayer(!props.showAudioPlayer)}>
                {
                    props.showAudioPlayer ? "show spectrum analyser" : "show audio player"
                }
            </button>

        </div>
    );
};
interface AudioContextStartButtonProps { started: boolean, setStarted: React.Dispatch<React.SetStateAction<boolean>> };
const AudioContextStartButton = (props: AudioContextStartButtonProps): JSX.Element => {
    const dispatch = useDispatch();
    const { audioCtxRef, gainNodeRef, analyserNodeRef } = getGlobalState(useSelector);
    const ctxref = React.useRef<AudioContext>();
    const gainref = React.useRef<GainNode>();
    const analyserref = React.useRef<AnalyserNode>();

    useEffect(() => {
        if (props.started) {
            ctxref.current = new AudioContext();
            dispatch(audioActions.setAudioCtxRef(ctxref as any));
        }
    }, [dispatch, props.started]);

    useEffect(() => {
        if (audioCtxRef.current instanceof AudioContext) {
            console.log("state has context brooo", audioCtxRef);

            gainref.current = audioCtxRef.current.createGain();

            // DO ANY INITIALIZATION HERE 
            gainref.current.gain.value = INITIAL_GAIN;
            dispatch(audioActions.setGainRef(gainref as any));
            
            // DO ANY INITIALIZATION HERE 
            analyserref.current = audioCtxRef.current.createAnalyser();
            analyserref.current.fftSize = 2048;
            dispatch(audioActions.setSamplesLength(analyserref.current.frequencyBinCount));
            dispatch(audioActions.setAnalyserRef(analyserref as any));
            

        }
    }, [audioCtxRef, dispatch]);

    // final init with current required state
    useEffect(() => {
        if (audioCtxRef.current instanceof AudioContext
            && gainNodeRef.current instanceof GainNode
            && analyserNodeRef.current instanceof AnalyserNode
            
        ) {
            window.navigator.getUserMedia({ audio: true },
                async (stream) => {
                    // just grab the first track since chrome only has one input set as a "microphone input"
                    const audioTrack = stream.getAudioTracks()[0];

                    stream.removeTrack(audioTrack);

                    await audioTrack.applyConstraints({
                        autoGainControl: false,
                        noiseSuppression: false,
                        echoCancellation: false,
                    });

                    console.log("audio track", audioTrack);
                    console.log("audio track constraints", audioTrack.getConstraints());

                    stream.addTrack(audioTrack);

                    const source = audioCtxRef.current.createMediaStreamSource(stream);
                    
                    source.connect(gainNodeRef.current);
                    
                    gainNodeRef.current.connect(analyserNodeRef.current);
                    gainNodeRef.current.connect(audioCtxRef.current.destination);
                },
                (e) => {throw new Error("could not get usermedia" + e);}
            );
        }
    }, [gainNodeRef, dispatch, analyserNodeRef, audioCtxRef]);

    useEffect(() => {
        // if (analyserNodeRef.current instanceof AnalyserNode) {
        // }
        
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [analyserNodeRef, dispatch]);

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "0.5em" }}>
            <button style={{cursor: "pointer"}} className="nav-button" onClick={() => props.setStarted(!props.started)}>
                {
                    props.started ? "context started" : "start new audio context"
                }
            </button>
        </div>
    );
};

// audio player and big led box
const Home: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const history = useHistory();

    const { gainNodeRef } = getGlobalState(useSelector);

    const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
    const [started, setStarted] = React.useState(false);
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
                        <div style={{ display: "flex", justifyContent: "center", width: "100%"}}>
                            <input step="0.01" min="0" max="1" type="range" onInput={(e) => {
                                setGain(e.target.value);
                                if (gainNodeRef.current) {
                                    dispatch(audioActions.setGainRefGain(e.target.value));
                                }
                            }} value={gain} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%"}}>
                            <p style={{ margin: 0 }}>{gain}</p>
                        </div>
                        <AudioContextStartButton started={started} setStarted={setStarted}/>
                    </>
                ) 
            }
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
