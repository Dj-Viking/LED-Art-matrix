import React from "react";
import {
    ArtScrollerBorderTop,
    ArtScrollerCircleWidthLabel,
    ArtScrollerCircleWidthSlider,
    ArtScrollerGifButtonContainer,
    ArtScrollerGifListSelector,
    ArtScrollerGifs,
    ArtScrollerHorizontalPositionSlider,
    ArtScrollerHorizontalPositionSliderLabel,
    ArtScrollerInvertColorsSlider,
    ArtScrollerInvertColorsSliderLabel,
    ArtScrollerMainContainer,
    ArtScrollerMakeNewGifCollection,
    ArtScrollerSection,
    ArtScrollerSliderContainer,
    ArtScrollerSpeedSlider,
    ArtScrollerSpeedSliderLabel,
    ArtScrollerStartButton,
    ArtScrollerTitle,
    ArtScrollerToggleButton,
    ArtScrollerVerticalPositionSlider,
    ArtScrollerVerticalPositionSliderLabel,
} from "./ArtScroller.style";
import AuthService from "../utils/AuthService";

const ArtScroller: React.FC = (): JSX.Element => {
    return (
        <>
            <ArtScrollerMainContainer>
                <ArtScrollerSection>
                    <ArtScrollerBorderTop />
                    <ArtScrollerTitle />
                    {/* gif buttons */}
                    <ArtScrollerGifButtonContainer>
                        <ArtScrollerStartButton auth={AuthService} />
                        <ArtScrollerToggleButton />
                        <ArtScrollerMakeNewGifCollection auth={AuthService} />
                    </ArtScrollerGifButtonContainer>
                    {/* sliders */}
                    <ArtScrollerSliderContainer>
                        <ArtScrollerGifListSelector />
                        <ArtScrollerCircleWidthLabel />
                        <ArtScrollerCircleWidthSlider />
                        <ArtScrollerVerticalPositionSliderLabel />
                        <ArtScrollerVerticalPositionSlider />
                        <ArtScrollerHorizontalPositionSliderLabel />
                        <ArtScrollerHorizontalPositionSlider />
                        <ArtScrollerInvertColorsSliderLabel />
                        <ArtScrollerInvertColorsSlider />
                        <ArtScrollerSpeedSliderLabel />
                        <ArtScrollerSpeedSlider />
                    </ArtScrollerSliderContainer>
                    {/* gifs */}
                    <ArtScrollerGifs />
                </ArtScrollerSection>
            </ArtScrollerMainContainer>
        </>
    );
};

export default ArtScroller;
