/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import {
    DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE,
    MIDIInputName,
    GenericControlName,
    DEFAULT_CALLBACK_TABLE,
    UIInterfaceDeviceName,
    DEFAULT_XONE_MAPPING_PREFERENCE_TABLE,
    DEFAULT_NOT_FOUND_MAPPING_PREFERENCE_TABLE,
} from "../constants";
import { artScrollerActions } from "../store/artScrollerSlice";
import { audioActions } from "../store/audioSlice";
import { ledActions } from "../store/ledSlice";
import { midiActions } from "../store/midiSlice";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { ToolkitDispatch } from "../store/store";
import { AnalyserPresetName } from "../types";
import { calcPositionFromRange } from "./calcPositionFromRange";
import { deepCopy } from "./deepCopy";

import { PresetButtonsList } from "./PresetButtonsListClass";

export type MIDIMapping<N extends MIDIInputName> = Record<
    GenericControlName<N>,
    {
        uiName: UIInterfaceDeviceName;
        channel: number;
    }
>;
export type CallbackMapping = typeof DEFAULT_CALLBACK_TABLE;

/**
 *
 * @example
 * const preference = {
 *     [this.name]: {
 *         mapping: {
 *             [controlName]: {
 *                 uiName: "circleWidth"
 *                 channel: 4
 *             },
 *             // other control names
 *             ["fader_1"]: {
 *                 uiName: "animDuration"
 *                 channel: 0
 *             }
 *         },
 *         callbackMap: {
 *             ["uiName"]: (...args: any[]) => void // (calls dispatch with supplied arguments)
 *         }
 *     },
 * }
 * // look up which callback based on the UI name derived from the midi input's own control name
 *
 * const callbackMap = {
 *     ["circleWidth"]: dispatch(someSlice.someAction(value))
 * };
 *
 * //call the callback like this
 * const uiName = preference[midiname][controlName];
 * callbackMap[uiName]()
 */
export class MIDIMappingPreference<N extends MIDIInputName> {
    public name: N;
    public mapping: MIDIMapping<N> = {} as any;
    public callbackMap: CallbackMapping = {} as any;

    public constructor(name: N, dispatch: ToolkitDispatch) {
        this.name = name;

        this.#setMIDIMappingBasedOnInputName(name);
        // TODO: since functions can't be serialized into JSON for local storage
        // will have to regenerate the callbacks based on which controlName object is mapped to a particular UI interface names
        MIDIMappingPreference.setMIDICallbackMapBasedOnControllerName(this, dispatch);
    }

    public static listeningForEditsHandler(dispatch: React.Dispatch<any>, uiName: UIInterfaceDeviceName): void {
        console.log("listening for edits");
        dispatch(midiActions.setListeningForMappingEdit(true));
        dispatch(
            midiActions.setMappingEditOptions({
                uiName: uiName,
            })
        );
    }

    public static getControlNameFromControllerInUseUIMapping(
        mappingInUse: MIDIMapping<MIDIInputName>,
        uiName: UIInterfaceDeviceName
    ): string {
        let ret = "";

        for (const controlName of Object.keys(mappingInUse)) {
            if (uiName === mappingInUse[controlName].uiName) {
                ret = controlName;
                break;
            } else {
                ret = "unknown control name mapping";
            }
        }

        return ret;
    }

    private static createButtonCallback(dispatch: ToolkitDispatch, btnId: string, isAudio = false, analyserPresetName?: AnalyserPresetName): void {
        dispatch((dispatchcb, getState) => {

            const presetButtonsInState = getState().presetButtonsListState.presetButtons;
            const btn = presetButtonsInState.find((btn) => btn.id === btnId)!;

            if (!isAudio) {
                dispatchcb(presetButtonsListActions.setActiveButton(btnId));
                PresetButtonsList.setStyle(dispatchcb, btn);
            } else {
                // not great but will work for now
                // TODO: should probably bind uiname into the button
                PresetButtonsList.setStyle(dispatchcb, btn, true, btn.analyserPresetName);
            }

        });
    }

