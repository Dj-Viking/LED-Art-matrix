import React, {useState} from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Waterfalls from './music/128-Waterfalls.m4a';
import ReverbStudy from './music/175-Reverb-study.m4a';



function AudioPlayerComponent() {
  const [currentSong, setCurrentSong] = useState(ReverbStudy)

  //ARRAY OF LOCAL SONG FILE PATHS 
  const songs = [
    {
      trackName: 'Waterfalls',
      filePath: Waterfalls
    },
    {
      trackName: 'ReverbStudy',
      filePath: ReverbStudy
    }
  ];

  const trackListStyle = {
    textDecoration: 'none',
    color: 'white',
    cursor: 'pointer',
    listStyle: 'none'
  }

  function handleTrackChange(event) {
    if (event.target.id !== currentSong) {
      setCurrentSong(event.target.id)
    } else {
      return;
    }
  }
  
  return (
    <>
      <AudioPlayer
        autoPlay={true}
        preload="auto"
        src={currentSong}
        onPlay={e => console.log("onPlay")}
        volume={.04}
      />
      <section
        style={{
          display: 'flex',
          flexDirection: 'column',
          textAlign: 'center',
          marginTop: '30px'
        }}
      >
      {
        songs.map((song) => (
          <div
            style={trackListStyle}
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