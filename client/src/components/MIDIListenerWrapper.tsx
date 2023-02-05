/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { MIDIController, MIDIInput } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { DeviceSvgContainer, MIDIChannelControl, ControlNameContainer, DeviceInterfaceContainer, ChannelNumber, InputName, MIDIWrapperHeader, MIDIWrapperContainer, MIDISelectContainer, MIDISelect, ControlSvg } from "./MIDIListenerWrapper.style";
import { IAccessRecordState, MyRootState } from "../types";
import { SUPPORTED_CONTROLLERS, MIDIInputName } from "../constants";
import IntensityBar from "./IntensityBar";

export interface ITestMIDIProps {
    testid: string;
    midi_access: IAccessRecordState;
}
export const TestMIDI: React.FC<ITestMIDIProps> = (_props) => {
    return (
        <div style={{ display: "none" }}>

        </div>
    );
};

export interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const accessState = useSelector((state: MyRootState) => state.accessRecordState);
    const { usingFader, usingKnob } = accessState;
    const [size, setSize] = useState<number>(0);
    const [intensity, setIntensity] = useState<number>(0);
    const [option, setOption] = useState<string>("");
    // channel 16 is xone:k2's left most fader
    const [channel, setChannel] = useState<number>(0);
    const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

    useEffect(() => {
        (async (): Promise<void> => {
            await MIDIController.setupMIDI(dispatch, size, setSize, setChannel, setIntensity, filterTimeoutRef);
        })();
    }, [dispatch, accessState.inputs.length, size]);

    function getInputName(all_inputs: MIDIInput[], option: string): MIDIInputName {
        return all_inputs.find(item => item.name === option)?.name || "Not Found";
    }

    function getStrippedInputName(name: string): MIDIInputName {
        return MIDIController.stripNativeLabelFromMIDIInputName(name);
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
            <TestMIDI testid="test-midi" midi_access={accessState} />
            <MIDIWrapperHeader heading={accessState.online ? "MIDI Devices" : "MIDI OFFLINE"} />
            <MIDIWrapperContainer>
                <MIDISelectContainer>
                    <MIDISelect setOption={setOption} option={option} midi_inputs={accessState.inputs} />
                </MIDISelectContainer>
                {option && (
                    <DeviceInterfaceContainer
                        statename={getInput(accessState.inputs, option)?.state || "disconnected"}
                        controllerName={getStrippedInputName(getInputName(accessState.inputs, option))}
                    >
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