/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { KeyIcon } from "./KeyIcon";
import { modalActions } from "../store/modalSlice";
import { PresetButtonsList } from "../utils/PresetButtonsListClass";
import { getGlobalState } from "../store/store";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { UIInterfaceDeviceName } from "../constants";
import { IPresetButton } from "../types";

interface PresetButtonProps {
    index: number;
    button: IPresetButton;
}

const PresetButton: React.FC<PresetButtonProps> = ({ button, index }) => {
    const { 
        id, 
        role, 
        displayName, 
        testid, 
        isActive, 
        clickHandler, 
        keyBinding 
    } = button;

    const dispatch = useDispatch();
    const { 
        deleteModeActive, 
        midiEditMode,
    } = getGlobalState(useSelector);

    const deriveUiNameFromIndex = React.useCallback((index: number): UIInterfaceDeviceName => {
        return `button_${index + 1}_position` as any;
    }, []);

    function determineStyle(isActive: boolean, deleteModeActive: boolean): string {
        switch (true) {
            case isActive && !deleteModeActive: {
                return "preset-button-active";
            }
            case !isActive && !deleteModeActive: {
                return "preset-button-inactive";
            }
            case !isActive && deleteModeActive: {
                return "preset-delete-mode";
            }
            case isActive && deleteModeActive: {
                return "preset-delete-mode";
            }
            /* istanbul ignore next */
            default:
                return "";
        }
    }

    const onClickHandler = React.useCallback(
        (event: React.MouseEvent<HTMLButtonElement>): void => {
            clickHandler(event);
            if (midiEditMode) {
                MIDIMappingPreference.listeningForEditsHandler(dispatch, deriveUiNameFromIndex(index));
                return;
            }
            if (!deleteModeActive) {
                dispatch(
                    presetButtonsListActions.checkPresetButtonsActive({
                        id,
                    })
                );
                PresetButtonsList.setStyle(dispatch, button);
            } else {
                dispatch(modalActions.setDeleteModalOpen(true));
                dispatch(modalActions.setDeleteModalContext({ btnId: id, displayName }));
            }
        },
        [
            button,
            clickHandler,
            deleteModeActive,
            deriveUiNameFromIndex,
            displayName,
            dispatch,
            id,
            index,
            midiEditMode,
        ]
    );

    return (
        <>
            <button
                style={{ margin: "0 auto" }}
                tabIndex={-1}
                id={button.analyserPresetName + "-" + id}
                data-testid={testid}
                role={role}
                className={determineStyle(isActive, deleteModeActive)}
                onClick={onClickHandler}
            >
                {/* TODO: make display none if the screen is mobile, check user agent? or just media query??*/}
                {<KeyIcon type={keyBinding} />}
                <p style={{ margin: 0 }}>{displayName}</p>
            </button>
        </>
    );
};

export default PresetButton;
