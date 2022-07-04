import styled from "styled-components";
import React, { ReactNode } from "react";
import { MIDIPortDeviceState, MIDIInput } from "../utils/MIDIControlClass";

export const DeviceSvgContainer = styled.div`
     display: flex; 
     justify-content: space-around; 
`;

export const SpaceDivider = styled.div`
    width: 50%;
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

interface MIDISelectProps {
    setOption: React.Dispatch<React.SetStateAction<string>>;
    children?: ReactNode | ReactNode[];
    midi_inputs: MIDIInput[];
    option: string;
}

export const MIDISelect: React.FC<MIDISelectProps> = ({ setOption, midi_inputs, option }) => {
    return (
        <select
            value={option || "Select A Connected Device"}
            onChange={(e) => {
                setOption(e.target.value);
            }}
            style={{ backgroundColor: "black" }}
        >
            <option value="Select A Connected Device" disabled>
                Select A Connected Device
            </option>
            {midi_inputs.map(input => {
                return (
                    <option key={input.id} value={input.name}>{input.name}</option>
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

export const InputName: React.FC<{ name: string }> = ({ name }) => {
    return <p>{name}</p>;
};

export const DeviceInterfaceContainer: React.FC<{ statename: string }> = ({ statename, children }) => {
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