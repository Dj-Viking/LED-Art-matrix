import React from "react";
import { escape } from "he";

const PresetButtonStyles: React.FC = (): JSX.Element => {
  return (
    <style dangerouslySetInnerHTML={{
      __html: escape(`
        
        .preset-delete-mode {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          border-radius: 10px;
          height: 50px;
          width: 100px;
          text-align: center;
          color: white;
          background-color: red;
          cursor: pointer;
        }
        .preset-button {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          border-radius: 10px;
          height: 50px;
          width: 100px;
          text-align: center;
          color: white;
          background-color: black;
          cursor: pointer;
        }
        .preset-button-active {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          border-radius: 10px;
          height: 50px;
          width: 100px;
          text-align: center;
          color: white;
          background-color: green;
          cursor: pointer;
        }

        .preset-button-disabled {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          height: 50px;
          width: 100px;
          border-radius: 10px;
          text-align: center;
          cursor: default;
        }

        .preset-button-inactive {
          margin-left: 5px;
          margin-right: 5px;
          margin-bottom: 10px;
          height: 50px;
          width: 100px;
          border-radius: 10px;
          background-color: black;
          text-align: center;
          cursor: pointer;
        }
      `)
    }}></style>
  );
};

export default PresetButtonStyles;