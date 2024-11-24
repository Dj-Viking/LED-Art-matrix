/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
//
import React, { ReactNode, useCallback, useEffect } from "react";
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
    MIDIToggleButton,
    TestMidiComponent,
} from "./MIDIListenerWrapper.style";
import { SUPPORTED_CONTROLLERS, MIDIInputName, ControllerName } from "../constants";
import IntensityBar from "./IntensityBar";
import { isLedWindow } from "../App";
import { getGlobalState } from "../store/store";
import { midiActions, MIDISliceState } from "../store/midiSlice";

export interface MIDIListenerWrapperProps {
    children?: ReactNode | ReactNode[];
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
    const dispatch = useDispatch();
    const {
        online: accessOnline,
        inputs: accessInputs,
        usingFader,
        usingKnob,
        usingMidi,
        channel,
        intensity,
        controllerInUse,
        selectedController,
        isTesting,
        midiMappingInUse
    } = getGlobalState(useSelector);

    const timeoutRef = React.useRef<NodeJS.Timeout>({} as any);

    useEffect(() => {
        MIDIController.isMIDIPreferenceLocalStorageSet(controllerInUse, dispatch);
    }, [controllerInUse, dispatch]);

    useEffect(() => {
        if (usingMidi) {
            dispatch(midiActions.getMIDIAccess({ timeoutRef }));
        }
    }, [dispatch, usingMidi, timeoutRef]);

    const selectRef = React.createRef<HTMLSelectElement>();

    function getStrippedInputName(name: string): MIDIInputName {
        return MIDIController.stripNativeLabelFromMIDIInputName(name);
    }

    const getInput = React.useCallback((): MIDIInput => {
        return accessInputs?.find(
            (item) => item?.name === selectedController
        )!;
    }, [accessInputs, selectedController]);

    const getControlName = React.useCallback((): ControllerName | "unsupported controller" => {

        if (!SUPPORTED_CONTROLLERS[selectedController]) {
            return "unsupported controller";
        }

        return SUPPORTED_CONTROLLERS[selectedController]![channel] || "unknown control name";
    }, [channel, selectedController]);

    const setOptionCallback = useCallback(
        (option: string & MIDISliceState["selectedController"]) => {
            dispatch(midiActions.setSelectedController(option));
            // may have a native label given by the browser so strip native label name
            dispatch(
                midiActions.setControllerInUse({
                    controllerName: option,
                    hasPreference: midiMappingInUse.hasPreference,
                })
            );
        },
        [dispatch, midiMappingInUse.hasPreference]
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
                {isTesting && <TestMidiComponent />}
                <MIDIWrapperHeader heading={accessOnline ? "MIDI Devices" : "MIDI OFFLINE"} />

                <MIDIWrapperContainer>

                    <MIDISelectContainer>
                    {/ * somethings fucked with the dropdown ohwell fuck it for now * / }
                        <MIDISelect ref={selectRef} setOption={setOptionCallback} />
                    </MIDISelectContainer>

                    <MIDIToggleButton />

                    <DeviceInterfaceContainer
                        statename={getInput()?.state || "disconnected"}
                        controllerName={selectedController}
                    >
                        <InputName name={selectedController} />
                        <DeviceSvgContainer>
                            <ControlSvg usings={{ usingFader, usingKnob }} intensity_input={intensity} />
                        </DeviceSvgContainer>
                        <IntensityBar intensity={intensity || 0} />
                        <ControlNameContainer>
                            <ChannelNumber channel={channel || 0} />
                            <MIDIChannelControl name={getControlName()} />
                        </ControlNameContainer>
                    </DeviceInterfaceContainer>
                </MIDIWrapperContainer>
            </div>
        </>
    );
};

export { MIDIListenerWrapper };
