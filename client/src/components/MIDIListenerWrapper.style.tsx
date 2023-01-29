import styled from "styled-components";
import React, { ReactNode } from "react";
import { MIDIPortDeviceState, MIDIInput, MIDIController } from "../utils/MIDIControlClass";
import { MIDIInputName } from "../constants";
import { Fader, Knob } from "../lib/deviceControlSvgs";

export const DeviceSvgContainer = styled.div`
    position: relative;
    display: flex; 
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
    margin-bottom: .5em;
`;

export const MIDIWrapperHeader: React.FC<{ heading: string }> = ({ heading }) => {
    return <h2>{heading}</h2>;
};

export const MIDIWrapperContainer: React.FC<any> = ({ children }) => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center"
    }}>
        {children}
    </div>;
};

export type ControlTypes = "usingFader" | "usingKnob";
export interface IControlSvgProps {
    usings: Record<ControlTypes, boolean>;
    intensity_input: number;
}
export const ControlSvg: React.FC<IControlSvgProps> = (props) => {
    return (
        <>
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
        </>
    );
}

interface MIDISelectProps {
    setOption: React.Dispatch<React.SetStateAction<string>>;
    children?: ReactNode | ReactNode[];
    midi_inputs: MIDIInput[];
    option: string;
}

export const MIDISelect: React.FC<MIDISelectProps> = ({ setOption, midi_inputs, option }) => {

    return (
        <select
            data-testid="midi-select"
            value={option || "Select A Connected Device"}
            onChange={(e) => {
                setOption(e.target.value);
            }}
            style={{ backgroundColor: "black" }}
        >
            <option data-testid="select-option" value="Select A Connected Device" disabled>
                Select A Connected Device
            </option>
            {midi_inputs.map(input => {
                return (
                    <option data-testid="select-option" key={input.id} value={input.name}>
                        {MIDIController.stripNativeLabelFromMIDIInputName(input.name)}
                    </option>
                );
            })}
        </select>
    );
};

export const MIDISelectContainer: React.FC<any> = ({ children }) => {


    return <div style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center"
    }}>
        {children}
    </div>;
};

export const InputName: React.FC<{ name: MIDIInputName }> = ({ name }) => {
    return <p>{MIDIController.stripNativeLabelFromMIDIInputName(name)}</p>;
};

export const DeviceInterfaceContainer: React.FC<{ statename: keyof typeof MIDIPortDeviceState }> = (props) => {
    const { statename, children } = props;
    return <div style={{
        position: "relative",
        width: "50%",
        margin: "0 auto",
        border: statename === MIDIPortDeviceState.connected ? "solid 1px green" : " solid 1px red"
    }}>
        {children}
    </div>;
};

export const ChannelNumber: React.FC<{ channel: number }> = ({ channel }) => {
    return <span>Channel: {channel}</span>;
};

export const MIDIChannelControl: React.FC<{ name: string }> = ({ name }) => {
    return <p style={{ margin: 0 }}>{name}</p>;
};