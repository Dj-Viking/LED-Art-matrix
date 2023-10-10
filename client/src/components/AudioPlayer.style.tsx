import React from "react";
import styled from "styled-components";
import { Track } from "./AudioPlayer";

export const StyledAudioPlayerContainer = styled.div`
    & {
        margin: 0 auto;
    }
`;

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
    return <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>{props.children}</div>;
};

export const AudioRangeInputVolumeText: React.FC<{ volumeState: number }> = (props) => {
    return <span style={{ margin: "0 auto" }}>Volume: {props.volumeState}</span>;
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
    tracks: Track[];
    currentTrack: Track;
    setCurrentTrack: React.Dispatch<React.SetStateAction<Track>>;
}

export const TrackList: React.FC<TrackListProps> = (props) => {
    const { tracks, currentTrack, setCurrentTrack } = props;
    // eslint-disable-next-line
    const handleTrackChange = React.useCallback<React.MouseEventHandler<HTMLDivElement>>((event) => {
        if (event.target.id !== currentTrack.trackName) {
            setCurrentTrack(tracks.find(track => track.filePath === event.target.id) || { filePath: "", "trackName": "nothing" } );
        }
    }, [currentTrack, setCurrentTrack, tracks]);
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
                {tracks.map((song) => (
                    <div
                        style={currentTrack.filePath === song.filePath ? trackListStylePlaying : trackListStyle}
                        className={currentTrack.filePath === song.filePath ? "anim-playing-text" : ""}
                        id={song.filePath}
                        key={song.filePath}
                        onClick={handleTrackChange}
                    >
                        {song.trackName}
                    </div>
                ))}
            </section>
        </div>
    );
};
