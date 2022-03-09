/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIConnectionEvent, MIDIController, MIDIInput, MIDIMessageEvent } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { setAccess } from "../actions/midi-access-actions";
import { MyRootState } from "../types";
import { animVarCoeffChange } from "../actions/led-actions";
import { XONEK2_MIDI_CHANNEL_TABLE } from "../constants";
import { setAnimDuration, setCircleWidth, setHPos, setInvert, setVertPos } from "../actions/art-scroller-actions";
import IntensityBar from "./IntensityBar";

interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const accessState = useSelector((state: MyRootState) => state.accessRecordState); 
    const { figureOn } = useSelector((state: MyRootState) => state.artScrollerState); 
    const [ size, setSize ] = useState<number>(0);
    const [ intensity, setIntensity ] = useState<number>(0);
    // channel four is xone:k2's upper left most knob above the first fader
    const [ channel, setChannel ] = useState<number>(4);
    const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

    useEffect(() => {
        (async (): Promise<void> => {
            if ("navigator" in window) {
                // request access from browser
                const access = await MIDIController.requestMIDIAccess();
                dispatch(setAccess(new MIDIController(access).getInstance()));
                // set size of inputs to re-render component at this moment of time
                setSize(access.inputs.size);
                //at this moment the promise resolves with access if size changed at some point
                if (size > 0) {
                    dispatch(setAccess(new MIDIController(access).getInstance()));
                    // define onstatechange callback to not be a function to execute when state changes later
                    access.onstatechange = function (_event: MIDIConnectionEvent): void {
                        
                        const onstatechangeAccess = new MIDIController(_event.target).getInstance();

                        const midicb = function (midi_event: MIDIMessageEvent): void {
                            clearTimeout(filterTimeoutRef.current);
                            if (midi_event.currentTarget.name.includes("XONE:K2")) {

                                const midi_intensity = midi_event.data[2];
                                const midi_channel = midi_event.data[1];

                                setChannel(midi_channel);
                                setIntensity(midi_intensity);

                                // console.log("dump data", midi_event);
                                switch(XONEK2_MIDI_CHANNEL_TABLE[midi_channel]) {
                                    case "1_upper_knob":
                                        filterTimeoutRef.current = setTimeout(() => {
                                            dispatch(setCircleWidth(midi_intensity.toString()));
                                        }, 20);
                                    break;
                                    case "1_middle_knob":
                                        filterTimeoutRef.current = setTimeout(() => {
                                            dispatch(setVertPos(midi_intensity.toString()));
                                        }, 20); 
                                    break;
                                    case "1_lower_knob": 
                                        filterTimeoutRef.current = setTimeout(() => {
                                            dispatch(setHPos(midi_intensity.toString()));
                                        }, 20);
                                    break;
                                    case "2_upper_knob": 
                                        filterTimeoutRef.current = setTimeout(() => {
                                            dispatch(setInvert(midi_intensity.toString()));
                                        }, 20);
                                    break;
                                    case "2_middle_knob": 
                                        filterTimeoutRef.current = setTimeout(() => {
                                            dispatch(setAnimDuration(midi_intensity.toString()));
                                        }, 20);
                                    break;
                                    // RATHER USE KEYS INSTEAD OF MIDI CONTROLLER BUTTONS
                                    case "1_upper_button": 
                                        // filterTimeoutRef.current = setTimeout(() => {
                                        //     dispatch(setFigureOn(figureOn ? true : false));
                                        // }, 100);
                                        void 0;
                                    break;
                                    case "1_fader": 
                                        // filterTimeoutRef.current = setTimeout(() => {
                                        //     dispatch(setFigureOn(figureOn ? true : false));
                                        // }, 100);
                                        //slight debounce to help with limiting dispatch
                                        filterTimeoutRef.current = setTimeout(() => {
                                            dispatch(animVarCoeffChange((midi_intensity).toString()));
                                        }, 10);
                                    break;
                                    default: break;
                                }
                            }
                        };

                        const onstatechangecb = function(_connection_event: MIDIConnectionEvent): void {
                            // console.log("CONNECTION EVENT SET INPUT CB CALLBACK", connection_event);
                        };

                        dispatch(setAccess(onstatechangeAccess, midicb, onstatechangecb));
                    };// end onstatechange def
                } // endif size > 0 
                // accessState dead zone
            }// endif "navigator" in window
        })();
    }, [dispatch, accessState.inputs.length, size, figureOn]);

    return (
        <>
            {
                // @ts-ignore
                accessState.online ? accessState.inputs!.map((input: MIDIInput, i: number, _arr: Array<MIDIInput>) => {
                    if (input.name.includes("XONE:K2")) {
                        return (
                            <div key={keyGen()} style={{ display: "flex", flexDirection: "column" }}>
                                <h2 key={keyGen()}>MIDI Device {i + 1}</h2>
                                <div key={keyGen()} style={{ width: "50%", margin: "0 auto", border: input.state === "connected" ? "solid 1px green" : " solid 1px red" }}> 
                                    <p key={keyGen()} style={{marginBottom: "1em"}}>
                                        {input.name}
                                    </p>
                                    <span key={keyGen()}>
                                        
                                        Connection: { input.connection } 
                                        
                                        <div key={keyGen()} style={{ margin: "0 auto 0 auto", width: "40px", height: "0px", backgroundColor: input.connection === "connected" ? "black" : "black", borderRadius: "50%", border: "solid black 1px" }}></div> 
    
                                        <span>
                                            { 
                                                input.name.includes("XONE:K2") && (
                                                    <>
                                                        <p>
                                                            Intensity: {intensity} 

                                                            <IntensityBar intensity={intensity} />
                                                        </p>
                                                        <p>
                                                            Channel: { channel }
                                                        </p>
                                                    </>
                                                )
                                            }
                                        </span>
    
                                    </span>
                                    <p key={keyGen()}>{input.name}</p>
                                </div>
                            </div>
                        );
                    } else { //only want to display xone:k2 device
                        return null;
                    }
                }) : <p>MIDI OFFLINE</p>
            }
        </>
    );
};

export default MIDIListenerWrapper;