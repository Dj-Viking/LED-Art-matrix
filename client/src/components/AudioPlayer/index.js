import React, {useState} from 'react';

//AUDIO PLAYER
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';

//SONGS
import Waterfalls from './music/128-Waterfalls.m4a';
import ReverbStudy from './music/175-Reverb-study.m4a';

//TEXT ANIMATIONS
import './trackAnimStyles.css';


function AudioPlayerComponent() {
  const [currentSong, setCurrentSong] = useState(ReverbStudy)

  //ARRAY OF LOCAL SONG FILE PATHS 
  const songs = [
    {
      trackName: 'ReverbStudy',
      filePath: ReverbStudy
    },
    {
      trackName: 'Waterfalls',
      filePath: Waterfalls
    },
  ];

  const trackListStyle = {
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer',
    listStyle: 'none',
    display: 'inline',
    marginBottom: '10px',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px 20px',
    justifyContent: 'center',
    transition: '1s',
    borderRadius: '10px',
  }

  const trackListStylePlaying = {
    textShadow: '3px 3px 3px black',
    borderRadius: '10px',
    backgroundColor: 'blue',
    cursor: 'pointer',
    marginLeft: 'auto',
    marginRight: 'auto',
    padding: '10px 20px',
    listStyle: 'none',
    display: 'inline',
    marginBottom: '10px',
    justifyContent: 'center',
    transition: '1s',
    border: '3px ridge blue'
  }

  function handleTrackChange(event) {
    if (event.target.id !== currentSong) {
      setCurrentSong(event.target.id)
    } else {
      return;
    }
  }

  //volume slider state
  const [volumeState, setVolumeState] = useState(0.005);
  function handleVolumeChange(event, data) {
    setVolumeState(event.target.value || data)
  }

  // .slider-style {
  //   width: 70%;
  //   margin: 0 auto;
  // }
  // const sliderStyle = {
  //   width: '70%',
  //   margin: '0 auto'
  // };

  // .slider-container {
  //   display: flex;
  //   flex-direction: column;
  //   justify-content: center;
  // }
  const sliderContainerStyle = {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center'
  };

  const labelStyle = {
    color: 'white'
  }
  
  return (
    <>
      <AudioPlayer
        autoPlay={true}
        preload="auto"
        src={currentSong}
        onPlay={e => console.log("onPlay")}
        volume={volumeState}
        onVolumeChange={(event) => {
          handleVolumeChange(event, event.target.volume);
          setVolumeState(event.target.volume);
        }}
      />
      <div style={sliderContainerStyle}>
        <label
          htmlFor="player-volume"
          style={labelStyle}
        >
          Music Player Volume: {volumeState}
        </label>
        {/* <input
          name="player-volume"
          type="range"
          min="0"
          max="1000"
          value={volumeState}
          onChange={handleVolumeChange}
          style={sliderStyle}
        ></input> */}
      </div>
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          marginTop: '10px'
        }}
      >
        <div
          style={{
            borderTop: 'ridge 5px rgb(67, 26, 163)',
            width: '80%',
            borderRadius: '50%',
            display: 'flex',
            margin: '0 auto',
          }}
        ></div>
        <span
          style={{
            borderRadius: '50%',
            width: '80%',
            display: 'flex',
            justifyContent: 'center',
            margin: '0 auto',
            marginTop: '5px',
            marginBottom: '5px',
            color: 'white'
          }}
        >
          Track List
        </span>
        {
          songs.map((song) => (
            <div
              style={
                currentSong === song.filePath 
                ? trackListStylePlaying 
                : trackListStyle
              }
              className={
                currentSong === song.filePath
                ? 'anim-playing-text'
                : ''
              }
              id={song.filePath}
              key={song.trackName}
              onClick={handleTrackChange}
            >
              {song.trackName}
            </div>
          ))
        }
      </section>
    </>
  );
};

export default AudioPlayerComponent;