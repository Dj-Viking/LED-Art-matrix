import React, { ReactNode, useEffect, useRef } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIController } from "../utils/MIDIControlClass";
interface MIDIListenerWrapperProps {
  children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {

  const MyMIDIController = useRef<MIDIController>();


  useEffect(() => {
    (async (): Promise<void> => {
      if ("navigator" in window) {
        console.log("navigator in window");

        //@ts-ignore
        const access = await window.navigator.requestMIDIAccess();
        MyMIDIController.current = new MIDIController(access);
        console.log("my midi controller", MyMIDIController);

      }
    })();
  });

  return (
    <>
      {
        MyMIDIController.current?.online ? MyMIDIController.current.inputs.map(input => {
          return (
            <>
              <div style={{ display: "flex", flexDirection: "column" }}>
                <div style={{ border: input.state === "connected" ? "solid 1px green" : " solid 1px red" }}>
                  <p key={keyGen()}>{input.name}</p>
                </div>
              </div>
            </>
          );
        }) : "MIDI OFFLINE"
      }
    </>
  );
};

export default MIDIListenerWrapper;