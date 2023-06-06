/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
//
import React, { ReactNode, useCallback, useEffect, useState } from "react";
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
import { IAccessRecordState } from "../types";
import {
    SUPPORTED_CONTROLLERS,
    MIDIInputName,
    DEFAULT_XONE_CONTROLNAME_TO_CHANNEL_MAPPING,
    DEFAULT_XONE_UI_TO_CONTROLNAME_MAPPING,
} from "../constants";
import IntensityBar from "./IntensityBar";
import { isLedWindow } from "../App";
import { getGlobalState } from "../store/store";
import { defaultMappingEditOptions, midiActions } from "../store/midiSlice";

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
        midiEditMode,
        usingFader,
        usingKnob,
        channel,
        intensity,
        isListeningForMappingEdit,
        controllerInUse,
        midiMappingInUse: { hasPreference },
    } = getGlobalState(useSelector);

    const [option, setOption] = useState<string>("");

    useEffect(() => {
        MIDIController.isMIDIPreferenceLocalStorageSet(controllerInUse, dispatch);
    }, [controllerInUse, dispatch]);

    useEffect(() => {
        dispatch(midiActions.getMIDIAccess());
    }, [dispatch]);

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

    const setOptionCallback = useCallback(
        (option: string) => {
            setOption(option);
            console.log("option selected", option);
            // may have a native label given by the browser so strip native label name
            dispatch(
                midiActions.setControllerInUse({
                    controllerName: MIDIController.stripNativeLabelFromMIDIInputName(option),
                    hasPreference,
                })
            );
        },
        [setOption, dispatch, hasPreference]
    );

    return (
        <>
            <div
                style={{
                    visibility: isLedWindow() ? "hidden" : "visible",
                    height: isLedWindow() ? "0px" : "auto",
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <TestMIDI
                    testid="test-midi"
                    midi_access={{
                        isListeningForMappingEdit,
                        mappingEditOptions: defaultMappingEditOptions,
                        controllerInUse: "XONE:K2 MIDI",
                        midiMappingInUse: {
                            channelMappings: DEFAULT_XONE_CONTROLNAME_TO_CHANNEL_MAPPING,
                            uiMappings: DEFAULT_XONE_UI_TO_CONTROLNAME_MAPPING,
                            hasPreference: false,
                        },
                        access: accessState,
                        inputs: accessInputs,
                        outputs: accessOutputs,
                        midiEditMode,
                        online: accessOnline,
                        usingFader,
                        usingKnob,
                        channel,
                        intensity,
                    }}
                />
                <MIDIWrapperHeader heading={accessOnline ? "MIDI Devices" : "MIDI OFFLINE"} />
                <MIDIWrapperContainer>
                    <MIDISelectContainer>
                        <MIDISelect
                            setOption={setOptionCallback}
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
                                    intensity_input={intensity}
                                />
                            </DeviceSvgContainer>
                            <IntensityBar intensity={intensity || 0} />
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
