/* eslint-disable react/display-name */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { ReactNode, useEffect, useRef, useState } from "react";
import { keyGen } from "../utils/keyGen";
import { MIDIConnectionEvent, MIDIController, MIDIInput, MIDIMessageEvent, MIDIPortDeviceState } from "../utils/MIDIControlClass";
import { useDispatch, useSelector } from "react-redux";
import { setAccess, determineDeviceControl } from "../actions/midi-access-actions";
import { MyRootState } from "../types";
import { animVarCoeffChange } from "../actions/led-actions";
import { XONEK2_MIDI_CHANNEL_TABLE, SUPPORTED_CONTROLLERS } from "../constants";
import { setAnimDuration, setCircleWidth, setHPos, setInvert, setVertPos } from "../actions/art-scroller-actions";
import IntensityBar from "./IntensityBar";
import { Fader, Knob } from "../lib/deviceControlSvgs";

interface MIDIListenerWrapperProps {
  children?: ReactNode | ReactNode[]
}

const MIDIListenerWrapper: React.FC<MIDIListenerWrapperProps> = (): JSX.Element => {
  const dispatch = useDispatch();
  const accessState = useSelector((state: MyRootState) => state.accessRecordState);
  const { usingFader, usingKnob } = accessState;
  const { figureOn } = useSelector((state: MyRootState) => state.artScrollerState);
  const [size, setSize] = useState<number>(0);
  const [intensity, setIntensity] = useState<number>(0);
  const [option, setOption] = useState<string>("");
  // channel 16 is xone:k2's left most fader
  const [channel, setChannel] = useState<number>(16);
  const filterTimeoutRef = useRef<NodeJS.Timeout>(setTimeout(() => void 0, 500));

  useEffect(() => {
    (async (): Promise<void> => {
      if ("navigator" in window) {
        // request access from browser
        const access = await MIDIController.requestMIDIAccess();
        dispatch(setAccess(new MIDIController(access).getInstance()));
        // set size of inputs to re-render component at this moment of time
        setSize(access.inputs.size);
        //at this moment the promise resolves with access if size changed at some point
        if (size > 0) {
          dispatch(setAccess(new MIDIController(access).getInstance()));
          // define onstatechange callback to not be a function to execute when state changes later
          access.onstatechange = function (_event: MIDIConnectionEvent): void {

            const onstatechangeAccess = new MIDIController(_event.target).getInstance();

            const midicb = function (midi_event: MIDIMessageEvent): void {
              clearTimeout(filterTimeoutRef.current);
              if (midi_event.currentTarget.name.includes("XONE:K2")) {

                const midi_intensity = midi_event.data[2];
                const midi_channel = midi_event.data[1];

                setChannel(midi_channel);
                setIntensity(midi_intensity);

                const is_fader = midi_channel >= 16 && midi_channel <= 19;
                const is_knob = /knob/g.test(XONEK2_MIDI_CHANNEL_TABLE[midi_channel]);

                dispatch(determineDeviceControl({
                  usingFader: is_fader,
                  usingKnob: is_knob
                }));

                // console.log("dump data", midi_event);
                switch (XONEK2_MIDI_CHANNEL_TABLE[midi_channel]) {
                  case "1_upper_knob":
                    filterTimeoutRef.current = setTimeout(() => {
                      dispatch(setCircleWidth(midi_intensity.toString()));
                    }, 20);
                    break;
                  case "1_middle_knob":
                    filterTimeoutRef.current = setTimeout(() => {
                      dispatch(setVertPos(midi_intensity.toString()));
                    }, 20);
                    break;
                  case "1_lower_knob":
                    filterTimeoutRef.current = setTimeout(() => {
                      dispatch(setHPos(midi_intensity.toString()));
                    }, 20);
                    break;
                  case "2_upper_knob":
                    filterTimeoutRef.current = setTimeout(() => {
                      dispatch(setInvert(midi_intensity.toString()));
                    }, 20);
                    break;
                  case "2_middle_knob":
                    filterTimeoutRef.current = setTimeout(() => {
                      dispatch(setAnimDuration(
                        midi_intensity <= 0 ? "1" : midi_intensity.toString()
                      ));
                    }, 20);
                    break;
                  case "1_fader":
                    filterTimeoutRef.current = setTimeout(() => {
                      dispatch(animVarCoeffChange((
                        midi_intensity === 0 ? "1" : midi_intensity * 2
                      ).toString()));
                    }, 10);
                    break;
                  default: break;
                }
              }
            };

            const onstatechangecb = function (_connection_event: MIDIConnectionEvent): void {
              // console.log("CONNECTION EVENT SET INPUT CB CALLBACK", connection_event);
            };

            dispatch(setAccess(onstatechangeAccess, midicb, onstatechangecb));
          };// end onstatechange def
        } // endif size > 0 
        // accessState dead zone
      }// endif "navigator" in window
    })();
  }, [dispatch, accessState.inputs.length, size, figureOn]);

  return (
    <>
      {
        accessState.online
          ?
          accessState.inputs.map((input: MIDIInput, i: number, _arr: Array<MIDIInput>) => {
            <h2>MIDI Device {i + 1}</h2>;
            return (
              <div key={keyGen()} style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <select onChange={(e) => {
                    setOption(e.target.value);
                  }} style={{ backgroundColor: "black" }}>
                    {_arr.map(input => {
                      return (
                        <option key={input.id} value={input.name}>{input.name}</option>
                      );
                    })}
                  </select>
                </div>

                {/* only show the device that is selected in the thing above */}
                {option ? (<>
                  <div
                    style={{ position: "relative", width: "50%", margin: "0 auto", border: input.state === MIDIPortDeviceState.connected ? "solid 1px green" : "   solid 1px red" }}
                  >
                    <p style={{ marginBottom: ".5em", marginTop: ".5em" }}>
                      {input.name}
                    </p>
                    <div>

                      <div style={{ display: "flex", justifyContent: "space-around" }}>

                        <div style={{ width: "50%" }}></div>

                        {usingFader ? <Fader intensity_prop={intensity} /> : null}
                        {usingKnob ? <Knob intensity_prop={intensity} /> : null}

                      </div>


                      <div style={{ margin: "0 auto 0 auto", width: "40px", height: "0px", backgroundColor: input.connection === MIDIPortDeviceState.connected ? "black" : "black", borderRadius: "50%", border: "solid black 1px" }}></div>

                      <span>
                        {
                          input.name.includes("XONE:K2") && (
                            <>
                              <span>
                                Intensity: {intensity}

                                <IntensityBar intensity={intensity} />
                              </span>
                              <div style={{ marginBottom: ".5em" }}>
                                <span>Channel: {channel}</span>
                                <p style={{ margin: 0 }}>
                                  {XONEK2_MIDI_CHANNEL_TABLE[channel]}
                                </p>
                              </div>

                            </>
                          )
                        }
                      </span>

                    </div>
                  </div>
                </>) : null

                }
              </div >
            );
          }) : <p>MIDI OFFLINE</p>
      }
    </>
  );
};

export default MIDIListenerWrapper;