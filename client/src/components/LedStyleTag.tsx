import React from "react";
import { useSelector } from "react-redux";
import { MyRootState } from "../types";
import he from "he";
const LedStyleTag: React.FC = () => {
  const escapeHTML = he.escape;
  const { html } = useSelector((state: MyRootState) => state.ledStyleTagState);
  return (
    <>
      <style
        dangerouslySetInnerHTML={{ __html: escapeHTML(html) }}
        id="led-style"
        data-testid="led-style"
      ></style>
    </>
  );
};


export default LedStyleTag;