    public static generateCallbackBasedOnUIName<P extends keyof CallbackMapping>(
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): CallbackMapping[P] {
        switch (uiName) {
            case "energy":
                return (midiIntensity: number) => {
                    //

                    dispatch(
                        audioActions.setEnergyModifier(
                            calcPositionFromRange(midiIntensity, 0, 360, 0, 127, true)
                        )
                    );
                };
            case "smoothing": 
                return (midiIntensity: number, _buttonIds?: any, _gainRef?: any, analyserNodeRef?: React.MutableRefObject<AnalyserNode>) => {
                    if (analyserNodeRef && analyserNodeRef.current) {
                        if (midiIntensity === 0) {
                            dispatch(
                                audioActions.setAnalyserRefSmoothing(0)
                            );
                        } else {
                            dispatch(
                                audioActions.setAnalyserRefSmoothing(
                                    calcPositionFromRange(midiIntensity, 0, 1, 0, 127, false)
                                )
                            );
                            
                        }
                    }
                };
            case "gainValue": 
                return (midiIntensity: number, _buttonIds?: Array<string>, gainRef?: React.MutableRefObject<GainNode>) => {
                    if (gainRef && 
                        gainRef.current && gainRef.current.gain) 
                    {
                        if (midiIntensity === 0) {
                            dispatch(
                                audioActions.setGainRefGain(0)
                            );
                        } else {
                            dispatch(
                                audioActions.setGainRefGain(
                                    calcPositionFromRange(midiIntensity, 0, 1, 0, 127, false)
                                )
                            );
                        }
                    }
                };
            case "animDuration":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "animDuration",
                            value: calcPositionFromRange(midiIntensity, 1, 100, 0, 127).toString(),
                        })
                    );
                };
            case "animVarCoeff":
                return (midiIntensity: number) => {
                    dispatch(
                        ledActions.setAnimVarCoeff(
                            midiIntensity <= 0 ? "1" : calcPositionFromRange(midiIntensity, 1, 255, 0, 127).toString()
                        )
                    );
                };
            case "button_1_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[0] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_2_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[1] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_3_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[2] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_4_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[3] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_5_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[4] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_6_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[5] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_7_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[6] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_8_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[7] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "button_9_position":
                return (midiIntensity: number, buttonIds?: string[], _gainRef?: any, _analyserNodeRef?: React.MutableRefObject<AnalyserNode>, analyserPresetname?: AnalyserPresetName) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const isAudio = getState().audioState.audioCtxRef.current instanceof AudioContext; 
                            MIDIMappingPreference.createButtonCallback(dispatchcb, buttonIds?.[8] as string, isAudio, analyserPresetname);
                        });
                    }
                };
            case "circleWidth":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "circleWidth",
                            value: calcPositionFromRange(midiIntensity, 0, 100, 0, 127).toString(),
                        })
                    );
                };
            case "hPos":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "hPos",
                            value: midiIntensity.toString(),
                        })
                    );
                };
            case "vertPos":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "vertPos",
                            value: calcPositionFromRange(midiIntensity, 0, 200, 0, 127).toString(),
                        })
                    );
                };
            case "invert":
                return (midiIntensity: number) => {
                    dispatch(
                        artScrollerActions.setSlider({
                            control: "invert",
                            value: calcPositionFromRange(midiIntensity, 0, 100, 0, 127).toString(),
                        })
                    );
                };
            case "isHSL":
                return (midiIntensity: number) => {
                    if (midiIntensity === 127) {
                        dispatch(ledActions.toggleIsHSL());
                    }
                };
            case "resetTimerButton":
                return (midiIntensity: number) => {
                    // only on button down trigger action
                    if (midiIntensity === 127) {
                        dispatch((_dispatchcb, getState) => {
                            getState().ledState.resetTimerFn();
                        });
                    }
                };
            case "figureOn":
                return (midiIntensity: number) => {
                    // toggling the gifs art scroller
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const currentFigureOnState = getState().artScrollerState.figureOn;
                            dispatchcb(artScrollerActions.setFigureOn(!currentFigureOnState));
                        });
                    }
                };
            case "startGifs":
                return (midiIntensity: number) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const currentFigureOnState = getState().artScrollerState.figureOn;
                            const inMidiEditMode = getState().midiState.midiEditMode;
                            // only switch on if it was already off. otherwise don't toggle off if already on.
                            // and if we're not currently in edit mode
                            if (!inMidiEditMode) {
                                if (!currentFigureOnState) {
                                    dispatchcb(artScrollerActions.setFigureOn(true));
                                }
                                // keeps pushing gifs of the same list in state....................
                                if (getState().artScrollerState.gifs.length < 0) {
                                    dispatch(artScrollerActions.getGifsAsync({ getNew: false }));
                                }
                            }
                        });
                    }
                };
            case "gifFetch":
                return (midiIntensity: number) => {
                    if (midiIntensity === 127) {
                        dispatch((dispatchcb, getState) => {
                            const currentFigureOnState = getState().artScrollerState.figureOn;
                            const inMidiEditMode = getState().midiState.midiEditMode;
                            // only switch on if it was already off. otherwise don't toggle off if already on.
                            if (!inMidiEditMode) {
                                if (!currentFigureOnState) {
                                    dispatchcb(artScrollerActions.setFigureOn(true));
                                }
                                dispatch(artScrollerActions.getGifsAsync({ getNew: true }));
                            }
                        });
                    }
                };
            case "gifSelector":
                return (midiIntensity: number) => {
                    dispatch((dispatchcb, getState) => {
                        // left
                        if (midiIntensity === 127) {
                            // select the gif list name upwards to the current one
                            const listNames = getState().artScrollerState.listNames;
                            const currentIndexState = Number(getState().artScrollerState.listNameIndex);

                            let index: number;
                            if (currentIndexState === 0) {
                                index = 0;
                            } else {
                                index = currentIndexState - 1;
                            }

                            dispatchcb(
                                artScrollerActions.selectListName({
                                    listName: listNames[index],
                                    listNameIndex: index.toString(),
                                })
                            );
                            return;
                        }
                        // right
                        if (midiIntensity === 1) {
                            // select the gif list name upwards to the current one
                            const listNames = getState().artScrollerState.listNames;
                            const currentIndexState = Number(getState().artScrollerState.listNameIndex);

                            let index: number;
                            if (currentIndexState + 1 >= listNames.length) {
                                index = currentIndexState;
                            } else {
                                index = currentIndexState + 1;
                            }

                            dispatchcb(
                                artScrollerActions.selectListName({
                                    listName: listNames[index],
                                    listNameIndex: index.toString(),
                                })
                            );
                            return;
                        }
                    });
                };
            default:
                return (_midiIntensity: number) => void 0;
        }
    }

    public static updatePreferenceMapping(
        _this: MIDIMappingPreference<typeof name>,
        name: MIDIInputName,
        controlName: GenericControlName<typeof name>,
        channel: number,
        uiName: UIInterfaceDeviceName,
        dispatch: ToolkitDispatch
    ): MIDIMappingPreference<typeof name> {
        // update this.mapping and this.callbackmap

        const ret = deepCopy(_this);
        ret.mapping[controlName].channel = channel;
        ret.mapping[controlName].uiName = uiName;

        MIDIMappingPreference.setMIDICallbackMapBasedOnControllerName(ret, dispatch);

        return ret;
    }

    public static setMIDICallbackMapBasedOnControllerName(
        _this: MIDIMappingPreference<MIDIInputName>,
        dispatch: ToolkitDispatch
    ): void {
        Object.keys(DEFAULT_CALLBACK_TABLE).forEach((uiName) => {
            _this.callbackMap = {
                ..._this.callbackMap,
                [uiName]: MIDIMappingPreference.generateCallbackBasedOnUIName(uiName, dispatch),
            };
        });
    }

    #setMIDIMappingBasedOnInputName(name: N): void {
        switch (true) {
            
            case name.includes("Not Found"): 
                Object.keys(DEFAULT_NOT_FOUND_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_NOT_FOUND_MAPPING_PREFERENCE_TABLE[key]
                    };
                });
                break;
            case name.includes("TouchOSC Bridge"):
                Object.keys(DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_TOUCHOSC_MAPPING_PREFERENCE_TABLE[key],
                    };
                });
                break;
            case name.includes("XONE:K2:XONE:K2  20:0"):
                Object.keys(DEFAULT_XONE_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_XONE_MAPPING_PREFERENCE_TABLE[key],
                    };
                });
                break;
            case name.includes("XONE:K2 MIDI"):
                Object.keys(DEFAULT_XONE_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_XONE_MAPPING_PREFERENCE_TABLE[key],
                    };
                });
                break;
            case name.includes("XONE:K2 "):
                Object.keys(DEFAULT_XONE_MAPPING_PREFERENCE_TABLE).forEach((key) => {
                    this.mapping = {
                        ...this.mapping,
                        [key]: DEFAULT_XONE_MAPPING_PREFERENCE_TABLE[key],
                    };
                });
                break;
            default:
                break;
        }
    }
}
