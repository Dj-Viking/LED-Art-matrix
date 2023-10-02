import React, { useState } from "react";

// AUDIO PLAYER
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

    const StyledAudioPlayerContainer = styled.div`
        & {
            margin: 0 auto;
        }
    `;

    const NewAudioPlayer: React.FC<NewAudioPlayerProps> = (_props) => {
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
                    <PlayButtonSvg audioRef={audioElRef} fill={"green"} height={100} width={100} />
                    <div style={{ display: "flex", justifyContent: "center", flexDirection: "column" }}>
                        <input
                            id="volume-input"
                            name="volume"
                            type="range"
                            min="0"
                            max="1"
                            step="0.1"
                            onInput={handleVolumeInput}
                        />
                        <span style={{ margin: "0 auto" }}>Volume: {volumeState}</span>
                    </div>

                    <audio
                        autoPlay={false}
                        // style={{ display: "none" }}
                        src={currentSong}
                        ref={audioElRef}
                    />
                </StyledAudioPlayerContainer>
            </>
        );
    };

    return (
        <>
            <div style={{ display: "flex", height: 150, width: "100%", background: "grey", justifyContent: "center" }}>
                <NewAudioPlayer />
            </div>
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
        </>
    );
};

export default AudioPlayerComponent;
