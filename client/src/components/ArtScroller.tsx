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
import { Modal } from "./Modal/ModalBase";
import { getGlobalState } from "../reducers";
import { useDispatch, useSelector } from "react-redux";
import { SaveGifsModal } from "./Modal/SaveGifsModal";
import { setGifModalIsOpen } from "../actions/gif-modal-actions";

const ArtScroller: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();
    const { gifsModalIsOpen, gifsModalContext } = getGlobalState(useSelector);
    return (
        <>
            <ArtScrollerMainContainer>
                <Modal isOpen={gifsModalIsOpen || false}>
                    <SaveGifsModal
                        onClose={() => dispatch(setGifModalIsOpen(false))}
                        context={gifsModalContext || {}}
                    />
                </Modal>
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
                    <ArtScrollerGifs auth={AuthService} />
                </ArtScrollerSection>
            </ArtScrollerMainContainer>
        </>
    );
};

export default ArtScroller;
