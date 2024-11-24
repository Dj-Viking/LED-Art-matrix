/* eslint-disable @typescript-eslint/no-explicit-any */
import styled from "styled-components";
import React, { ReactNode, useEffect } from "react";
import { MIDIPortDeviceState, MIDIInput, MIDIController } from "../utils/MIDIControlClass";
import { MIDIInputName, SUPPORTED_CONTROLLERS } from "../constants";
import { Fader, Knob } from "../lib/deviceControlSvgs";
import { isLedWindow } from "../App";
import { getGlobalState } from "../store/store";
import { useDispatch, useSelector } from "react-redux";
import { defaultMappingEditOptions, midiActions, MIDISliceState } from "../store/midiSlice";
import { IAccessRecordState } from "../types";
import { keyGen } from "../utils/keyGen";

export const DeviceSvgContainer = styled.div`
    position: relative;
    justify-content: space-around;
`;

export const FaderSvgDiv = styled.div`
    position: absolute;
    right: 25px;
    bottom: -80px;
`;

export const KnobSvgDiv = styled.div`
    position: absolute;
    right: 6px;
    bottom: -85px;
`;

export const ControlNameContainer = styled.div`
    margin-bottom: 0.5em;
    display: flex;
    flex-direction: column;
    justify-content: center;
    margin: 0 auto;
`;

export const MIDIWrapperHeader: React.FC<{ heading: string }> = ({ heading }) => {
    return (
        <h2 style={{ margin: "0 auto", marginBottom: "10px" }} className={isLedWindow() ? "no-height" : ""}>
            {heading}
        </h2>
    );
};

export const MIDIToggleButton: React.FC = () => {
    const { usingMidi } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    const handleToggleClick = React.useCallback(() => {
        if (usingMidi) {
            dispatch(midiActions.resetState());
        } else {
            dispatch(midiActions.toggleUsingMidi());
        }
    }, [usingMidi, dispatch]);
    return (
        <button
            style={{
                margin: "0 auto",
                color: "white",
                cursor: "pointer",
                borderRadius: "5px",
                marginTop: "1em",
                marginBottom: "1em",
                backgroundColor: `${usingMidi ? "green" : "black"}`,
                border: "solid 1px white",
                width: "10%",
                height: 30,
            }}
            onClick={handleToggleClick}
        >
            {usingMidi ? <span>MIDI control ON</span> : <span>MIDI control OFF</span>}
        </button>
    );
};

export const MIDIWrapperContainer: React.FC<any> = ({ children }) => {
    return (
        <div
            style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
            }}
        >
            {children}
        </div>
    );
};

export interface ITestMIDIProps {
    testid: string;
    midi_access: IAccessRecordState;
}

export const TestMIDI: React.FC<ITestMIDIProps> = (_props) => {
    return <div style={{ display: "none" }}></div>;
};

export const TestMidiComponent: React.FC = () => {
    const {
        isListeningForMappingEdit,
        access: accessState,
        inputs: accessInputs,
        outputs: accessOutputs,
        midiEditMode,
        online: accessOnline,
        usingFader,
        usingKnob,
        channel,
        intensity,
    } = getGlobalState(useSelector);
    return (
        <>
            <TestMIDI
                testid="test-midi"
                midi_access={{
                    selectedController: "XONE:K2 MIDI",
                    isTesting: true,
                    usingMidi: true,
                    isListeningForMappingEdit,
                    mappingEditOptions: defaultMappingEditOptions,
                    controllerInUse: "XONE:K2 MIDI",
                    midiMappingInUse: {
                        callbackMap: {} as any,
                        recentlyUsed: "XONE:K2 MIDI",
                        midiMappingPreference: {} as any,
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
        </>
    );
};

export type ControlTypes = "usingFader" | "usingKnob";
export interface IControlSvgProps {
    usings: Record<ControlTypes, boolean>;
    intensity_input: number;
}
export const ControlSvg: React.FC<IControlSvgProps> = (props) => {
    return (
        <div className={isLedWindow() ? "no-height" : ""}>
            {props.usings.usingFader && (
                <FaderSvgDiv>
                    <Fader intensity_prop={props.intensity_input} />
                </FaderSvgDiv>
            )}
            {props.usings.usingKnob && (
                <KnobSvgDiv>
                    <Knob intensity_prop={props.intensity_input} />
                </KnobSvgDiv>
            )}
        </div>
    );
};

interface MIDISelectProps {
    setOption: (option: string & MIDISliceState["selectedController"]) => void;
    children?: ReactNode | ReactNode[];
}

export const MIDISelect = React.forwardRef<HTMLSelectElement, MIDISelectProps>((props, ref) => {
    const { selectedController, usingMidi, inputs } = getGlobalState(useSelector);
    const { setOption } = props;
    const dispatch = useDispatch();

    useEffect(() => {
        if (inputs.length > 0) {
            dispatch(midiActions.sortMIDIInputsByRecentlyused());
        }
    }, [dispatch, selectedController]);

    return (
        <>
            <select
                ref={ref}
                className={isLedWindow() ? "no-height" : ""}
                data-testid="midi-select"
                value={selectedController || "Select A Connected Device"}
                onChange={(e) => {
                    setOption(e.target.value);
                }}
                style={{ backgroundColor: "black" }}
            >
                <option key={keyGen()} data-testid="select-option" value="Select A Connected Device" disabled>
                    Select A Connected Device
                </option>
                {inputs?.map((input) => {
                    return Boolean(input) && Boolean(input.name) && (
                        <option data-testid="select-option" key={keyGen()} value={input?.name}>
                            {input?.name}
                        </option>
                    );
                }) || <option>waiting for react or some shit</option>}
            </select>
        </>
    );
});

MIDISelect.displayName = "MIDISelect";

export const MIDISelectContainer: React.FC<any> = ({ children }) => {
    return (
        <div
            className={isLedWindow() ? "no-height" : ""}
            style={{
                height: "19px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
            }}
        >
            {children}
        </div>
    );
};

export const InputName: React.FC<{ name: MIDIInputName }> = ({ name }) => {
    return (
        <p style={{ margin: "0 auto", marginTop: ".5em", marginBottom: ".5em" }}>
            {MIDIController.stripNativeLabelFromMIDIInputName(name)}
        </p>
    );
};

export const DeviceInterfaceContainer: React.FC<{
    statename: keyof typeof MIDIPortDeviceState;
    controllerName: MIDIInputName;
}> = (props) => {
    const { statename, children } = props;

    const adjustBorder = (state: keyof typeof MIDIPortDeviceState, ctrlName: MIDIInputName): string => {
        switch (true) {
            case !!SUPPORTED_CONTROLLERS[ctrlName]:
            case state === MIDIPortDeviceState.connected:
                return "solid 1px green";
            default:
                return "solid 1px red";
        }
    };
    return (
        <div
            className={isLedWindow() ? "no-height" : ""}
            style={{
                position: "relative",
                width: "50%",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                margin: "0 auto",
                border: adjustBorder(statename, props.controllerName),
            }}
        >
            {children}
        </div>
    );
};

export const ChannelNumber: React.FC<{ channel: number }> = ({ channel }) => {
    return <span>Channel: {channel}</span>;
};

export const MIDIChannelControl: React.FC<{ name: string }> = ({ name }) => {
    return <p style={{ margin: "0 auto" }}>{name}</p>;
};
