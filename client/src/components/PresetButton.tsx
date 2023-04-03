/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { checkPresetButtonsActive } from "../actions/preset-button-actions";
import { setDeleteModalOpen, setDeleteModalContext } from "../actions/delete-modal-actions";
import { KeyBinding, KeyIcon } from "./KeyIcon";
import { PresetButtonsList } from "../utils/PresetButtonsListClass";
import { getGlobalState } from "../reducers";

interface PresetButtonProps {
    button: {
        id: string;
        role: string;
        presetName: string;
        keyBinding: KeyBinding;
        displayName: string;
        animVarCoeff: string;
        isActive: boolean;
        testid: string;
        classList?: string;
        clickHandler: React.MouseEventHandler<HTMLElement>;
    };
}

const PresetButton: React.FC<PresetButtonProps> = ({ button }) => {
    const {
        id,
        role,
        presetName,
        displayName,
        animVarCoeff,
        testid,
        isActive,
        clickHandler,
        keyBinding,
    } = button;
    const dispatch = useDispatch();
    const { presetButtons, deleteModeActive } = getGlobalState(useSelector);

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

    return (
        <>
            <button
                tabIndex={-1}
                id={id}
                data-testid={testid}
                role={role}
                className={determineStyle(isActive, deleteModeActive)}
                onClick={(event: any) => {
                    clickHandler(event);
                    if (!deleteModeActive) {
                        dispatch(checkPresetButtonsActive(presetButtons, id));
                        PresetButtonsList.setStyle(dispatch, presetName, animVarCoeff);
                    } else {
                        dispatch(setDeleteModalOpen(true));
                        dispatch(setDeleteModalContext({ btnId: id, displayName }));
                    }
                }}
            >
                {/* TODO: make display none if the screen is mobile, check user agent? or just media query??*/}
                <KeyIcon type={keyBinding} />
                <p style={{ margin: 0 }}>{displayName}</p>
            </button>
        </>
    );
};

export default PresetButton;
