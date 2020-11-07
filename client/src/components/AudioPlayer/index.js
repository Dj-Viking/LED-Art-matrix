import React, {useState} from 'react';
import AudioPlayer from 'react-h5-audio-player';
import 'react-h5-audio-player/lib/styles.css';
import Waterfalls from './music/128-Waterfalls.m4a';
import ReverbStudy from './music/175-Reverb-study.m4a';



function AudioPlayer_Component() {
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

  function songSelect(event) {
    event.preventDefault();
    event.persist();
    setCurrentSong(event.target.href);
    console.log(event.target.href);
  }

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
      <ul>
        {
          songs.map((song, index) => (
            <>
              <li
                style={trackListStyle}
                id={Waterfalls}
                key={index}
                onClick={handleTrackChange}
              >
                {song.trackName}
              </li>
            </>
          ))
        }
      </ul>
      <audio 
        src={currentSong}
        
      />
    </>
  );
};

export default AudioPlayer_Component;