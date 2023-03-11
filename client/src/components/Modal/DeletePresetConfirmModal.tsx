import React, { useState } from "react";
import { escape } from "he";
import API from "../../utils/ApiService";
import Auth from "../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { MyRootState } from "../../types";
import { deletePreset } from "../../actions/preset-button-actions";
interface DeletePresetConfirmModalProps {
    context: { btnId: string; displayName: string };
    onConfirm: React.MouseEventHandler<HTMLElement>;
    onCancel: React.MouseEventHandler<HTMLElement>;
}

const DeletePresetModal: React.FC<DeletePresetConfirmModalProps> = ({
    onConfirm,
    onCancel,
    context: { btnId, displayName },
}) => {
    const [error, setError] = useState<string>("");
    const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);
    const dispatch = useDispatch();

    async function deleteThePreset(): Promise<void> {
        try {
            await API.deletePreset(btnId, Auth.getToken() as string);
            dispatch(deletePreset(presetButtons, btnId));
        } catch (error) {
            const err = error as Error;
            setError(err.message);
        }
    }

    return (
        <>
            <style
                dangerouslySetInnerHTML={{
                    __html: escape(`
        .modal-confirm-button {
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
        .modal-confirm-button:hover {
          transition: .5s;
          background-color: red;
          color: white;
          box-shadow: 5px 4px 9px red; 
        }
        .modal-cancel-button {
          border: 1px solid grey;
          cursor: pointer;
          background-color: white;
          color: blue;
          width: 100px;
          height: 40px;
          margin: 0 auto;
          border-radius: 10px;
          margin: .5em;
          transition: .1s;
          box-shadow: 4px 3px 8px black; 
        }
        .modal-cancel-button:hover {
          transition: .5s;
          background-color: blue;
          color: white;
          box-shadow: 5px 4px 9px blue; 
        }
      `),
                }}
            ></style>
            <div
                data-testid="delete-modal"
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <button
                    type="button"
                    data-testid="modal-cancel-button"
                    className="modal-cancel-button"
                    onClick={(event) => {
                        onCancel(event); //closes modal
                    }}
                >
                    NO
                </button>
                <button
                    type="button"
                    data-testid="modal-confirm-button"
                    className="modal-confirm-button"
                    onClick={(event) => {
                        onConfirm(event); //closes modal and deletes preset from user's collection
                        void deleteThePreset();
                    }}
                >
                    YES
                </button>
                <h1 style={{ color: "black" }}>
                    DELETE PRESET ? <p style={{ color: "black" }}>{displayName}</p>
                </h1>

                {error.length ? (
                    <span data-testid="delete-error" style={{ color: "red" }}>
                        {error}
                    </span>
                ) : null}
            </div>
        </>
    );
};

export default DeletePresetModal;
