/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import MIDIListenerWrapper from "../components/MIDIListenerWrapper";
import { Canvas } from "../components/Canvas";
export const Test: React.FC = () => {
    return (
        <>
            <MIDIListenerWrapper />

            <Canvas />
        </>
    );
};
