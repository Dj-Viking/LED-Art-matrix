/* eslint-disable @typescript-eslint/no-explicit-any */
import { PayloadAction, createSlice } from "@reduxjs/toolkit";
import { IAudioState } from "../types";
import { produce } from "immer";

export const initialAudioState: IAudioState = {
    audioCtxRef: {} as any,
    analyserNodeRef: {} as any,
    gainNodeRef: {} as any,
    samplesLength: 0,
    energyModifier: 0
};

export const audioSlice = createSlice({
    name: "audioSlice",
    initialState: initialAudioState,
    reducers: {

        setEnergyModifier: (state, a: PayloadAction<number>) => {
            return produce(state, () => {
                state.energyModifier = a.payload;
            });
        },

        setSamplesLength: (state, action: PayloadAction<number>) => {
            return produce(state, () => {
                state.samplesLength = action.payload;
            });
        },

        setAnalyserRefSmoothing: (state, action: PayloadAction<number>) => {
            return produce(state, () => {
                state.analyserNodeRef.current.smoothingTimeConstant = action.payload;
            });
        },

        setGainRefGain: (state, action: PayloadAction<number>) => {
            return produce(state, () => {
                state.gainNodeRef.current.gain.value = action.payload;
            });
        },

        setAudioCtxRef: (state, action: PayloadAction<React.MutableRefObject<AudioContext>>) => {
            return produce(state, () => {
                state.audioCtxRef = {
                    ...state.audioCtxRef,
                    ...action.payload
                };
            });
        },
        setGainRef: (state, action: PayloadAction<React.MutableRefObject<GainNode>>) => {
            return produce(state, () => {
                state.gainNodeRef = {
                    ...state.gainNodeRef,
                    ...action.payload
                };
            });
        },
        setAnalyserRef: (state, action: PayloadAction<React.MutableRefObject<AnalyserNode>>) => {
            return produce(state, () => {
                state.analyserNodeRef = {
                    ...state.analyserNodeRef,
                    ...action.payload
                };
            });
        },
    },
});

export const audioActions = {
    ...audioSlice.actions,
};
