import React, { useEffect, useState } from "react";

// AUDIO PLAYER
import AudioPlayer from "react-h5-audio-player";
import "react-h5-audio-player/lib/styles.css";

// SONGS
import G6 from "./music/G6_-24_db_for_web_test.m4a";
// import REVERB_STUDY from "./music/175-Reverb-study.m4a";

// TEXT ANIMATIONS
import "./aux-styles/trackAnimStyles.css";
import { PlayButtonSvg } from "./PlayButtonSvg";
import styled from "styled-components";

export interface NewAudioPlayerProps {
    [key: string]: any;
}

const AudioPlayerComponent: React.FC = (): JSX.Element => {
    const [currentSong, setCurrentSong] = useState(G6);

    // ARRAY OF LOCAL SONG FILE PATHS
    const songs = [
        {
            trackName: "g6",
            filePath: G6,
        },
        // {
        //   trackName: "ReverbStudy",
        //   filePath: REVERB_STUDY
        // },
        // {
        //   trackName: 'Waterfalls',
        //   filePath: WATERFALLS
        // },
    ];

    const trackListStyle = {
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

    const trackListStylePlaying = {
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

    // eslint-disable-next-line
    function handleTrackChange(event: any): void {
        if (event.target.id !== currentSong) {
            setCurrentSong(event.target.id);
        }
    }

    // volume slider state
    const [volumeState, setVolumeState] = useState(0);
    // eslint-disable-next-line
    function handleVolumeChange(event: any, data: number) {
        setVolumeState(event.target.value || data);
    }

    const sliderContainerStyle = {
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
    };

    const labelStyle = {
        color: "white",
    };

    const StyledPlayButtonSVGContainer = styled.div`
        & {
            /* position: relative; */
            margin: 0 auto;
        }
    `;

    const NewAudioPlayer: React.FC<NewAudioPlayerProps> = (props) => {
        useEffect(() => {
            console.log("MOUNTED NEW PLAYUER");
        });
        return (
            <StyledPlayButtonSVGContainer>
                <PlayButtonSvg fill={"green"} height={100} width={100} />
            </StyledPlayButtonSVGContainer>
        );
    };

    return (
        <div>
            <div style={{ display: "flex", height: 100, width: "100%", background: "white" }}>
                <NewAudioPlayer />
            </div>
            <AudioPlayer
                autoPlay={false}
                preload="auto"
                src={currentSong}
                volume={volumeState}
                onVolumeChange={(event: any) => {
                    handleVolumeChange(event, event.target.volume);
                    setVolumeState(event.target.volume);
                }}
            />
            {/* @ts-expect-error not sure why its incompatible? */}
            <div style={sliderContainerStyle}>
                <label htmlFor="player-volume" style={labelStyle}>
                    Music Player Volume: {volumeState}
                </label>
            </div>
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

export default AudioPlayerComponent;
