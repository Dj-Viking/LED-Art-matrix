import React from "react";
import BigLedBox from "../components/BigLedBox";
import MIDIListenerWrapper from "../components/MIDIListenerWrapper";

const LedWindow: React.FC = () => {
    return (
        <>
            <MIDIListenerWrapper />
            <BigLedBox />
        </>
    );
};

export { LedWindow };
