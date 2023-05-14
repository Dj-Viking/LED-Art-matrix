/* eslint-disable no-empty */
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import PresetButton from "./PresetButton";
import Auth from "../utils/AuthService";
import API from "../utils/ApiService";
import { IPresetButton } from "../types";
import { Modal } from "./Modal/ModalBase";
import SavePresetModalContent from "./Modal/SavePresetModal";
import { PresetButtonsList } from "../utils/PresetButtonsListClass";
import { Slider } from "./Slider";
import DeletePresetConfirmModal from "./Modal/DeletePresetConfirmModal";
import MIDIListenerWrapper from "./MIDIListenerWrapper";
import {
    ClearButton,
    DeleteButton,
    OpenNewWindowButton,
    PresetControlButtonsContainer,
    PresetLabelTitle,
    SaveDefaultButton,
    SavePresetButton,
    ToggleMIDIMapEditModeButton,
} from "./PresetButton.style";
import { ledActions } from "../store/ledSlice";
import { getGlobalState } from "../store/store";
import { modalActions } from "../store/modalSlice";
import { presetButtonsListActions } from "../store/presetButtonListSlice";
import { midiActions } from "../store/midiSlice";

export interface IPresetButtonsProps {
    children?: any;
}

const PresetButtons: React.FC<IPresetButtonsProps> = (): JSX.Element => {
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
            dispatch(presetButtonsListActions.toggleMidiMode());
            dispatch(midiActions.toggleMidiEditMode());
        },
        [dispatch]
    );

    function handleOpenNewWindow(event: any): void {
        event.preventDefault();
        window.open(window.location + "LedWindow");
        PresetButtonsList.setStyle(dispatch, presetName, animVarCoeff);
    }

    function deleteButtonClickHandler(event: any): void {
        event.preventDefault();
        dispatch(modalActions.toggleDeleteMode(deleteModeActive ? false : true));
    }

    function clearButtonClickHandler(event: any): void {
        event.preventDefault();
        dispatch(ledActions.setPresetName(""));
        dispatch(ledActions.clearStyle());
        dispatch(presetButtonsListActions.setAllInactive());
    }

    useEffect(() => {
        dispatch(presetButtonsListActions.getPresetsAsync());
        return () => {
            /*do nothing on unmount */
        };
    }, [dispatch]);

    return (
        <>
            <Modal isOpen={saveModalIsOpen}>
                <SavePresetModalContent
                    context={saveModalContext}
                    onClose={(event) => {
                        event.preventDefault();
                        dispatch(modalActions.setSaveModalIsOpen(false));
                    }}
                />
            </Modal>

            <Modal isOpen={deleteModalIsOpen}>
                <DeletePresetConfirmModal
                    context={deleteModalContext}
                    onCancel={(event: any) => {
                        event.preventDefault();
                        dispatch(modalActions.setDeleteModalOpen(false));
                        dispatch(modalActions.toggleDeleteMode(deleteModeActive ? false : true));
                    }}
                    onConfirm={(event: any) => {
                        event.preventDefault();
                        dispatch(modalActions.setDeleteModalOpen(false));
                        dispatch(modalActions.toggleDeleteMode(deleteModeActive ? false : true));
                    }}
                />
            </Modal>
            <PresetLabelTitle auth={Auth} />

            <PresetControlButtonsContainer>
                <ClearButton clickHandler={clearButtonClickHandler} />
                <SaveDefaultButton auth={Auth} clickHandler={handleSaveDefault} />
                <SavePresetButton auth={Auth} />
                <DeleteButton auth={Auth} clickHandler={deleteButtonClickHandler} />
                <OpenNewWindowButton handleOpenNewWindow={handleOpenNewWindow} />
                <ToggleMIDIMapEditModeButton toggleMIDIMapEditMode={toggleMIDIMapEditMode} />
            </PresetControlButtonsContainer>

            <div data-testid="buttons-parent" style={{ marginBottom: "2em" }}>
                {/* preset style toggle buttons */}
                {presetButtons?.map?.((button) => {
                    return <PresetButton key={button.id} button={{ ...button }} />;
                })}

                <MIDIListenerWrapper />

                {["dm5", "waves", "v2", "rainbowTest"].includes(presetName) && (
                    <>
                        <Slider
                            name="led-anim-var"
                            testid="led-anim-variation"
                            label="LED Animation Variation: "
                            inputValueState={animVarCoeff}
                            handleChange={(event) => {
                                event.preventDefault();
                                dispatch(ledActions.setAnimVarCoeff(event.target.value));
                                dispatch(
                                    modalActions.setSaveModalContext({
                                        presetName: presetName,
                                        animVarCoeff: event.target.value,
                                    })
                                );
                            }}
                        />
                    </>
                )}
            </div>
        </>
    );
};

export default PresetButtons;
