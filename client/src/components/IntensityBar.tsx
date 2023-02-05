import React from "react";

interface IntensityBarProps {
    intensity: number;
}

const IntensityBar: React.FC<IntensityBarProps> = ({ intensity }) => {
    return (
        <>
            <span>Intensity: {intensity}</span>
            <div
                style={{
                    marginTop: "1em",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <progress style={{ width: "50%" }} value={intensity} max={127}></progress>
            </div>
        </>
    );
};

export default IntensityBar;
