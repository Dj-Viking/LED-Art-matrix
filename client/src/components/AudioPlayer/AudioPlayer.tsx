/* eslint-disable @typescript-eslint/no-non-null-assertion */
/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useState } from "react";

// SONGS
import G6 from "../music/G6_-24_db_for_web_test.m4a";
import REVERB_STUDY from "../music/175-Reverb-study.m4a";

// TEXT ANIMATIONS
import "../aux-styles/trackAnimStyles.css";
import {
    AudioPlayerRangeInput,
    AudioRangeInputContainer,
    AudioRangeInputVolumeText,
    PauseButtonFill,
    PlayPauseControl,
    StyledAudioPlayerContainer,
    TrackList,
} from "./AudioPlayer.style";
import { TransportProgress } from "./TransportProgress";

export interface NewAudioPlayerProps {
    currentSong: string;
    audioRef: React.RefObject<HTMLAudioElement>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}
export type Track = {
    trackName: string;
    filePath: string;
};

const controlBackgroundColor = "grey";

const NewAudioPlayer: React.FC<NewAudioPlayerProps> = (props) => {
    const { currentSong, audioRef: audioElRef, isPlaying, setIsPlaying } = props;
    const [volumeState, setVolumeState] = useState(0);

    const handleVolumeInput = React.useCallback<React.FormEventHandler<HTMLInputElement>>(
        (event) => {
            //
            if (audioElRef.current) {
                const audio = audioElRef.current;

                audio.volume = event.target.value;
                setVolumeState(event.target.value);
            }
        },
        [audioElRef]
    );

    const pauseButtonFill: PauseButtonFill = {
        button: "green",
        pauseBars: controlBackgroundColor,
    };

    return (
        <>
            <StyledAudioPlayerContainer>
                <div style={{ display: "flex", flexDirection: "row", alignItems: "center", width: "100%" }}>
                    <PlayPauseControl
                        playButtonFill={"green"}
                        pauseButtonFill={pauseButtonFill}
                        playButtonHeight={100}
                        pauseButtonHeight={100}
                        playButtonWidth={100}
                        pauseButtonWidth={100}
                        isPlaying={isPlaying}
                        setIsPlaying={setIsPlaying}
                        audioRef={audioElRef}
                    />
                    <TransportProgress audioRef={audioElRef} />
                </div>
                <AudioRangeInputContainer>
                    <AudioPlayerRangeInput handleInput={handleVolumeInput} />
                    <AudioRangeInputVolumeText volumeState={volumeState} />
                </AudioRangeInputContainer>
                <audio autoPlay={false} src={currentSong} ref={audioElRef} />
            </StyledAudioPlayerContainer>
        </>
    );
};

const AudioPlayerComponent: React.FC = (): JSX.Element => {
    const [currentSong, setCurrentSong] = useState(G6);
    const [isPlaying, setIsPlaying] = useState(false);
    const audioElRef = React.useRef<HTMLAudioElement>(null);

    // ARRAY OF LOCAL SONG FILE PATHS
    const songs: Track[] = [
        {
            trackName: "g6",
            filePath: G6,
        },
        {
            trackName: "ReverbStudy",
            filePath: REVERB_STUDY,
        },
        // {
        //   trackName: 'Waterfalls',
        //   filePath: WATERFALLS
        // },
    ];

    return (
        <>
            <div
                style={{
                    display: "flex",
                    height: 150,
                    width: "100%",
                    background: controlBackgroundColor,
                    justifyContent: "center",
                }}
            >
                <NewAudioPlayer
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    currentSong={currentSong}
                    audioRef={audioElRef}
                />
            </div>
            <TrackList
                isPlaying={isPlaying}
                setIsPlaying={setIsPlaying}
                audioRef={audioElRef}
                setCurrentSong={setCurrentSong}
                currentSong={currentSong}
                songs={songs}
            />
        </>
    );
};

export default AudioPlayerComponent;
