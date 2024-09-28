/* eslint-disable @typescript-eslint/no-empty-interface */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getGlobalState } from "../../store/store";
import { audioActions } from "../../store/audioSlice";
import { INITIAL_GAIN } from "../../constants";
import { StyledSliderLabel } from "../ArtScroller.style";
import { MIDIMappingPreference } from "../../utils/MIDIMappingClass";

function getGainControlDisplayValue(gainNodeRef: React.MutableRefObject<GainNode>): number | string {
    if (gainNodeRef.current && gainNodeRef.current.gain && gainNodeRef.current.gain.value) {
        if (gainNodeRef.current.gain.value >= 0.09) {
            return gainNodeRef.current.gain.value;
        } else {
            return "0";
        }
    } else {
        return "0";
    }
}
const GainControlLabel: React.FC = () => {
    const {
        gainNodeRef,
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);
    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
        midiMappingInUse.midiMappingPreference[controllerInUse],
        "gainValue"
    );
    const value = getGainControlDisplayValue(gainNodeRef);

    return (
        <div style={{ display: "flex", justifyContent: "center", margin: "0 auto"}}>
            <StyledSliderLabel>
                <p>
                    {midiEditMode && `<MIDI> (${uiMapping})`}  
                </p>
                <p>
                    Gain: {Number(value)}
                </p>
            </StyledSliderLabel>
        </div>
    );
};

export const GainControl: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const { gainNodeRef, midiEditMode } = getGlobalState(useSelector);

    const value = getGainControlDisplayValue(gainNodeRef);
    
    return (
        <>
            <GainControlLabel />
            <div style={{ display: "flex", justifyContent: "center", width: "100%" }}>
                <input
                    style={{ width: "50%"}}
                    className="myrangestyle"
                    step="0.01"
                    min="0"
                    max="1"
                    type="range"
                    onClick={() => {
                        midiEditMode && MIDIMappingPreference.listeningForEditsHandler(dispatch, "gainValue");
                    }}
                    onInput={(e) => {
                        if (!midiEditMode) {
                            if (gainNodeRef.current) {
                                if (!midiEditMode) {
                                    dispatch(audioActions.setGainRefGain(e.target.value));
                                }
                            }
                        }
                    }}
                    value={value}
                />
            </div>
        </>
    );
};

export const AudioContextStartButton: React.FC = () => {
    const dispatch = useDispatch();
    const { audioCtxRef, gainNodeRef, analyserNodeRef, started, outputtingToHardware } = getGlobalState(useSelector);
    const ctxref = React.useRef<AudioContext>();
    const gainref = React.useRef<GainNode>();
    const analyserref = React.useRef<AnalyserNode>();

    useEffect(() => {
        if (started) {
            // if i start a new context again it's going to mess up
            // all the connections made in a previous render cycle
            // so only instantiate a new one as the first one that 
            // exists ever and just use a reference to it everywhere using redux
            if (!(ctxref.current instanceof AudioContext)) {
                ctxref.current = new AudioContext();
                dispatch(audioActions.setAudioCtxRef(ctxref as any));
            }
        }
    }, [dispatch, started]);

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
                    dispatch(audioActions.setOutputtingToHardware(true));
                },
                (e) => {throw new Error("could not get usermedia" + e);}
            );
        }
    }, [dispatch, gainNodeRef, analyserNodeRef, audioCtxRef]);

    React.useEffect(() => {
        if (
            audioCtxRef.current instanceof AudioContext
            && gainNodeRef.current instanceof GainNode 
        ) {
            // prevent feedback unless explicitly wanting it for shits and giggles
            // you'll have to implement it yourself to connect the nodes again programmatically
            if (outputtingToHardware) {
                gainNodeRef.current.disconnect(audioCtxRef.current.destination);   
            }
        }
    }, [
        audioCtxRef,
        gainNodeRef,
        outputtingToHardware
    ]);

    return (
        <div style={{ width: "100%", display: "flex", justifyContent: "center", padding: "0.5em" }}>
            <button style={{cursor: "pointer"}} className="nav-button" 
                onClick={() => dispatch(audioActions.setStarted((!started)))}>
                {
                    started ? "context started" : "start new audio context"
                }
            </button>
        </div>
    );
};

export const ShowAudioPlayerButton = (props: { showAudioPlayer: boolean, setShowAudioPlayer: React.Dispatch<React.SetStateAction<boolean>> }): JSX.Element => {
    
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