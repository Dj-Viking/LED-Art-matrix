/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/ban-types */
import React, { useEffect, useRef } from "react";
import { useDispatch } from "react-redux";
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

const INITIAL_GAIN = 0.01;

const HomeDevicesWrapper = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
`;

const ShowAudioPlayerButton = (props: { ctx: any, showAudioPlayer: boolean, setShowAudioPlayer: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {
    
    useEffect(() => {
        console.log("ctx in another component", props.ctx);
    }, [props.ctx]);
    
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
interface AudioContextStartButtonProps { analyserNodeRef: React.MutableRefObject<AnalyserNode>, gainNodeRef: React.MutableRefObject<GainNode>, audioCtx: React.MutableRefObject<AudioContext>, started: boolean, setStarted: React.Dispatch<React.SetStateAction<boolean>> };
const AudioContextStartButton = (props: AudioContextStartButtonProps): JSX.Element => {


    useEffect(() => {
        if (props.started) {
            (async () => {
                
                // TODO: get microphone from usermedia after the user gesture
                props.audioCtx.current = new AudioContext();
                
                const source = props.audioCtx.current.createMediaStreamSource({ microphonegoeshere: "" } as any);

                props.gainNodeRef.current = props.audioCtx.current.createGain();
                props.analyserNodeRef.current = props.audioCtx.current.createAnalyser();
                props.analyserNodeRef.current.fftSize = 2048;
                const samplesLength = props.analyserNodeRef.current.frequencyBinCount;
                const samples = new Float32Array();
                props.analyserNodeRef.current.getFloatFrequencyData(samples);
                
                // TODO: stream connect to gain node
                source.connect(props.gainNodeRef.current);

                props.gainNodeRef.current.connect(props.analyserNodeRef.current);

                props.gainNodeRef.current.connect(props.audioCtx.current.destination);
                
            })();
        }
    }, [props.started, props.audioCtx, props.gainNodeRef, props.analyserNodeRef]);

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

    // this should probably be in redux so that we can have one copy that everyone can refer too (i think)
    // there should only be one audio context at a time
    const audioCtxRef = useRef<AudioContext>({} as any);
    const analyserNodeRef = useRef<AnalyserNode>({} as any);
    const gainNodeRef = useRef<GainNode>({} as any);

    console.log("current node ref", analyserNodeRef.current);

    const [showAudioPlayer, setShowAudioPlayer] = React.useState(false);
    const [started, setStarted] = React.useState(false);
    const [gain, setGain] = React.useState(INITIAL_GAIN);

    useEffect(() => {
        Auth.loggedIn() ? dispatch(loggedInActions.login()) : dispatch(loggedInActions.logout());
    }, [history, dispatch]);

    return (
        <>
            <ShowAudioPlayerButton ctx={audioCtxRef || null} showAudioPlayer={showAudioPlayer} setShowAudioPlayer={setShowAudioPlayer}/>
            {
                showAudioPlayer ? (
                    <AudioPlayerComponent />
                ) : (
                    <>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%"}}>
                            <input step="0.01" min="0" max="1" type="range" onInput={(e) => {
                                setGain(e.target.value);
                                gainNodeRef.current = {
                                    ...gainNodeRef.current,
                                    gain: e.target.value
                                };
                            }} value={gain} />
                        </div>
                        <div style={{ display: "flex", justifyContent: "center", width: "100%"}}>
                            <p style={{ margin: 0 }}>{gain}</p>
                        </div>
                        <AudioContextStartButton analyserNodeRef={analyserNodeRef} gainNodeRef={gainNodeRef} audioCtx={audioCtxRef || {} as any} started={started} setStarted={setStarted}/>
                    </>
                ) 
            }
            <HomeDevicesWrapper>
                <ArtScroller />
                <PresetButtons />
                <MIDIListenerWrapper />
                <Slider />

                <Canvas analyserNodeRef={analyserNodeRef} />
            </HomeDevicesWrapper>
        </>
    );
};

export default Home;
