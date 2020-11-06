import React from 'react';

//components
import AudioPlayer from '../components/AudioPlayer';
import BigLedBox from '../components/BigLedBox';
import SplashHeader from '../components/SplashHeader';

//audio player and big led box
const Home = () => {
  return (
    <>
      <AudioPlayer />
      <BigLedBox />
    </>
  );
};

export default Home;