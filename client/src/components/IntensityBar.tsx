import React from "react";

interface IntensityBarProps {
    intensity: number;
}

const IntensityBar: React.FC<IntensityBarProps> = ({ intensity }) => {
    return (
        <>
            <span style={{ margin: "0 auto" }}>Intensity: {intensity}</span>
            <div
                style={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <input
                    onChange={() => {
                        /* */
                    }}
                    className="myrangestyle"
                    type="range"
                    style={{ width: "50%" }}
                    value={intensity}
                    max={127}
                />
            </div>
        </>
    );
};

export default IntensityBar;
