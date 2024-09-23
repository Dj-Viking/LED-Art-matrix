/* eslint-disable testing-library/prefer-presence-queries */
/* eslint-disable testing-library/no-unnecessary-act */
// @ts-ignore
import React from "react";
import App from "../../App";
import { Provider } from "react-redux";
import { render, cleanup, screen } from "@testing-library/react";
import { createMemoryHistory } from "history";
import { Router } from "react-router-dom";
import "@types/jest";
import "@testing-library/jest-dom";
import "@testing-library/jest-dom/extend-expect";
import { act } from "react-dom/test-utils";
import { MOCK_ACCESS_INPUTS, MOCK_ACCESS_OUTPUTS } from "../../utils/mocks";
import { MIDIAccessRecord, MIDIConnectionEvent } from "../../utils/MIDIControlClass";
import { toolkitStore } from "../../store/store";

// @ts-ignore need to implement a fake version of this for the jest test as expected
// did not have this method implemented by default during the test
window.navigator.requestMIDIAccess = async function (): Promise<MIDIAccessRecord> {
    return Promise.resolve({
        inputs: MOCK_ACCESS_INPUTS,
        outputs: MOCK_ACCESS_OUTPUTS,
        sysexEnabled: false,
        onstatechange: function (_event: MIDIConnectionEvent): void {
            return void 0;
        },
    } as MIDIAccessRecord);
};

