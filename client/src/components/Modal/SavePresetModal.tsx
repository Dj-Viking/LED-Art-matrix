import React, { useState } from "react";
import { escape } from "he";
import API from "../../utils/ApiService";
import Auth from "../../utils/AuthService";
import { useDispatch } from "react-redux";
import { IDBPreset, PresetButtonsList } from "../../utils/PresetButtonsListClass";
import { presetButtonsListActions } from "../../store/presetButtonListSlice";
interface SavePresetModalProps {
    onClose: React.MouseEventHandler<HTMLElement>;
    context: { animVarCoeff: string; presetName: string };
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({ onClose, context: { animVarCoeff, presetName } }) => {
    const [error, setError] = useState<string>("");
    const [input, setInput] = useState<string>("");
    const dispatch = useDispatch();

    function handleChange(event: any): void {
        event.preventDefault();
        setInput(event.target.value);
    }
    async function handleSubmit(event: any): Promise<void | unknown> {
        event.preventDefault();
        try {
            const dbPresets = (await API.addNewPreset(
                {
                    presetName,
                    animVarCoeff,
                    displayName: input,
                },
                Auth.getToken() as string
            )) as IDBPreset[];

            if (Array.isArray(dbPresets)) {
                const presets = new PresetButtonsList((event: any) => {
                    event.preventDefault();
                }, dbPresets).getList();

                dispatch(presetButtonsListActions.setPresetButtonsList(presets));

                onClose(event);
                setInput("");
            }
            return void 0;
        } catch (error) {
            const err = error as Error;
            console.log("error with save preset", err);
            setError(`Oops! ${err.message || err}`);
            return void 0;
        }
    }
    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: escape(`
        .modal-close-button {
          border: 1px solid grey;
          cursor: pointer;
          background-color: white;
          color: red;
          width: 100px;
          height: 40px;
          margin: 0 auto;
          border-radius: 10px;
          margin: .5em;
          transition: .1s;
          box-shadow: 4px 3px 8px black; 
        }
        .modal-close-button:hover {
          transition: .5s;
          background-color: red;
          color: white;
          box-shadow: 5px 4px 9px red; 
        }
        .modal-save-button {
          border: 1px solid grey;
          cursor: pointer;
          background-color: green;
          color: white;
          height: 40px;
          width: 100px;
          border-radius: 10px;
          margin: .5em;
          transition: .1s;
          box-shadow: 4px 3px 8px black; 
        }
        .modal-save-button-disabled {
          height: 40px;
          width: 100px;
          border: 1px solid grey;
          margin: .5em;
          pointer-events: none;
          background-color: grey;
          color: white;
          border-radius: 10px;
        }
        .modal-save-button:hover {
          transition: .5s;
          background-color: green;
          color: white;
          box-shadow: 5px 4px 9px green; 
        }
      `),
                }}
            ></style>
            <div
                data-testid="save-modal"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <button
                    type="button"
                    data-testid="modal-close-button"
                    className="modal-close-button"
                    onClick={(event) => {
                        onClose(event);
                        setInput("");
                    }}
                >
                    CLOSE
                </button>
                <h1 style={{ color: "black" }}>SAVE PRESET</h1>

                <span
                    data-testid="modal-anim-var-coeff"
                    style={{
                        color: "black",
                        marginBottom: "1em",
                    }}
                >
                    Animation Variation: {animVarCoeff}
                </span>

                <form>
                    <label style={{ color: "black" }} htmlFor="preset-name">
                        Preset Name:
                    </label>

                    <input
                        autoComplete="off"
                        name="preset-name"
                        data-testid="modal-preset-name-input"
                        style={{ color: "black" }}
                        type="text"
                        value={input}
                        onChange={handleChange}
                    />

                    <button
                        data-testid="modal-save-button"
                        disabled={input.length === 0}
                        type="submit"
                        className={input.length === 0 ? "modal-save-button-disabled" : "modal-save-button"}
                        onClick={handleSubmit}
                    >
                        SAVE
                    </button>
                    {error.length ? (
                        <span data-testid="add-error" style={{ color: "red" }}>
                            {error}
                        </span>
                    ) : null}
                </form>
            </div>
        </>
    );
};

export { SavePresetModal };
