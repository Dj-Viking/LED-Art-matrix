import React from "react";
import { useSelector } from "react-redux";
import he from "he";
import { ToolkitRootState } from "../store/store";
const LedStyleTag: React.FC = () => {
    const escapeHTML = he.escape;
    const { html } = useSelector((state: ToolkitRootState) => state.ledState);
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
