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

export interface NewAudioPlayerProps {
    [key: string]: any;
}
export type Track = {
    trackName: string;
    filePath: string;
};

const controlBackgroundColor = "grey";

const AudioPlayerComponent: React.FC = (): JSX.Element => {
    const [currentSong, setCurrentSong] = useState(G6);

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

    const NewAudioPlayer: React.FC<NewAudioPlayerProps> = (_props) => {
        const audioElRef = React.useRef<HTMLAudioElement>(null);
        const [volumeState, setVolumeState] = useState(0);
        const [isPlaying, setIsPlaying] = useState(false);
        const handleVolumeInput = React.useCallback<React.FormEventHandler<HTMLInputElement>>((event) => {
            //
            if (audioElRef.current) {
                const audio = audioElRef.current;

                audio.volume = event.target.value;
                setVolumeState(event.target.value);
            }
        }, []);

        const pauseButtonFill: PauseButtonFill = {
            button: "green",
            pauseBars: controlBackgroundColor,
        };

        return (
            <>
                <StyledAudioPlayerContainer>
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
                    <AudioRangeInputContainer>
                        <AudioPlayerRangeInput handleInput={handleVolumeInput} />
                        <AudioRangeInputVolumeText volumeState={volumeState} />
                    </AudioRangeInputContainer>

                    <audio autoPlay={false} src={currentSong} ref={audioElRef} />
                </StyledAudioPlayerContainer>
            </>
        );
    };

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
                <NewAudioPlayer />
            </div>
            <TrackList setCurrentSong={setCurrentSong} currentSong={currentSong} songs={songs} />
        </>
    );
};

export default AudioPlayerComponent;
