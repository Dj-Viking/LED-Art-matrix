// eslint-disable-next-line
// @ts-ignore
import React from "react";

export const Spinner = (): JSX.Element => (
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
