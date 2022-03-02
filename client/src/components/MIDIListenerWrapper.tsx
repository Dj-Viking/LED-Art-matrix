import React, { ReactNode, useEffect, useRef, useState } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIAccessRecord, MIDIConnectionEvent, MIDIController } from "../utils/MIDIControlClass";
interface MIDIListenerWrapperProps {
  children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {

  const MyMIDIController = useRef<MIDIController>();
  const [midiAccess, setMidiAccess] = useState<MIDIAccessRecord>();


  useEffect(() => {
    (async (): Promise<void> => {
      if ("navigator" in window) {
        console.log("navigator in window");
        // define onstatechange callback to not be null
        const access = await MIDIController.requestMIDIAccess();
        access.onstatechange = function (event: MIDIConnectionEvent): void {
          setMidiAccess(access);  
          console.log(Date.now(), "event midi access onstatechange", event);
          MyMIDIController.current = new MIDIController(access);
        };
        setMidiAccess(access);  
        MyMIDIController.current = new MIDIController(access);

        console.log("my midi controller", MyMIDIController);
        // if state change event happened update the MIDI controller state
        // if () {

        // }

      }
    })();
  }, [midiAccess?.inputs.size]);

  return (
    <>
      {
        MyMIDIController.current?.online ? MyMIDIController.current.inputs.map((input, i) => {
          return (
            <div key={keyGen()} style={{ display: "flex", flexDirection: "column" }}>
              <h2 key={keyGen()}>MIDI Device {i + 1}</h2>
              <div key={keyGen()} style={{ border: input.state === "connected" ? "solid 1px green" : " solid 1px red" }}>
                <p key={keyGen()}>{input.name}</p>
              </div>
            </div>
          );
        }) : "MIDI OFFLINE"
      }
    </>
  );
};

export default MIDIListenerWrapper;