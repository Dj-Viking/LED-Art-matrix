import React, {useState} from 'react';



function AudioPlayer() {
  const [currentSong, setCurrentSong] = useState('./music/128-waterfall.m4a')

  function songSelect(event) {
    event.preventDefault();
    event.persist();
    setCurrentSong(event.target.href);
    console.log(event.target.parentElement.parentElement.parentElement.firstChild.play)
    //event.target.parentElement.parentElement.parentElement.firstChild.play();
    // console.log(event.target.parentElement.parentElement.parentElement.firstChild.play());
    console.log(event.target.href);
  }
  let reactAudioPlayer;
  return (
    <>
      <audio 
        src={currentSong}
        controls
        autoPlay={true}
        ref={(element) => reactAudioPlayer = element}
        onClick={
          () => {
            console.log(reactAudioPlayer)
          }
        }
      >

      </audio>
      <ul id="playlist">
        <li className="current-song">
            <a
              href="./music/128-waterfall.m4a"
              onClick={songSelect}
            >
              1
            </a>
        </li>
        <li className="">
            <a
              href="./music/Faxing-Zagreb.m4a" 
              onClick={songSelect}
            >
              2
            </a>
        </li>
      </ul>
    </>
  );
};

export default AudioPlayer;