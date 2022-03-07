/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIConnectionEvent, MIDIController, MIDIInput, MIDIMessageEvent } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { setAccess } from "../actions/midi-access-actions";
import { MyRootState } from "../types";
import { animVarCoeffChange } from "../actions/led-actions";

interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const accessState = useSelector((state: MyRootState) => state.accessRecordState); 
    const [size, setSize] = useState<number>(0);
    const [intensity, setIntensity] = useState<number>(0);
    const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

    useEffect(() => {
        (async (): Promise<void> => {
            if ("navigator" in window) {
                const access = await MIDIController.requestMIDIAccess();
                dispatch(setAccess(new MIDIController(access).getInstance()));
                setSize(access.inputs.size);
                if (size > 0) {
                    dispatch(setAccess(new MIDIController(access).getInstance()));
                    // define onstatechange callback to not be a function to execute when state changes later
                    access.onstatechange = function (_event: MIDIConnectionEvent): void {
                        
                        const onstatechangeAccess = new MIDIController(_event.target).getInstance();

                        const midicb = function (midi_event: MIDIMessageEvent): void {
                            clearTimeout(filterTimeoutRef.current);
                            if (midi_event.currentTarget.name.includes("XONE:K2")) {

                                setIntensity(midi_event.data[2]);
                                console.log("dump data", midi_event);

                                //slight debounce to help with limiting dispatch
                                filterTimeoutRef.current = setTimeout(() => {
                                    dispatch(animVarCoeffChange((midi_event.data[2]).toString()));
                                }, 10);

                            }
                        };

                        const onstatechangecb = function(connection_event: MIDIConnectionEvent): void {
                            console.log("CONNECTION EVENT SET INPUT CB CALLBACK", connection_event);
                        };

                        dispatch(setAccess(onstatechangeAccess, midicb, onstatechangecb));
                    };
                } // endif size > 0 
                //accessState dead zone
            }
        })();
        // @ts-ignore
    }, [dispatch, accessState.inputs.length, size]);

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
                                    <span key={keyGen()}>
                                        
                                        Connection: { input.connection } 
                                        
                                        <div key={keyGen()} style={{ margin: "1em auto 1em auto", width: "40px", height: "0px", backgroundColor: input.connection === "connected" ? "black" : "black", borderRadius: "50%", border: "solid black 1px" }}></div> 
    
                                        <span>
                                            { 
                                                input.name.includes("XONE:K2") && (
                                                    `Intensity: ${intensity}`
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
                }) : "MIDI OFFLINE"
            }
        </>
    );
};

export default MIDIListenerWrapper;