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
    // const dispatch = useDispatch();
    const accessState = useSelector((state: MyRootState) => state.accessRecordState);
    const { usingFader, usingKnob, midiEditMode } = getGlobalState(useSelector);
    // const presetButtons = useSelector(
    //     (state: MyRootState) => state.presetButtonsListState?.presetButtons
    // );

    // const [size, setSize] = useState<number>(0);
    const [option, setOption] = useState<string>("");
    const [channel, setChannel] = useState<number>(0);

    const intensityRef = useRef<number>(0);
    // const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

    // const _setChannel = React.useCallback((channel: number): void => setChannel(channel), []);
    // const _setSize = React.useCallback((size: number): void => setSize(size), []);
    // const _setIntensity = React.useCallback((intensity: number): void => {
    //     intensityRef.current = intensity;
    // }, []);

    // useEffect(() => {
    //     console.log("init midi");

    //     let controller: MIDIController = null as any;
    //     // NOTE: be careful of what values are passed here - potential memory leaks
    //     // could happen for example passing state values that are derived from redux (animVarCoeff or presetButtons)
    //     // and then are used as input values in a different dispatch action. something happens
    //     // with a reference counter and is not able to clean up things quick enough and freezes up the app
    //     (async () => {
    //         const buttonIds = presetButtons.map((btn) => btn.id);
    //         const editMode = midiEditMode;
    //         const browserMIDIAccessRecord = await MIDIController.requestMIDIAccess();
    //         // this has a memory leak. new references to MIDI controller are created and not destroyed in the store
    //         controller = await MIDIController.setupMIDI(
    //             dispatch,
    //             size,
    //             _setSize,
    //             _setChannel,
    //             _setIntensity,
    //             filterTimeoutRef,
    //             buttonIds,
    //             editMode,
    //             browserMIDIAccessRecord
    //         );
    //         console.log("controller in useeffect", controller);
    //     })();
    // }, []);

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
                <TestMIDI testid="test-midi" midi_access={accessState} />
                <MIDIWrapperHeader
                    heading={accessState?.online ? "MIDI Devices" : "MIDI OFFLINE"}
                />
                <MIDIWrapperContainer>
                    <MIDISelectContainer>
                        <MIDISelect
                            setOption={setOption}
                            option={option}
                            midi_inputs={accessState?.inputs}
                        />
                    </MIDISelectContainer>
                    {option && (
                        <DeviceInterfaceContainer
                            statename={
                                getInput(accessState?.inputs, option)?.state || "disconnected"
                            }
                            controllerName={getStrippedInputName(
                                getInputName(accessState?.inputs, option)
                            )}
                        >
                            <InputName name={getInputName(accessState?.inputs, option)} />
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
                                        getInputName(accessState?.inputs, option),
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
