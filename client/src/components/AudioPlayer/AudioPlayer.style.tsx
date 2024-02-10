import React from "react";
import styled from "styled-components";
import { Track } from "./AudioPlayer";
import { PauseButtonSvg } from "./PauseButtonSvg";
import { PlayButtonSvg } from "./PlayButtonSvg";

export const StyledAudioPlayerContainer = styled.div`
    & {
        margin: 0 auto;
        width: 49%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
    }
`;

export type FillType = "black" | "white" | "green" | "grey";
export type PauseButtonFill = Record<"button" | "pauseBars", FillType>;

export interface PlayPauseButtonControlProps {
    height: number;
    width: number;
    fill: PauseButtonFill | FillType;
    audioRef: React.RefObject<HTMLAudioElement>;
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
}

export interface PlayPauseControlProps extends Omit<PlayPauseButtonControlProps, "width" | "height" | "fill"> {
    playButtonFill: FillType;
    pauseButtonFill: PauseButtonFill;
    playButtonHeight: number;
    pauseButtonHeight: number;
    playButtonWidth: number;
    pauseButtonWidth: number;
}
export const PlayPauseControl: React.FC<PlayPauseControlProps> = (props) => {
    const {
        isPlaying,
        setIsPlaying,
        audioRef,
        playButtonFill,
        pauseButtonFill,
        playButtonHeight,
        pauseButtonHeight,
        playButtonWidth,
        pauseButtonWidth,
    } = props;
    return (
        <>
            {!isPlaying ? (
                <PlayButtonSvg
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    audioRef={audioRef}
                    fill={playButtonFill}
                    height={playButtonHeight}
                    width={playButtonWidth}
                />
            ) : (
                <PauseButtonSvg
                    fill={pauseButtonFill}
                    isPlaying={isPlaying}
                    setIsPlaying={setIsPlaying}
                    audioRef={audioRef}
                    height={pauseButtonHeight}
                    width={pauseButtonWidth}
                />
            )}
        </>
    );
};

export const trackListStyle = {
    textDecoration: "none",
    color: "white",
    cursor: "pointer",
    listStyle: "none",
    display: "inline",
    marginBottom: "10px",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "10px 20px",
    justifyContent: "center",
    transition: "1s",
    borderRadius: "10px",
};

export const trackListStylePlaying = {
    textShadow: "3px 3px 3px black",
    borderRadius: "10px",
    backgroundColor: "blue",
    cursor: "pointer",
    marginLeft: "auto",
    marginRight: "auto",
    padding: "10px 20px",
    listStyle: "none",
    display: "inline",
    marginBottom: "10px",
    justifyContent: "center",
    transition: "1s",
    border: "3px ridge blue",
};

export const AudioRangeInputContainer: React.FC = (props) => {
    return <div style={{ display: "flex", flexDirection: "column", width: "50%" }}>{props.children}</div>;
};

export const AudioRangeInputVolumeText: React.FC<{ volumeState: number }> = (props) => {
    return <span style={{ marginLeft: "10%" }}>Volume: {props.volumeState}</span>;
};

export interface AudioPlayerRangeInputProps extends React.DOMAttributes<HTMLInputElement> {
    handleInput: React.FormEventHandler<HTMLInputElement>;
}

export const AudioPlayerRangeInput: React.FC<AudioPlayerRangeInputProps> = (props) => {
    return (
        <input id="volume-input" name="volume" type="range" min="0" max="1" step="0.01" onInput={props.handleInput} />
    );
};

export interface TrackListProps {
    isPlaying: boolean;
    setIsPlaying: React.Dispatch<React.SetStateAction<boolean>>;
    songs: Track[];
    currentSong: string;
    audioRef: React.RefObject<HTMLAudioElement>;
    setCurrentSong: React.Dispatch<React.SetStateAction<string>>;
}

export const TrackList: React.FC<TrackListProps> = (props) => {
    const { setCurrentSong, songs, currentSong, audioRef, isPlaying, setIsPlaying } = props;
    // have to do some set timeout shit because of weird browser event loop bullshit
    // otherwise it will try to play a track before it's fully loaded into the audio ref element
    // i guess. (shrugs)
    const handleTrackChange = React.useCallback<React.MouseEventHandler<HTMLDivElement>>(
        (event) => {
            (async () => {
                if (audioRef.current) {
                    if (event.target.id !== currentSong) {
                        if (isPlaying) {
                            audioRef.current?.pause();
                            setIsPlaying(false);
                            setCurrentSong(event.target.id);
                            setTimeout(async () => {
                                await audioRef.current?.play();
                                setIsPlaying(true);
                            }, 100);
                        } else {
                            setCurrentSong(event.target.id);
                            setTimeout(async () => {
                                await audioRef.current?.play();
                                setIsPlaying(true);
                            }, 100);
                        }
                    }
                }
            })();
        },
        [currentSong, setCurrentSong, audioRef, isPlaying, setIsPlaying]
    );
    return (
        <div>
            <section
                style={{
                    display: "flex",
                    flexDirection: "column",
                    textAlign: "center",
                    marginTop: "10px",
                }}
            >
                <div
                    style={{
                        borderTop: "ridge 5px rgb(67, 26, 163)",
                        width: "80%",
                        borderRadius: "50%",
                        display: "flex",
                        margin: "0 auto",
                    }}
                />
                <span
                    style={{
                        borderRadius: "50%",
                        width: "80%",
                        display: "flex",
                        justifyContent: "center",
                        margin: "0 auto",
                        marginTop: "5px",
                        marginBottom: "5px",
                        color: "white",
                    }}
                >
                    Track List
                </span>
                {songs.map((song) => (
                    <div
                        style={currentSong === song.filePath ? trackListStylePlaying : trackListStyle}
                        className={currentSong === song.filePath ? "anim-playing-text" : ""}
                        id={song.filePath}
                        key={song.trackName}
                        onClick={handleTrackChange}
                    >
                        {song.trackName}
                    </div>
                ))}
            </section>
        </div>
    );
};
