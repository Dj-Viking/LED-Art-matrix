import React, { useState } from "react";
import { escape } from "he";
import API from "../../utils/ApiService";
import { AuthService as Auth } from "../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { MyRootState } from "../../types";
interface DeletePresetConfirmModalProps {
  onConfirm: React.MouseEventHandler<HTMLElement>;
  onCancel: React.MouseEventHandler<HTMLElement>;
}

const SavePresetModal: React.FC<DeletePresetConfirmModalProps> = ({ 
  onConfirm,
  onCancel,
}) => {
  const [ error, setError ] = useState<string>("");
  const { presetButtons } = useSelector((state: MyRootState) => state.presetButtonsListState);
  const dispatch = useDispatch();

  // TODO: implement the api service for calling the api 
  // to delete the preset we confirm on the modal for a particular preset
  // that we clicked while delete mode was on

  
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: escape(`
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
      `)}}>

      </style>
      <div 
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
          }}
        >
          YES
        </button>
        <h1 style={{ color: "black" }}>DELETE PRESET ?</h1>

        

      </div>
    </>
  );
};


export default SavePresetModal;