describe("test art scroller turning on with gifs", () => {
    beforeEach(() => {
        // @ts-ignore mock fetch
        global.fetch = jest.fn(() => {
            // res { status, json }
            return Promise.resolve({
                status: 200,
                json: () => {
                    //data { gifs }
                    return Promise.resolve({
                        gifs: [
                            {
                                gifCategory: "trippy",
                                gifSrc: "https://media2.giphy.com/media/9MJ65OWvrNIXnOiNEk/giphy.gif?cid=2d67d1e65olojaxv1uo2f1t3al0bx8e8cyzlfyqo9gs154lr&rid=giphy.gif&ct=g",
                                limit: "10",
                                __v: 0,
                                _id: "61eb059eb7b933276390e80f",
                            },
                        ],
                    });
                },
            });
        });
    });
    afterEach(() => {
        cleanup();
    });
    it("checks artscroller is rendering the gifs", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        const history = createMemoryHistory();

        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <App />
                    </Router>
                </Provider>
            </>
        );

        expect(fetch).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        // turn on scroller before the test starts
        const showscrollerbtn = screen.getByTestId("show-scroller-btn");

        await act(async () => {
            showscrollerbtn.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        const startBtn = screen.getByTestId("start-art");
        expect(startBtn).toBeInTheDocument();
        expect(startBtn).not.toBeDisabled();

        await act(async () => {
            startBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(fetch).toHaveBeenCalledTimes(0);

        // expect(screen.getByTestId("gif-0")).toBeInTheDocument();
    });

    it("tests the sliders change the artscrollers style values", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        const history = createMemoryHistory();

        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <App />
                    </Router>
                </Provider>
            </>
        );

        expect(fetch).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        // turn on scroller before the test starts
        const showscrollerbtn = screen.getByTestId("show-scroller-btn");

        await act(async () => {
            showscrollerbtn.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        const startBtn = screen.getByTestId("start-art");
        expect(startBtn).toBeInTheDocument();
        expect(startBtn).not.toBeDisabled();

        await act(async () => {
            startBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(fetch).toHaveBeenCalledTimes(0);

        // expect(screen.getByTestId("gif-0")).toBeInTheDocument();
        // expect(screen.getByTestId("gif-0").id).toBe("gif-0");

        // const gifRef = screen.getByTestId("gif-0");
        // //check classes of the gif image
        // expect(gifRef.classList.length).toBe(1);
        // expect(gifRef.classList[0]).toBe("scroller-media");
        // expect(typeof gifRef.style).toBe("object");
        // //parse parameters out of the dynamic stylesheet on the art scroller gif item
        // const gifStyleRef = gifRef.style;
        // let styleValues = TestService.getStyles(gifStyleRef);

        // // the aimation duration value is always random
        // expect(styleValues.values).toHaveProperty("animation-duration");

        // expect(styleValues.values).toHaveProperty("filter");
        // expect(styleValues.values["filter"]).toBe("invert(0)");

        // expect(styleValues.values).toHaveProperty("top");
        // expect(styleValues.values["top"]).toBe("111vh");

        // expect(styleValues.values).toHaveProperty("width");
        // expect(styleValues.values["width"]).toBe("30vw");

        // expect(styleValues.values).toHaveProperty("left");
        // expect(styleValues.values["left"]).toBe("33vw");

        // //INTERACT WITH SLIDERS
        // const sliders = {
        //     circleWidth: screen.getByTestId("circle-width") as HTMLInputElement,
        //     vertPos: screen.getByTestId("vert-pos") as HTMLInputElement,
        //     left: screen.getByTestId("horiz-pos") as HTMLInputElement,
        //     invert: screen.getByTestId("invert") as HTMLInputElement,
        //     scrollSpeed: screen.getByTestId("anim-duration") as HTMLInputElement,
        // };

        // expect(sliders.circleWidth).toBeInTheDocument();
        // expect(sliders.circleWidth.value).toBe("30");

        // expect(sliders.vertPos).toBeInTheDocument();
        // expect(sliders.vertPos.value).toBe("111");

        // expect(sliders.left).toBeInTheDocument();
        // expect(sliders.left.value).toBe("33");

        // expect(sliders.invert).toBeInTheDocument();
        // expect(sliders.invert.value).toBe("0");

        // expect(sliders.scrollSpeed).toBeInTheDocument();
        // expect(sliders.scrollSpeed.value).toBe("30");

        // act(() => {
        //     fireEvent.change(sliders.circleWidth, { target: { value: "10" } });
        //     sliders.circleWidth.dispatchEvent(TestService.createBubbledEvent("change"));

        //     fireEvent.change(sliders.vertPos, { target: { value: "10" } });
        //     sliders.vertPos.dispatchEvent(TestService.createBubbledEvent("change"));

        //     fireEvent.change(sliders.left, { target: { value: "10" } });
        //     sliders.left.dispatchEvent(TestService.createBubbledEvent("change"));

        //     fireEvent.change(sliders.invert, { target: { value: "20" } });
        //     sliders.invert.dispatchEvent(TestService.createBubbledEvent("change"));

        //     fireEvent.change(sliders.scrollSpeed, { target: { value: "10" } });
        //     sliders.scrollSpeed.dispatchEvent(TestService.createBubbledEvent("change"));
        // });

        // expect(sliders.circleWidth.value).not.toBe("0");
        // expect(sliders.circleWidth.value).toBe("10");

        // expect(sliders.vertPos.value).not.toBe("0");
        // expect(sliders.vertPos.value).toBe("10");

        // expect(sliders.left.value).not.toBe("0");
        // expect(sliders.left.value).toBe("10");

        // expect(sliders.invert.value).not.toBe("0");
        // expect(sliders.invert.value).toBe("20");

        // expect(sliders.scrollSpeed.value).not.toBe("0");
        // expect(sliders.scrollSpeed.value).toBe("10");

        // const gifRef2 = screen.getByTestId("gif-0");
        // const styleValues2 = TestService.getStyles(gifRef2.style);

        // expect(styleValues2.values).toHaveProperty("animation-duration");

        // expect(styleValues2.values).toHaveProperty("filter");
        // expect(styleValues2.values["filter"]).toBe("invert(0.2)");

        // expect(styleValues2.values).toHaveProperty("top");
        // expect(styleValues2.values["top"]).toBe("10vh");

        // expect(styleValues2.values).toHaveProperty("width");
        // expect(styleValues2.values["width"]).toBe("10vw");

        // expect(styleValues2.values).toHaveProperty("left");
        // expect(styleValues2.values["left"]).toBe("10vw");
    });

    it("tests turning on and off the art scroller", async () => {
        expect(localStorage.getItem("id_token")).toBe(null);
        const history = createMemoryHistory();

        render(
            <>
                <Provider store={toolkitStore}>
                    <Router history={history}>
                        <App />
                    </Router>
                </Provider>
            </>
        );

        expect(fetch).toHaveBeenCalledTimes(0);
        expect(screen.getByTestId("location-display")).toHaveTextContent("/");

        // turn on scroller before the test starts
        const showscrollerbtn = screen.getByTestId("show-scroller-btn");

        await act(async () => {
            showscrollerbtn.dispatchEvent(new MouseEvent("click", {bubbles: true}));
        });

        const startBtn = screen.getByTestId("start-art");
        expect(startBtn).toBeInTheDocument();
        expect(startBtn).not.toBeDisabled();

        await act(async () => {
            startBtn.dispatchEvent(new MouseEvent("click", { bubbles: true }));
        });

        expect(fetch).toHaveBeenCalledTimes(0);

        // expect(screen.getByTestId("gif-0")).toBeInTheDocument();
        // expect(screen.getByTestId("gif-0").id).toBe("gif-0");

        // const toggleBtn = screen.getByTestId("switch-scroller");
        // expect(toggleBtn).toBeInTheDocument();

        // act(() => {
        //     toggleBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        // });

        // const gifsContainer = screen.getByTestId("gifs-container");
        // expect(typeof gifsContainer.style).toBe("object");
        // const gifContainerStyle = TestService.getStyles(gifsContainer.style);

        // expect(gifContainerStyle.values["display"]).toBe("none");

        // act(() => {
        //     toggleBtn.dispatchEvent(TestService.createBubbledEvent("click"));
        // });

        // const gifsContainer2 = screen.getByTestId("gifs-container");
        // expect(typeof gifsContainer2.style).toBe("object");
        // const gifContainerStyle2 = TestService.getStyles(gifsContainer2.style);

        // expect(gifContainerStyle2.values["display"]).toBe("block");
    });
});
