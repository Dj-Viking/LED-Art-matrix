/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useEffect, useState } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIConnectionEvent, MIDIController, MIDIInput, MIDIMessageEvent, MIDIPortConnectionState } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { setAccess } from "../actions/midi-access-actions";
import { MyRootState } from "../types";
import { animVarCoeffChange } from "../actions/led-actions";
// import { animVarCoeffChange } from "../actions/led-actions";

interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const [size, setSize] = useState(0);
    const accessState = useSelector((state: MyRootState) => state.accessRecordState);

    useEffect(() => {
        (async (): Promise<void> => {
            if ("navigator" in window) {
                const access = await MIDIController.requestMIDIAccess();
                dispatch(setAccess(new MIDIController(access).getInstance()));
                setSize(access.inputs.size);
                if (size > 0) {
                    console.log("INPUTS BIGGER THAN ZERO", size);
                    setSize(access.inputs.size);
                    dispatch(setAccess(new MIDIController(access).getInstance()));
                    // define onstatechange callback to not be null
                    access.onstatechange = function (_event: MIDIConnectionEvent): void {
                        console.log(Date.now(), "event midi access onstatechange", _event.target);

                        const onstatechangeAccess = new MIDIController(_event.target).getInstance();
                        const midicb = function (midi_event: MIDIMessageEvent): void {
                            dispatch(animVarCoeffChange((midi_event.data[2]).toString()));
                            console.log("MIDI EVENT SET INPUT CB CALLBACK", midi_event);
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
                    // TODO: // MAKE AS OWN COMPONENT
                    return (
                        <div key={keyGen()} style={{ display: "flex", flexDirection: "column" }}>
                            <h2 key={keyGen()}>MIDI Device {i + 1}</h2>
                            <div key={keyGen()} style={{ border: input.state === "connected" ? "solid 1px green" : " solid 1px red" }}> 
                                <span key={keyGen()}>
                                    
                                    Connection: { input.connection } 
                                    
                                    <div key={keyGen()} style={{ width: "40px", marginTop: "1em", height: "40px", backgroundColor: input.connection === MIDIPortConnectionState.closed ? "red" : "green", borderRadius: "50%", border: "solid purple 1px" }}></div> 

                                </span>
                                <p key={keyGen()}>{input.name}</p>
                            </div>
                        </div>
                    );
                }) : "MIDI OFFLINE"
            }
        </>
    );
};

export default MIDIListenerWrapper;