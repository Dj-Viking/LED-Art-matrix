// @ts-expect-error need react in scope for JSX
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
