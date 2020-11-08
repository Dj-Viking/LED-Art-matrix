import React from 'react';

//components
import AudioPlayerComponent from '../components/AudioPlayer';
import BigLedBox from '../components/BigLedBox';
import ArtScroller from '../components/ArtScroller';

//audio player and big led box
const Home = () => {
  return (
    <>
      <ArtScroller />
      <AudioPlayerComponent />
      <BigLedBox />
    </>
  );
};

export default Home;