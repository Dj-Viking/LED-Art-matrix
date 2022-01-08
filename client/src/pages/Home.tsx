// @ts-expect-error need react in scope for JSX
import React from "react";

// components
import AudioPlayerComponent from "../components/AudioPlayer";
import BigLedBox from "../components/BigLedBox";

// audio player and big led box
const Home = (): JSX.Element => (
  <> 
    <AudioPlayerComponent />
    <BigLedBox />
  </>
);

export default Home;
