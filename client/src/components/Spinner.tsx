import React from "react";

export const Spinner: React.FC = (): JSX.Element => (
    <div style={{ display: "flex", justifyContent: "center" }}>
        <div className="lds-roller">
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
            <div />
        </div>
    </div>
);
