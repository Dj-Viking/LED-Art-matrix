import React from "react";
import styled from "styled-components";
import { useSpring, animated } from "@react-spring/web";
import {
    _deletePresetButtonSpring,
    _saveButtonSpring,
    _clear,
    _saveNewPresetButtonSpring,
    _openNewWindow,
    _toggleMIDIMapEditModeButton,
    _hslButton,
} from "./SpringButtons";
import { useDispatch, useSelector } from "react-redux";
import AuthService from "../utils/AuthService";
import { modalActions } from "../store/modalSlice";
import { getGlobalState } from "../store/store";
import { ledActions } from "../store/ledSlice";

interface PresetLabelTitleProps {
    auth: typeof AuthService;
}

const PresetLabelTitle: React.FC<PresetLabelTitleProps> = (props) => {
    return (
        <>
            <span
                style={{
                    color: "white",
                    textAlign: "center",
                }}
            >
                LED Matrix Presets
            </span>
            {!props.auth.loggedIn() && (
                <>
                    <span
                        style={{
                            color: "white",
                            margin: "0 auto",
                        }}
                    >
                        To save your own Preset, Log in or Sign up!
                    </span>
                </>
            )}
        </>
    );
};

const IsHSLButton: React.FC = () => {
    const { isHSL } = getGlobalState(useSelector);
    const dispatch = useDispatch();
    const HSLButton = useSpring(_hslButton);
    return (
        <animated.button
            style={HSLButton}
            role="button"
            data-testid="isHSL"
            className="preset-button"
            onClick={() => dispatch(ledActions.toggleIsHSL())}
        >
            {isHSL ? "SWITCH TO RGB" : "SWITCH TO HSL"}
        </animated.button>
    );
};

const ResetTimerButton: React.FC = () => {
    const { resetTimerFn } = getGlobalState(useSelector);
    const clear = useSpring(_clear);
    return (
        <animated.button
            style={clear}
            role="button"
            data-testid="resetTimer"
            className="preset-button"
            onClick={() => resetTimerFn()}
        >
            Reset Animation Timer
        </animated.button>
    );
};

interface SaveDefaultButtonProps {
    auth: typeof AuthService;
    clickHandler: (_event: any) => Promise<void>;
}

const SaveDefaultButton: React.FC<SaveDefaultButtonProps> = (props) => {
    const saveButtonSpring = useSpring(_saveButtonSpring);

    return (
        <animated.button
            role="button"
            data-testid="saveDefault"
            style={saveButtonSpring}
            className={
                props.auth.loggedIn() ? "preset-button save-button" : "preset-button-disabled"
            }
            disabled={!props.auth.loggedIn()} // enable if logged in
            onClick={props.clickHandler}
        >
            Save as Default
        </animated.button>
    );
};

interface SavePresetButtonProps {
    auth: typeof AuthService;
}

const SavePresetButton: React.FC<SavePresetButtonProps> = (props) => {
    const saveNewPresetButtonSpring = useSpring(_saveNewPresetButtonSpring);
    const dispatch = useDispatch();
    const { presetName, animVarCoeff } = getGlobalState(useSelector);
    return (
        <animated.button
            role="button"
            data-testid="savePreset"
            style={saveNewPresetButtonSpring}
            className={
                props.auth.loggedIn() ? "preset-button save-button" : "preset-button-disabled"
            }
            disabled={!props.auth.loggedIn()} // enable if logged in
            onClick={(event: any) => {
                event.preventDefault();
                dispatch(modalActions.setSaveModalIsOpen(true));
                dispatch(
                    modalActions.setSaveModalContext({
                        animVarCoeff,
                        presetName,
                    })
                );
            }}
        >
            Save as new Preset
        </animated.button>
    );
};

interface DeletePresetButtonProps {
    auth: typeof AuthService;
    clickHandler: (event: any) => void;
}

const DeleteButton: React.FC<DeletePresetButtonProps> = (props) => {
    const deletePresetButtonSpring = useSpring(_deletePresetButtonSpring);
    const { presetButtons, deleteModeActive } = getGlobalState(useSelector);

    return (
        <animated.button
            role="button"
            data-testid="deletePreset"
            style={deletePresetButtonSpring}
            className={
                props.auth.loggedIn() ? "preset-button delete-button" : "preset-button-disabled"
            }
            disabled={!props.auth.loggedIn()} // enable if logged in
            onClick={props.clickHandler}
        >
            {Array.isArray(presetButtons) && presetButtons.length > 0
                ? deleteModeActive
                    ? "Don't Delete A Preset"
                    : "Delete A Preset"
                : null}
        </animated.button>
    );
};

interface OpenNewWindowButtonProps {
    handleOpenNewWindow: (event: any) => void;
}

const OpenNewWindowButton: React.FC<OpenNewWindowButtonProps> = (props) => {
    const openNewWindowButtonSpring = useSpring(_openNewWindow);
    return (
        <animated.button
            role="button"
            data-testid="openNewWindow"
            style={openNewWindowButtonSpring}
            className="preset-button"
            onClick={props.handleOpenNewWindow}
        >
            {"Open LED Grid In New Window"}
        </animated.button>
    );
};

interface ToggleMIDIMapEditModeButtonProps {
    toggleMIDIMapEditMode: (event: any) => void;
}

const ToggleMIDIMapEditModeButton: React.FC<ToggleMIDIMapEditModeButtonProps> = (props) => {
    const toggleMIDIMapEditModeButton = useSpring(_toggleMIDIMapEditModeButton);
    const { midiEditMode } = getGlobalState(useSelector);
    return (
        <animated.button
            role="button"
            data-testid="toggleMidiMode"
            style={{
                ...toggleMIDIMapEditModeButton,
                backgroundColor: `${midiEditMode ? "purple" : "black"}`,
            }}
            className="preset-button"
            onClick={props.toggleMIDIMapEditMode}
        >
            {"Toggle MIDI Map Edit Mode"}
        </animated.button>
    );
};

export const StyledPresetControlButtonsContainer = styled.div`
    & {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        margin-top: 20px;
        height: 10wh;
        margin-bottom: 10px;
    }
`;

const PresetControlButtonsContainer: React.FC<{
    children: React.ReactNode | React.ReactNode[];
}> = ({ children }) => {
    return <StyledPresetControlButtonsContainer>{children}</StyledPresetControlButtonsContainer>;
};

export type {
    SavePresetButtonProps,
    DeletePresetButtonProps,
    PresetLabelTitleProps,
    SaveDefaultButtonProps,
    OpenNewWindowButtonProps,
    ToggleMIDIMapEditModeButtonProps,
};
export {
    SavePresetButton,
    PresetLabelTitle,
    PresetControlButtonsContainer,
    ResetTimerButton,
    SaveDefaultButton,
    DeleteButton,
    OpenNewWindowButton,
    ToggleMIDIMapEditModeButton,
    IsHSLButton,
};
