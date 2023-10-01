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
import { KeyMappingClass } from "../utils/KeyMappingClass";

interface PresetButtonProps {
    index: number;
    button: {
        id: string;
        role: string;
        presetName: string;
        keyBinding: string;
        displayName: string;
        animVarCoeff: string;
        isActive: boolean;
        testid: string;
        classList?: string;
        clickHandler: React.MouseEventHandler<HTMLElement>;
    };
}

const PresetButton: React.FC<PresetButtonProps> = ({ button, index }) => {
    const { id, role, presetName, displayName, animVarCoeff, testid, isActive, clickHandler, keyBinding } = button;

    const dispatch = useDispatch();
    const { deleteModeActive, midiEditMode, keyMapEditMode } = getGlobalState(useSelector);

    const deriveUiNameFromIndex = React.useCallback((index: number): UIInterfaceDeviceName => {
        switch (index) {
            case 0:
                return "button_1_position";
            case 1:
                return "button_2_position";
            case 2:
                return "button_3_position";
            case 3:
                return "button_4_position";
            case 4:
                return "button_5_position";
            default:
                return "button_1_position";
        }
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
            if (keyMapEditMode) {
                KeyMappingClass.listeningForEditsHandler(dispatch, deriveUiNameFromIndex(index));
                return;
            }
            if (!deleteModeActive) {
                dispatch(
                    presetButtonsListActions.checkPresetButtonsActive({
                        id,
                    })
                );
                PresetButtonsList.setStyle(dispatch, presetName, animVarCoeff);
            } else {
                dispatch(modalActions.setDeleteModalOpen(true));
                dispatch(modalActions.setDeleteModalContext({ btnId: id, displayName }));
            }
        },
        [
            animVarCoeff,
            clickHandler,
            keyMapEditMode,
            deleteModeActive,
            deriveUiNameFromIndex,
            displayName,
            dispatch,
            id,
            index,
            midiEditMode,
            presetName,
        ]
    );

    return (
        <>
            <button
                style={{ margin: "0 auto" }}
                tabIndex={-1}
                id={id}
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
