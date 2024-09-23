/* eslint-disable @typescript-eslint/no-explicit-any */
import { MIDIInputName } from "../../constants";
import { IAccessRecordState } from "../../types";
import { MIDIMappingPreference } from "../../utils/MIDIMappingClass";

export const mockBlankStorageMIDIMapping = {
    // mock the mandatory dispatch param for now
    "Not Found": new MIDIMappingPreference("Not Found", jest.fn()).mapping,
    "TouchOSC Bridge": new MIDIMappingPreference("TouchOSC Bridge", jest.fn()).mapping,
    "XONE:K2 MIDI": new MIDIMappingPreference("XONE:K2 MIDI", jest.fn()).mapping
} as Partial<IAccessRecordState["midiMappingInUse"]["midiMappingPreference"]>;

export const setuplocalstorage = (): void => {
    // setup local storage to have preferences installed before tests run
    const localstorage = window.localStorage;

    localstorage.setItem("Not Found" as MIDIInputName, JSON.stringify(
        {
            mapping: mockBlankStorageMIDIMapping["Not Found"],
            name: "Not Found",
            callbackMap: {}
        }
    ));
    localstorage.setItem("XONE:K2 MIDI" as MIDIInputName, JSON.stringify(
        {
            mapping: mockBlankStorageMIDIMapping["XONE:K2 MIDI"],
            name: "XONE:K2 MIDI",
            callbackMap: {}
        }
    ));
    localstorage.setItem("TouchOSC Bridge" as MIDIInputName, JSON.stringify(
        {
            mapping: mockBlankStorageMIDIMapping["TouchOSC Bridge"],
            name: "TouchOSC Bridge",
            callbackMap: {}
        }
    ));
};

export const resetlocalstorage = (): void => {
    const localstorage = window.localStorage;
    localstorage.clear();
};

// needs a test to be in the __tests__ folder apparently


describe("asdf", () => {
    it("asdfasd", () => { expect(true).toBe(true);});
});