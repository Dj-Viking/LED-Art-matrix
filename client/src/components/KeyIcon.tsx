import React from "react";

import { 
  AKeySvg, 
  DKeySvg, 
  EKeySvg, 
  FKeySvg, 
  FourKeySvg, 
  OneKeySvg, 
  QKeySvg, 
  RKeySvg, 
  SKeySvg, 
  ThreeKeySvg, 
  TwoKeySvg, 
  WKeySvg 
} from "../lib/keySvgs";
  
interface KeyIconProps {
  type: string
}

const KeyIcon: React.FC<KeyIconProps> = ({ type }): JSX.Element => {

  // @ts-ignore 
  function renderIcon(T: KeyIconProps["type"]): JSX.Element | void {
    switch(T) {
      case "1": return <OneKeySvg />;
      case "2": return <TwoKeySvg />;
      case "3": return <ThreeKeySvg />;
      case "4": return <FourKeySvg />;
      case "q": return <QKeySvg />;
      case "w": return <WKeySvg />;
      case "e": return <EKeySvg />;
      case "r": return <RKeySvg />;
      case "a": return <AKeySvg />;
      case "s": return <SKeySvg />;
      case "d": return <DKeySvg />;
      case "f": return <FKeySvg />;
    }
  }
  return (
    <>
      {renderIcon(type)}
    </>
  );
};

export { KeyIcon };