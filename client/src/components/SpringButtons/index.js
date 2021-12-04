import { config } from "react-spring";
export const _rainbowButtonSpring = {
  delay: 1000,
  from: {
    opacity: 0,
  },
  to: {
    opacity: 1,
  }
};

export const _V2ButtonSpring = {
  delay: 1300,
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};

export const _wavesButtonSpring = {
  delay: 1500,
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};

export const _spiralButtonSpring = {
  delay: 1700,
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};

export const _fourSpiralsButtonSpring = {
  delay: 2000,
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};

export const _saveButtonSpring = {
  delay: 2300,
  from: {
    opacity: 0
  },
  to: {
    opacity: 1
  }
};

//init button spring
export const _leftInitButtonSpring = {
  config: config.wobbly,
  delay: 100,
  from: {
    opacity: 0,
    marginRight: '1000px' 
  },
  to: {
    opacity: 1,
    marginRight: '5px'
  }
};

//scroller on/off button spring
export const _scrollerOnOffButtonSpring = {
  config: config.wobbly,
  delay: 100,
  from :{
    opacity: 0
  },
  to: {
    opacity: 1
  }
};