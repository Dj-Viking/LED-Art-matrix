import React from 'react';

//components
import AudioPlayerComponent from '../components/AudioPlayer';
import BigLedBox from '../components/BigLedBox';

//audio player and big led box
const Home = () => {
  return (
    <> 
      <h1 style={{color: "red"}}>This site is under intense maintenance, we should be up and running in a day or so</h1>
      <AudioPlayerComponent />
      <BigLedBox />
    </>
  );
};

export default Home;