import React, { useState } from "react";
import { escape } from "he";
interface SavePresetModalProps {
  onClose: React.MouseEventHandler<HTMLElement>;
  context: { animVarCoeff: string }
}

const SavePresetModal: React.FC<SavePresetModalProps> = ({ 
  onClose,
  context: { animVarCoeff }
}) => {

  const [ input, setInput ] = useState<string>("");
  function handleChange(event: any): void {
    event.preventDefault();
    setInput(event.target.value);
  }
  function handleSubmit(event: any): void {
    onClose(event);
    setInput("");
  }
  return (
    <>
      <style dangerouslySetInnerHTML={{__html: escape(`
        .modal-close-button {
          border: 1px solid grey;
          cursor: pointer;
          background-color: white;
          color: red;
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
          border-radius: 10px;
          margin: .5em;
          transition: .1s;
          box-shadow: 4px 3px 8px black; 
        }
        .modal-save-button-disabled {
          height: 40px;
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
      `)}}>

      </style>
      <div 
        style={{ 
          display: "flex", 
          flexDirection: "column", 
          justifyContent: "center" 
        }}
      >
        <span 
          className="modal-close-button"
          onClick={(event) => {
            onClose(event);
            setInput("");
          }}
        >
          CLOSE
        </span>
        <h1 style={{ color: "black" }}>SAVE PRESET</h1>
        
        <span 
          style={{ 
            color: "black", 
            marginBottom: "1em" 
          }}
        >
          Animation Variation: {animVarCoeff}
        </span>
        
        <label style={{ color: "black" }} htmlFor="preset-name">preset name</label>
        
        <input style= {{ color: "black" }} type="text" value={input} onChange={handleChange} />
        
        <button disabled={input.length === 0} type="submit" className={ input.length === 0 ? "modal-save-button-disabled" : "modal-save-button"} onClick={handleSubmit}>
          SAVE
        </button>

      </div>
    </>
  );
};


export default SavePresetModal;