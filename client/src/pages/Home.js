import React from 'react';

//components
import AudioPlayerComponent from '../components/AudioPlayer';
import BigLedBox from '../components/BigLedBox';

//audio player and big led box
const Home = () => {
  return (
    <> 
      <AudioPlayerComponent />
      <BigLedBox />
    </>
  );
};

export default Home;