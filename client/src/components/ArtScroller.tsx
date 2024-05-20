import React, { useEffect } from "react";
import * as S from "./ArtScroller.style";
import { Modal } from "./Modal/ModalBase";
import { useDispatch, useSelector } from "react-redux";
import { SaveGifsModal } from "./Modal/SaveGifsModal";
import { modalActions } from "../store/modalSlice";
import { getGlobalState } from "../store/store";
import { artScrollerActions } from "../store/artScrollerSlice";

const ArtScroller: React.FC = (): JSX.Element => {
    const dispatch = useDispatch();

    const { gifsModalIsOpen, gifsModalContext } = getGlobalState(useSelector);

    useEffect(() => {
        dispatch(artScrollerActions.getGifsAsync({ getNew: false }));
    }, [dispatch]);

    return (
        <>
            <S.ArtScrollerMainContainer>
                <Modal isOpen={gifsModalIsOpen || false}>
                    <SaveGifsModal
                        onClose={() => dispatch(modalActions.setGifModalIsOpen(false))}
                        context={gifsModalContext || {}}
                    />
                </Modal>
                <S.ArtScrollerSection>
                    <S.ArtScrollerBorderTop />
                    <S.ArtScrollerTitle />
                    {/* gif buttons */}
                    <S.ArtScrollerGifButtonContainer>
                        <S.ArtScrollerStartButton />
                        <S.ArtScrollerToggleButton />
                        <S.ArtScrollerSaveNewGifCollection />
                    </S.ArtScrollerGifButtonContainer>
                    {/* sliders */}
                    <S.ArtScrollerSliderContainer>
                        <S.ArtScrollerGifListSelector />
                        <S.ArtScrollerCircleWidthLabel />
                        <S.ArtScrollerCircleWidthSlider />
                        <S.ArtScrollerVerticalPositionSliderLabel />
                        <S.ArtScrollerVerticalPositionSlider />
                        <S.ArtScrollerHorizontalPositionSliderLabel />
                        <S.ArtScrollerHorizontalPositionSlider />
                        <S.ArtScrollerInvertColorsSliderLabel />
                        <S.ArtScrollerInvertColorsSlider />
                        <S.ArtScrollerSpeedSliderLabel />
                        <S.ArtScrollerSpeedSlider />
                    </S.ArtScrollerSliderContainer>
                    {/* gifs */}
                    <S.ArtScrollerGifs />
                </S.ArtScrollerSection>
            </S.ArtScrollerMainContainer>
        </>
    );
};

export { ArtScroller };
