import jwt from "jsonwebtoken";
import { keyGen } from "./keyGen";
import { MIDIConnectionEvent, MIDIInput, MIDIMessageEvent, MIDIOutput, MIDIPortConnectionState, MIDIPortDeviceState, MIDIPortType } from "./MIDIControlClass";
const uuid = require("uuid");

export const SAVE_DEFAULT_MOCK_SUCCESS = {
  preset: {
    presetName: "new preset yo",
    animVarCoeff: "74",
  },
};
export const SAVE_DEFAULT_MOCK_ERROR = {
  error: "ERROR"
};
export const MOCK_SIGN_TOKEN_ARGS = {
  username: "test user",
  email: "test email",
  uuid: uuid.v4(),
  _id: keyGen(),
};
export const MOCK_PRESETS = [
  { displayName: "", presetName: "rainbowTest", animVarCoeff: "64", _id: "6200149468fe291e26584e4b" },
  { displayName: "", presetName: "v2", animVarCoeff: "64", _id: "6200149468fe291e26584e4c" },
  { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" },
  { displayName: "", presetName: "spiral", animVarCoeff: "64", _id: "6200149468fe291e26584e4e" },
  { displayName: "", presetName: "fourSpirals", animVarCoeff: "64", _id: "6200149468fe291e26584e4f" },
  { displayName: "", presetName: "dm5", animVarCoeff: "64", _id: "6200149468fe291e26584e50" },
  { displayName: "bogus", presetName: "bogus", animVarCoeff: "64", _id: "6200149468fe291e26584e51" },
  { displayName: "bogus1", presetName: "bogus1", animVarCoeff: "64", _id: "6200149468fe291e26584eaf" },
  { displayName: "bogus2", presetName: "bogus2", animVarCoeff: "64", _id: "6200149468fe291e26584e14" },
  { displayName: "bogus3", presetName: "bogus3", animVarCoeff: "64", _id: "6200149468fe291e26584e15" },
  { displayName: "bogus4", presetName: "bogus4", animVarCoeff: "64", _id: "6200149468fe291e26584e16" },
  { displayName: "bogus5", presetName: "bogus5", animVarCoeff: "64", _id: "6200149468fe291e26584e17" },
];
export const MOCK_ADD_PRESET_RES = [
  { displayName: "", presetName: "rainbowTest", animVarCoeff: "64", _id: "6200149468fe291e26584e4b" },
  { displayName: "", presetName: "v2", animVarCoeff: "64", _id: "6200149468fe291e26584e4c" },
  { displayName: "", presetName: "waves", animVarCoeff: "64", _id: "6200149468fe291e26584e4d" },
  { displayName: "", presetName: "spiral", animVarCoeff: "64", _id: "6200149468fe291e26584e4e" },
  { displayName: "", presetName: "fourSpirals", animVarCoeff: "64", _id: "6200149468fe291e26584e4f" },
  { displayName: "", presetName: "dm5", animVarCoeff: "64", _id: "6200149468fe291e26584e50" },
  { displayName: "bogus", presetName: "bogus", animVarCoeff: "64", _id: "6200149468fe291e26584e51" },
  { displayName: "new preset", presetName: "new preset", animVarCoeff: "64", _id: "6200149468fe291e26584e53" },
];


export const ASSERT_ANIMATION = {
  clearLed: "led1-1",
  keyframes: new RegExp("keyframes", "g"),
  durationStyleRegex: new RegExp("animation-duration: ([0-9.s])+"),
  delayStyleRegex: new RegExp("animation-delay: ([0-9.s])+"),
  rainbowTest: {
    regex: new RegExp("rainbowTest", "g"),
    classListItem: "led1-1rainbowTest",
  },
  v2: {
    regex: new RegExp("v2", "g"),
    classListItem: "led1-1v2",
  },
  waves: {
    regex: new RegExp("waves", "g"),
    classListItem: "led1-1waves",

  },
  spiral: {
    regex: new RegExp("spiral", "g"),
    classListItem: "led1-1spiral"
  },
  fourSpirals: {
    regex: new RegExp("fourSpirals", "g"),
    classListItem: "led1-1fourSpirals"
  },
  dm5: {
    regex: new RegExp("dm5", "g"),
    classListItem: "led1-1dm5"
  },
};

export const CHANGE_PASS_MOCK_RES = {
  message: "success",
  done: true,
  token: "HERES A TOKEN YAY"
};

export const CHANGE_PASS_INPUT_MATCH = {
  newPass: "newer password",
  confirmPass: "newer password"
};
export const CHANGE_PASS_INPUT_NOT_MATCH = {
  newPass: "newer password",
  confirmPass: "newer password1"
};

export const LOGIN_MOCK_PAYLOAD_USERNAME = {
  emailOrUsername: "i exist",
  password: "believe it"
};

export const LOGIN_MOCK_PAYLOAD_EMAIL = {
  emailOrUsername: "iexist@exist.com",
  password: "believe it"
};
export const EXPIRED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzb21lVXVpZCI6IjcxNmYzMzJlLTMxODQtNDJmMC04Y2I3LTRjOWNlNmJmODdkOCIsInVzZXJuYW1lIjoidGVzdC11c2VyIiwiZW1haWwiOiJ0ZXN0QGVtYWlsLmNvbSIsIl9pZCI6IjYxZTIxMzgwNTdjOTc4NGYyNDllNjIzNSIsImlhdCI6MTY0MjIwNjA4MCwiZXhwIjoxNjQyMjA5NjgwfQ.kShMP7vYDqYvw-raT1WUq1_XVD4LgU9YsJBZ_8qAqpM";

export const LOGIN_MOCK_RESPONSE = {
  _id: "kdjfkdfj",
  token: "dkfdkj",
  defaultPreset: "waves"
};

export const LOGIN_MOCK_ERROR_CODE = {
  status: 400,
  error: new Error("Invalid credentials")
};

export const LOGIN_MOCK_NO_TOKEN = {
  user: {
    token: void 0,
    _id: "weeeeeeeee"
  }
};


// TODO: sign a new token!!
export const LOGIN_MOCK_TOKEN = {
  user: {
    token: jwt.sign({
      username: "weeeee",
      _id: "weeeeeee",
    }, "SECRET!!!!", { expiresIn: "1h" }),
    _id: "weeeeeeeee"
  }
};

export const FORGOT_MOCK_INPUT = {
  email: "test@email.com"
};

export const FORGOT_MOCK_RES = {
  message: "success"
};

export const FORGOT_MOCK_RES_ERROR = {
  status: 500,
};

export const SIGNUP_MOCK_ERROR = {};

export const SIGNUP_MOCK_PAYLOAD_SAME_USER = {
  username: "test user",
  email: "testemail@email.com",
  password: "test password",
};

export const SIGNUP_MOCK_PAYLOAD = {
  username: "test user" + Date.now(),
  email: "testemail" + Date.now() + "@email.com",
  password: "test password" + Date.now(),
};

export const SIGNUP_MOCK_RESULT = {
  token: jwt.sign({
    username: "weeeee",
    _id: "weeeeeee",
  }, "SECRET!!!!", { expiresIn: "1h" }),
  _id: "heres an id"
};

export function makeFakeMIDIOutputs(): Map<MIDIOutput["id"], MIDIOutput> {
  const newMap = new Map<MIDIOutput["id"], MIDIOutput>();
  const _onstatechangecb = function (connection_event: MIDIConnectionEvent): void {
    console.log("output connection event test", connection_event);
  };
  const _onmidicb = function (midi_event: MIDIMessageEvent): void {
    console.log("output midi_event data test", midi_event.data);
  };

  for (let i = 0; i < 3; i++) {
    newMap?.set(i.toString(), {
      id: i.toString(),
      state: MIDIPortDeviceState.connected,
      name: "kdjfkjdj",
      type: MIDIPortType.output,
      version: "kdfkjdj",
      connection: MIDIPortConnectionState.closed,
      onstatechange: _onstatechangecb,
      onmidimessage: _onmidicb
    } as MIDIOutput);
  }
  return newMap;
}

export function makeFakeMIDIInputs(): Map<MIDIInput["id"], MIDIInput> {
  const newMap = new Map<MIDIInput["id"], MIDIInput>();
  const _onmidicb = (midi_event: MIDIMessageEvent): void => {
    console.log("midi input event data test", midi_event.data);
  };
  const _onstatechangecb = (connection_event: MIDIConnectionEvent): void => {
    console.log("midi input connection event test", connection_event);
  };

  for (let i = 0; i < 3; i++) {
    newMap?.set(i.toString(), {
      id: i.toString(),
      manufacturer: "holy bajeebus i am fake " + i,
      name: "XONE:K2 MIDI",
      type: MIDIPortType.input,
      version: "over 9000",
      state: MIDIPortDeviceState.connected,
      connection: MIDIPortConnectionState.closed,
      onmidimessage: _onmidicb,
      onstatechange: _onstatechangecb
    } as MIDIInput);
  }
  return newMap;
}


export const MOCK_ACCESS_INPUTS: Map<MIDIInput["id"], MIDIInput> = makeFakeMIDIInputs();
export const MOCK_ACCESS_OUTPUTS: Map<MIDIOutput["id"], MIDIOutput> = makeFakeMIDIOutputs();
export const MOCK_MIDI_ACCESS_RECORD = {
  inputs: MOCK_ACCESS_INPUTS,
  outputs: MOCK_ACCESS_OUTPUTS,
  sysexEnabled: false,
  onstatechange: jest.fn(),
};