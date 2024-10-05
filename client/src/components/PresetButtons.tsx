/* eslint-disable no-empty */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PresetButton from "./PresetButton";
import Auth from "../utils/AuthService";
import API from "../utils/ApiService";
import { IPresetButton } from "../types";
import { Modal } from "./Modal/ModalBase";
import { SavePresetModal } from "./Modal/SavePresetModal";
import { PresetButtonsList } from "../utils/PresetButtonsListClass";
import { DeletePresetModal } from "./Modal/DeletePresetConfirmModal";
import {
    ResetTimerButton,
    DeleteButton,
    IsHSLButton,
    OpenNewWindowButton,
    PresetControlButtonsContainer,
    PresetLabelTitle,
    SaveDefaultButton,
    SavePresetButton,
    ToggleMIDIMapEditModeButton,
    StyledPresetButtonsParent,
    StyledPresetButton,
} from "./PresetButton.style";
import { getGlobalState } from "../store/store";
import { modalActions } from "../store/modalSlice";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { midiActions } from "../store/midiSlice";
import { MIDIMappingPreference } from "../utils/MIDIMappingClass";
import { UIInterfaceDeviceName } from "../constants";
export interface IPresetButtonsProps {
    children?: React.ReactNode | React.ReactNode[];
}

export const PresetButtons: React.FC<IPresetButtonsProps> = (): JSX.Element => {
    const dispatch = useDispatch();

    const {
        presetName,
        animVarCoeff,
        deleteModalIsOpen,
        deleteModalContext,
        deleteModeActive,
        saveModalIsOpen,
        saveModalContext,
        presetButtons,
        midiEditMode,
        midiMappingInUse,
        controllerInUse,
    } = getGlobalState(useSelector);

    async function handleSaveDefault(event: any): Promise<void> {
        event.preventDefault();
        /* istanbul ignore next */
        const preset: IPresetButton | void =
            Array.isArray(presetButtons) && presetButtons.length > 0
                ? presetButtons.filter((btn) => btn.isActive)[0]
                : void 0;

        if (preset) {
            await API.updateDefaultPreset({
                displayName: preset.displayName,
                _id: preset.id,
                name: presetName,
                animVarCoeff,
                token: Auth.getToken() as string,
            });
        }
    }

    const toggleMIDIMapEditMode = React.useCallback(
        (event: any): void => {
            event.preventDefault();
            dispatch(midiActions.toggleMidiEditMode());
        },
        [dispatch]
    );

    function handleOpenNewWindow(event: any): void {
        event.preventDefault();
        window.open(window.location + "LedWindow");
        PresetButtonsList.setStyle(dispatch,  { "presetName": presetName, "animVarCoeff": "1" } as any);
    }

    function deleteButtonClickHandler(event: any): void {
        event.preventDefault();
        dispatch(modalActions.toggleDeleteMode(deleteModeActive ? false : true));
    }

    useEffect(() => {
        if (Auth.loggedIn()) {
            dispatch(presetButtonsListActions.getPresetsAsync());
        } else {
            dispatch(presetButtonsListActions.setPresetButtonsList(PresetButtonsList.generateOfflinePresets()));
        }
        return () => {
            /*do nothing on unmount */
        };
    }, [dispatch]);

    return (
        <>
            <Modal isOpen={saveModalIsOpen}>
                <SavePresetModal
                    context={saveModalContext}
                    onClose={(event) => {
                        event.preventDefault();
                        dispatch(modalActions.setSaveModalIsOpen(false));
                    }}
                />
            </Modal>

            <Modal isOpen={deleteModalIsOpen}>
                <DeletePresetModal
                    context={deleteModalContext}
                    onCancel={(event) => {
                        event.preventDefault();
                        dispatch(modalActions.setDeleteModalOpen(false));
                        dispatch(modalActions.toggleDeleteMode(deleteModeActive ? false : true));
                    }}
                    onConfirm={(event) => {
                        event.preventDefault();
                        dispatch(modalActions.setDeleteModalOpen(false));
                        dispatch(modalActions.toggleDeleteMode(deleteModeActive ? false : true));
                    }}
                />
            </Modal>
            <PresetLabelTitle auth={Auth} />

            <PresetControlButtonsContainer>
                <ResetTimerButton />
                <IsHSLButton />
                <SaveDefaultButton auth={Auth} clickHandler={handleSaveDefault} />
                <SavePresetButton auth={Auth} />
                <DeleteButton auth={Auth} clickHandler={deleteButtonClickHandler} />
                <OpenNewWindowButton handleOpenNewWindow={handleOpenNewWindow} />
                <ToggleMIDIMapEditModeButton toggleMIDIMapEditMode={toggleMIDIMapEditMode} />
            </PresetControlButtonsContainer>

            <StyledPresetButtonsParent data-testid="buttons-parent">
                {/* preset style toggle buttons */}
                {presetButtons?.map?.((button, index) => {
                    const uiName: UIInterfaceDeviceName = ((index: number) => {
                        return `button_${index + 1}_position`;
                    })(index) as any;

                    const uiMapping = MIDIMappingPreference.getControlNameFromControllerInUseUIMapping(
                        midiMappingInUse.midiMappingPreference[controllerInUse],
                        uiName
                    );

                    return (
                        <StyledPresetButton key={button.id}>
                            {midiEditMode && (
                                <>
                                    <span>{"<MIDI>"}</span>
                                    <span>{`(${uiMapping})`}</span>
                                </>
                            )}
                            <PresetButton index={index} button={{ ...button }} />
                        </StyledPresetButton>
                    );
                })}
            </StyledPresetButtonsParent>
        </>
    );
};
