/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { MIDIListenerWrapper } from "../components/MIDIListenerWrapper";
import { Canvas } from "../components/Canvas";
export const Test: React.FC = () => {
    return (
        <>
            <MIDIListenerWrapper />
            <div className="border-top-led" style={{ marginBottom: 400 }}></div>
            <Canvas />
        </>
    );
};
