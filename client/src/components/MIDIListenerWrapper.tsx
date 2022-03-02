/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIConnectionEvent, MIDIController } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { setAccess } from "../actions/midi-access-actions";
import { MyRootState } from "../types";

interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const [size, setSize] = useState(0);
    const accessState = useSelector((state: MyRootState) => state.accessRecordState);
    const MyMIDIController = useRef<MIDIController>();
    // TODO: extract access state object to redux

    // function checkDepDiff (newDep: any, oldDep: any): boolean {
    //   return JSON.stringify(newDep) !== JSON.stringify(oldDep);
    // }

    useEffect(() => {
        (async (): Promise<void> => {
            if ("navigator" in window) {
                console.log("navigator in window");
                // define onstatechange callback to not be null
                const access = await MIDIController.requestMIDIAccess();
                console.log("before dispatch");
                dispatch(setAccess(access));
                console.log("after dispatch");
                setSize(access.inputs.size);
                if (size > 0) {
                    access.onstatechange = function (event: MIDIConnectionEvent): void {
                        console.log(Date.now(), "event midi access onstatechange", event);
                        //set up the onstatechange for the inputs of the access object whose onstatechange function event listener was ran
                        for (let i = 0; i < access.inputs.size; i++) {
                            console.log("iterating through the inputs to set their onstatechange functions", access.inputs.values().next().value);

                            access.inputs.values().next().value.onstatechange = function (event: any) {
                                console.log(Date.now(), "onstatechange event fired on MIDIInput", event);

                                dispatch(setAccess(new MIDIController(access).getAccess()));

                                console.log("my midi controller access state", accessState);
                            };

                        }
                        dispatch(setAccess(access));
                        MyMIDIController.current = new MIDIController(access).getInstance();
                        console.log("get instance ref", MyMIDIController.current.getInstance());
                        console.log("my midi controller in for loop", MyMIDIController);
                        console.log("my midi controller inputs forlooop after access onstatechange", MyMIDIController.current.inputs);
                        dispatch(setAccess(access));
                    };
                    MyMIDIController.current = new MIDIController(access);

                    // if state change event happened update the MIDI controller state
                    // if () {

                    // }
                } // endif size > 0

            }
        })();
    }, [dispatch, accessState.inputs.length, size]);

    return (
        <>
            {
                accessState.online ? accessState.inputs!.map((input, i) => {
                    return (
                        <div key={keyGen()} style={{ display: "flex", flexDirection: "column" }}>
                            <h2 key={keyGen()}>MIDI Device {i + 1}</h2>
                            <div key={keyGen()} style={{ border: input.state === "connected" ? "solid 1px green" : " solid 1px red" }}>
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