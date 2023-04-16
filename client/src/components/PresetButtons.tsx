/* eslint-disable no-empty */
import React, { useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import PresetButton from "./PresetButton";
import Auth from "../utils/AuthService";
import API from "../utils/ApiService";
import { animVarCoeffChange, presetSwitch } from "../actions/led-actions";
import { IPresetButton } from "../types";
import { Modal } from "./Modal/ModalBase";
import SavePresetModalContent from "./Modal/SavePresetModal";
import { setAllInactive, setPresetButtonsList } from "../actions/preset-button-actions";
import { IDBPreset, PresetButtonsList } from "../utils/PresetButtonsListClass";
import { Slider } from "./Slider";
import DeletePresetConfirmModal from "./Modal/DeletePresetConfirmModal";
import { setDeleteModalOpen, toggleDeleteMode } from "../actions/delete-modal-actions";
import { setSaveModalContext, setSaveModalIsOpen } from "../actions/save-modal-actions";
import { keyGen } from "../utils/keyGen";
import MIDIListenerWrapper from "./MIDIListenerWrapper";
import { getGlobalState } from "../reducers";
import {
    ClearButton,
    DeleteButton,
    OpenNewWindowButton,
    PresetControlButtonsContainer,
    PresetLabelTitle,
    SaveDefaultButton,
    SavePresetButton,
} from "./PresetButton.style";
import { clearStyle } from "../actions/style-actions";

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

    function handleOpenNewWindow(event: any): void {
        event.preventDefault();
        window.open(window.location + "LedWindow");
        PresetButtonsList.setStyle(dispatch, presetName, animVarCoeff);
    }

    function deleteButtonClickHandler(event: any): void {
        event.preventDefault();
        dispatch(toggleDeleteMode(deleteModeActive ? false : true));
    }

    function clearButtonClickHandler(event: any): void {
        event.preventDefault();
        dispatch(presetSwitch(""));
        dispatch(clearStyle());
        dispatch(setAllInactive(presetButtons));
    }

    const getPresets = useCallback(async (): Promise<IDBPreset[] | void> => {
        try {
            const presets = await API.getUserPresets(Auth.getToken() as string);
            if (Array.isArray(presets)) return presets;
        } catch (error) {}
    }, []);

    const getDefaultForActiveStatus = useCallback(async (): Promise<IDBPreset | void> => {
        const preset = (await API.getDefaultPreset(Auth.getToken() as string)) as IDBPreset;
        return preset;
    }, []);

    useEffect(() => {
        if (presetButtons?.length === 0) {
            if (!Auth.loggedIn()) {
                const presetNames = ["rainbowTest", "v2", "waves", "spiral", "fourSpirals", "dm5"];

                const tempPresets = presetNames.map((name) => {
                    return {
                        _id: keyGen(),
                        presetName: name,
                        displayName: name,
                        animVarCoeff: "64",
                    } as IDBPreset;
                });

                const tempButtons = new PresetButtonsList((event: any) => {
                    event.preventDefault();
                }, tempPresets).getList() as IPresetButton[];

                dispatch(setPresetButtonsList(tempButtons));
            } else {
                (async (): Promise<void> => {
                    const presets = (await getPresets()) as IDBPreset[];
                    const activePreset = (await getDefaultForActiveStatus()) as IDBPreset;

                    const buttons = new PresetButtonsList(
                        (event: any) => {
                            //click handler
                            event.preventDefault();
                        },
                        presets,
                        //default active on page load if logged in
                        activePreset && activePreset._id ? activePreset._id : void 0
                    ).getList() as IPresetButton[];

                    dispatch(setPresetButtonsList(buttons));
                })();
            }
        }

        return () => {
            /*do nothing on unmount */
        };
    }, [dispatch, getPresets, getDefaultForActiveStatus, presetButtons?.length]);

    return (
        <>
            <Modal isOpen={saveModalIsOpen}>
                <SavePresetModalContent
                    context={saveModalContext}
                    onClose={(event) => {
                        event.preventDefault();
                        dispatch(setSaveModalIsOpen(false));
                    }}
                />
            </Modal>

            <Modal isOpen={deleteModalIsOpen}>
                <DeletePresetConfirmModal
                    context={deleteModalContext}
                    onCancel={(event: any) => {
                        event.preventDefault();
                        dispatch(setDeleteModalOpen(false));
                        dispatch(toggleDeleteMode(deleteModeActive ? false : true));
                    }}
                    onConfirm={(event: any) => {
                        event.preventDefault();
                        dispatch(setDeleteModalOpen(false));
                        dispatch(toggleDeleteMode(deleteModeActive ? false : true));
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
            </PresetControlButtonsContainer>

            <div data-testid="buttons-parent" style={{ marginBottom: "2em" }}>
                {/* preset style toggle buttons */}
                {Array.isArray(presetButtons) &&
                    presetButtons.map((button) => {
                        return <PresetButton key={button.key} button={{ ...button }} />;
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
                                dispatch(animVarCoeffChange(event.target.value));
                                dispatch(
                                    setSaveModalContext({
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
