/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { MIDIConnectionEvent, MIDIController, MIDIInput, MIDIMessageEvent } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { DeviceSvgContainer, MIDIChannelControl, ControlNameContainer, DeviceInterfaceContainer, ChannelNumber, InputName, MIDIWrapperHeader, MIDIWrapperContainer, MIDISelectContainer, MIDISelect, ControlSvg } from "./MIDIListenerWrapper.style";
import { setAccess } from "../actions/midi-access-actions";
import { MyRootState } from "../types";
import { SUPPORTED_CONTROLLERS, MIDIInputName } from "../constants";
import IntensityBar from "./IntensityBar";

interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const accessState = useSelector((state: MyRootState) => state.accessRecordState);
    const { usingFader, usingKnob } = accessState;
    const { figureOn } = useSelector((state: MyRootState) => state.artScrollerState);
    const [size, setSize] = useState<number>(0);
    const [intensity, setIntensity] = useState<number>(0);
    const [option, setOption] = useState<string>("");
    // channel 16 is xone:k2's left most fader
    const [channel, setChannel] = useState<number>(16);
    const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

    useEffect(() => {
        (async (): Promise<void> => {
            if ("navigator" in window) {
                // request access from browser
                const access = await new MIDIController().requestMIDIAccess();
                const new_access = new MIDIController(access).getAccess();
                console.log("new access during teset", new_access);
                dispatch(setAccess(new MIDIController(access).getInstance()));
                // set size of inputs to re-render component at this moment of time
                setSize(new_access.inputs.size);
                //at this moment the promise resolves with access if size changed at some point
                if (size > 0) {
                    dispatch(setAccess(new MIDIController(new_access).getInstance()));
                    // define onstatechange callback to not be a function to execute when state changes later
                    new_access.onstatechange = function (_event: MIDIConnectionEvent): void {

                        const onstatechangeAccess = new MIDIController(_event.target).getInstance();

                        const midicb = function (midi_event: MIDIMessageEvent): void {
                            clearTimeout(filterTimeoutRef.current);
                            if (midi_event.currentTarget.name.includes("XONE:K2")) {
                                MIDIController.handleXONEK2MIDIMessage(midi_event, setChannel, setIntensity, dispatch, filterTimeoutRef);
                            }
                        };

                        const onstatechangecb = function (_connection_event: MIDIConnectionEvent): void {
                            console.log("CONNECTION EVENT SET INPUT CB CALLBACK", _connection_event);
                        };

                        dispatch(setAccess(onstatechangeAccess, midicb, onstatechangecb));
                    };// end onstatechange def
                } // endif size > 0 
                // accessState dead zone
            }// endif "navigator" in window
        })();
    }, [dispatch, accessState.inputs.length, size, figureOn]);

    function getInputName(all_inputs: MIDIInput[], option: string): MIDIInputName {
        return all_inputs.find(item => item.name === option)?.name || "Not Found";
    }

    function getInput(all_inputs: MIDIInput[], option: string): MIDIInput {
        return all_inputs.find(item => item.name === option)!;
    }

    function getControlName(inputname: MIDIInputName, channel: number): string {
        const strippedName = MIDIController.stripNativeLabelFromMIDIInputName(inputname);

        if (!SUPPORTED_CONTROLLERS[strippedName]) {
            return "unsupported controller";
        }

        return SUPPORTED_CONTROLLERS[strippedName]![channel] || "unknown control name";
    }

    return (
        <>
            <MIDIWrapperHeader heading={accessState.online ? "MIDI Devices" : "MIDI OFFLINE"} />
            <MIDIWrapperContainer>
                <MIDISelectContainer>
                    <MIDISelect setOption={setOption} option={option} midi_inputs={accessState.inputs} />
                </MIDISelectContainer>
                {option && (
                    <DeviceInterfaceContainer statename={getInput(accessState.inputs, option)?.state || "disconnected"}>
                        <InputName name={getInputName(accessState.inputs, option)} />
                        <DeviceSvgContainer>
                            <ControlSvg usings={{ usingFader, usingKnob }} intensity_input={intensity} />
                        </DeviceSvgContainer>
                        <IntensityBar intensity={intensity || 0} />
                        <ControlNameContainer>
                            <ChannelNumber channel={channel || 0} />
                            <MIDIChannelControl name={getControlName(getInputName(accessState.inputs, option), channel)} />
                        </ControlNameContainer>
                    </DeviceInterfaceContainer>
                )}
            </MIDIWrapperContainer>
        </>
    );
};

export default MIDIListenerWrapper;