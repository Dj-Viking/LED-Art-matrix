import React, { useState } from "react";

// SONGS
import G6 from "./music/G6_-24_db_for_web_test.m4a";
import REVERB_STUDY from "./music/175-Reverb-study.m4a";

// TEXT ANIMATIONS
import "./aux-styles/trackAnimStyles.css";
import { PlayButtonSvg } from "./PlayButtonSvg";
import {
    AudioPlayerRangeInput,
    AudioRangeInputContainer,
    AudioRangeInputVolumeText,
    StyledAudioPlayerContainer,
    TrackList,
} from "./AudioPlayer.style";

export interface NewAudioPlayerProps {
    currentTrack: Track;
}
export type Track = {
    trackName: string;
    filePath: string;
};

// ARRAY OF LOCAL SONG FILE PATHS
export const tracks: Track[] = [
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

export const NewAudioPlayer: React.FC<NewAudioPlayerProps> = (props) => {
    const { currentTrack } = props;
    const audioElRef = React.useRef<HTMLAudioElement>(null);
    const [volumeState, setVolumeState] = useState(0);
    const handleVolumeInput = React.useCallback<React.FormEventHandler<HTMLInputElement>>((event) => {
        //
        if (audioElRef.current) {
            const audio = audioElRef.current;

            audio.volume = event.target.value;
            setVolumeState(event.target.value);
        }
    }, []);

    return (
        <>
            <StyledAudioPlayerContainer>
                <PlayButtonSvg currentTrack={currentTrack} audioRef={audioElRef} fill={"green"} height={100} width={100} />
                <AudioRangeInputContainer>
                    <AudioPlayerRangeInput handleInput={handleVolumeInput} />
                    <AudioRangeInputVolumeText volumeState={volumeState} />
                </AudioRangeInputContainer>

                <audio autoPlay={false} src={currentTrack.filePath} ref={audioElRef} />
            </StyledAudioPlayerContainer>
        </>
    );
};
const AudioPlayerComponent: React.FC = (): JSX.Element => {
    const [_currentTrack, _setCurrentTrack] = useState<Track>(tracks[0]);

    return (
        <>
            <div style={{ display: "flex", height: 150, width: "100%", background: "grey", justifyContent: "center" }}>
                <NewAudioPlayer currentTrack={_currentTrack}/>
            </div>
            <TrackList setCurrentTrack={(track) => {
                _setCurrentTrack(track);
            }} currentTrack={_currentTrack} tracks={tracks} />
        </>
    );
};

export default AudioPlayerComponent;
