import React from 'react';

//components
import AudioPlayer from '../components/AudioPlayer';
import BigLedBox from '../components/BigLedBox';
import Nav from '../components/Nav';

//audio player and big led box
const Home = () => {
  return (
    <>
      <Nav />
      <AudioPlayer />
      <BigLedBox />
    </>
  );
};

export default Home;