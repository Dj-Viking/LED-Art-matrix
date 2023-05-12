/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
//
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { MIDIController, MIDIInput } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import {
    DeviceSvgContainer,
    MIDIChannelControl,
    ControlNameContainer,
    DeviceInterfaceContainer,
    ChannelNumber,
    InputName,
    MIDIWrapperHeader,
    MIDIWrapperContainer,
    MIDISelectContainer,
    MIDISelect,
    ControlSvg,
} from "./MIDIListenerWrapper.style";
import { IAccessRecordState, MyRootState } from "../types";
import { SUPPORTED_CONTROLLERS, MIDIInputName } from "../constants";
import IntensityBar from "./IntensityBar";
import { isLedWindow } from "../App";
import { getGlobalState } from "../reducers/store";
import { midiActions } from "../reducers/midiSlice";

export interface ITestMIDIProps {
    testid: string;
    midi_access: IAccessRecordState;
}
export const TestMIDI: React.FC<ITestMIDIProps> = (_props) => {
    return <div style={{ display: "none" }}></div>;
};

export interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[];
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const {
        access: accessState,
        online: accessOnline,
        inputs: accessInputs,
        outputs: accessOutputs,
        sysexEnabled,
        midiEditMode,
        usingFader,
        usingKnob,
    } = getGlobalState(useSelector);

    const [option, setOption] = useState<string>("");
    const [channel, setChannel] = useState<number>(0);

    const intensityRef = useRef<number>(0);
    // const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

    // const _setChannel = React.useCallback((channel: number): void => setChannel(channel), []);
    // const _setSize = React.useCallback((size: number): void => setSize(size), []);
    // const _setIntensity = React.useCallback((intensity: number): void => {
    //     intensityRef.current = intensity;
    // }, []);

    useEffect(() => {
        dispatch(midiActions.getMIDIAccess());
    }, [dispatch]);

    useEffect(() => {
        console.log("input length changed", accessInputs?.length);
    }, [accessInputs?.length]);

    function getInputName(all_inputs: MIDIInput[], option: string): MIDIInputName {
        return all_inputs?.find((item) => item.name === option)?.name || "Not Found";
    }

    function getStrippedInputName(name: string): MIDIInputName {
        return MIDIController.stripNativeLabelFromMIDIInputName(name);
    }

    function getInput(all_inputs: MIDIInput[], option: string): MIDIInput {
        return all_inputs?.find((item) => item?.name === option)!;
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
            <div
                style={{
                    visibility: isLedWindow() ? "hidden" : "visible",
                    height: isLedWindow() ? "0px" : "auto",
                }}
            >
                <TestMIDI
                    testid="test-midi"
                    midi_access={{
                        access: accessState,
                        inputs: accessInputs,
                        outputs: accessOutputs,
                        midiEditMode,
                        online: accessOnline,
                        sysexEnabled,
                        usingFader,
                        usingKnob,
                    }}
                />
                <MIDIWrapperHeader heading={accessOnline ? "MIDI Devices" : "MIDI OFFLINE"} />
                <MIDIWrapperContainer>
                    <MIDISelectContainer>
                        <MIDISelect
                            setOption={setOption}
                            option={option}
                            midi_inputs={accessInputs}
                        />
                    </MIDISelectContainer>
                    {option && (
                        <DeviceInterfaceContainer
                            statename={getInput(accessInputs, option)?.state || "disconnected"}
                            controllerName={getStrippedInputName(
                                getInputName(accessInputs, option)
                            )}
                        >
                            <InputName name={getInputName(accessInputs, option)} />
                            <DeviceSvgContainer>
                                <ControlSvg
                                    usings={{ usingFader, usingKnob }}
                                    intensity_input={intensityRef.current}
                                />
                            </DeviceSvgContainer>
                            <IntensityBar intensity={intensityRef.current || 0} />
                            <ControlNameContainer>
                                <ChannelNumber channel={channel || 0} />
                                <MIDIChannelControl
                                    name={getControlName(
                                        getInputName(accessInputs, option),
                                        channel
                                    )}
                                />
                            </ControlNameContainer>
                        </DeviceInterfaceContainer>
                    )}
                </MIDIWrapperContainer>
            </div>
        </>
    );
};

export default MIDIListenerWrapper;
