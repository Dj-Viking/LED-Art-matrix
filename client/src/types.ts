import jwt from "jsonwebtoken";
import {
    MIDIConnectionEvent,
    MIDIController,
    MIDIInput,
    MIDIMessageEvent,
    MIDIOutput,
    onstatechangeHandler,
} from "./utils/MIDIControlClass";
import { IDBPreset } from "./utils/PresetButtonsListClass";
import { CombinedFormState } from "./reducers/formSlice";
import { CombinedModalState } from "./reducers/modalSlice";

type RecordKey = string | number | symbol;
declare global {
    // make own overloads to the object static class methods
    interface ObjectConstructor {
        entries<K extends RecordKey, V>(o: Record<K, V> | ArrayLike<V>): [K, V][];
        keys<O = object>(o: O): Array<keyof O>;
        values<O = object>(o: O): Array<O[keyof O]>;
    }
}

export type MyJwtData = IJwtData;
export interface IJwtData extends jwt.JwtPayload {
    _id: string;
    username: string;
    email: string;
    uuid?: string;
    adminUuid: string;
    role: "user" | "admin";
    resetEmail?: string;
    iat?: number;
    exp?: number;
}
export interface ILedState {
    alpha: string;
    presetName: string;
    animationDurationState: string;
    isInverted: boolean;
    animVarCoeff: string;
    html: string;
}
export type ILedActionTypes =
    | "LOAD_USER_SPLASH_CONFIG"
    | "INVERT_SWITCH"
    | "PRESET_SWITCH"
    | "VAR_COEFF_CHANGE"
    | "ALPHA_FADER_CHANGE";

export type ILedActionPayloads =
    | ILedLoadUserSplashConfigAction["payload"]
    | ILedAlphaFaderChangeAction["payload"]
    | ILedAnimationDelayChange["payload"]
    | ILedAnimVarCoeffChangeAction["payload"]
    | ILedAnimationDurationChangeAction["payload"]
    | ILedPresetSwitchAction["payload"];

export interface ILedAction {
    type: ILedActionTypes;
    payload: ILedActionPayloads;
}

export interface ILedAnimVarCoeffChangeAction {
    type: "VAR_COEFF_CHANGE";
    payload: string;
}
export interface ILedLoadUserSplashConfigAction {
    type: "LOAD_USER_SPLASH_CONFIG";
    payload: {
        presetName: string;
        animationDelayState: string;
        animationDurationState: string;
    };
}

export interface ILedInvertSwitchAction {
    type: "INVERT_SWITCH";
    payload: string;
}
export interface ILedPresetSwitchAction {
    type: "PRESET_SWITCH";
    payload: string;
}
export interface ILedAnimationDurationChangeAction {
    type: "ANIMATION_DURATION_CHANGE";
    payload: string;
}
export interface ILedAnimationDelayChange {
    type: "ANIMATION_DELAY_CHANGE";
    payload: string;
}
export interface ILedAlphaFaderChangeAction {
    type: "ALPHA_FADER_CHANGE";
    payload: string;
}
export interface ILedSavePresetNameAction {
    type: "SAVE_PRESET_NAME";
    payload: string;
}
export interface ILedIsAnimatingAction {
    type: "IS_ANIMATING";
    payload: boolean;
}
// will get the type eventually
// eslint-disable-next-line
export interface IGif {
    listName: string;
    gifSrcs: string[];
    listOwner: string;
    _id: string;
}
export interface ISetHPosAction {
    type: "SET_H_POS";
    payload: string;
}
export interface ISetCircleWidthAction {
    type: "SET_CIRCLE_WIDTH";
    payload: string;
}
export interface ISetInvertAction {
    type: "SET_INVERT";
    payload: string;
}
export interface ISetFigureOnAction {
    type: "TOGGLE_FIGURE";
    payload: boolean;
}
export interface ISetVertPosAction {
    type: "SET_VERT_POS";
    payload: string;
}
export interface ISetAnimDurationAction {
    type: "SET_ANIM_DUR";
    payload: string;
}
export interface ISetListNameAction {
    type: "SET_LIST_NAME";
    payload: string;
}

export interface ISetGifsAction {
    type: "SET_GIFS";
    payload: Array<IGif>;
}

export interface ILoginFormState {
    loginUsernameOrEmail: string;
    loginEmailIsComplete: boolean;
    loginPassword: string;
    loginPasswordIsComplete: boolean;
}
export type ILoginFormActionTypes = "LOGIN_EMAIL_OR_USERNAME_CHANGE" | "LOGIN_PASSWORD_CHANGE";

export type ILoginFormActionPayloads =
    | ILoginUsernameOrEmailChangeAction["payload"]
    | ILoginPasswordChangeAction["payload"];

export interface ILoginFormAction {
    type: ILoginFormActionTypes;
    payload: ILoginFormActionPayloads;
}
export interface ILoginUsernameOrEmailChangeAction {
    type: "LOGIN_EMAIL_OR_USERNAME_CHANGE";
    payload: string;
}
export interface ILoginPasswordChangeAction {
    type: "LOGIN_PASSWORD_CHANGE";
    payload: string;
}
export interface ISignupFormState {
    signupUsername: string;
    signupUsernameIsComplete: boolean;
    signupEmail: string;
    signupEmailIsComplete: boolean;
    signupPassword: string;
    signupPasswordIsComplete: boolean;
}
export type ISignupFormActionTypes =
    | "SIGNUP_USERNAME_CHANGE"
    | "SIGNUP_EMAIL_CHANGE"
    | "SIGNUP_PASSWORD_CHANGE";

export type ISignupFormActionPayloads =
    | ISignupEmailChangeAction["payload"]
    | ISignupUsernameChangeAction["payload"]
    | ISignupPasswordChangeAction["payload"];

export interface ISignupFormAction {
    type: ISignupFormActionTypes;
    payload: ISignupFormActionPayloads;
}

export interface ISignupUsernameChangeAction {
    type: "SIGNUP_USERNAME_CHANGE";
    payload: string;
}
export interface ISignupEmailChangeAction {
    type: "SIGNUP_EMAIL_CHANGE";
    payload: string;
}
export interface ISignupPasswordChangeAction {
    type: "SIGNUP_PASSWORD_CHANGE";
    payload: string;
}

export interface IArtScrollerState {
    figureOn: boolean;
    gifs: Array<IGif>;
    listName: string;
    slider: {
        animDuration: string;
        vertPos: string;
        hPos: string;
        circleWidth: string;
        invert: string;
    };
}

export type IArtScrollerActionTypes =
    | ISetListNameAction["type"]
    | ISetGifsAction["type"]
    | ISetAnimDurationAction["type"]
    | ISetVertPosAction["type"]
    | ISetHPosAction["type"]
    | ISetCircleWidthAction["type"]
    | ISetInvertAction["type"]
    | ISetFigureOnAction["type"];

export type IArtScrollerPayloads =
    | ISetListNameAction["payload"]
    | ISetGifsAction["payload"]
    | ISetAnimDurationAction["payload"]
    | ISetVertPosAction["payload"]
    | ISetHPosAction["payload"]
    | ISetCircleWidthAction["payload"]
    | ISetInvertAction["payload"]
    | ISetFigureOnAction["payload"];

export interface IArtScrollerAction {
    type: IArtScrollerActionTypes;
    payload: IArtScrollerPayloads;
}

export interface ILedSetStyleAction {
    type: "SET_STYLE";
    payload: string;
}
export interface ILedClearStyleAction {
    type: "CLEAR_STYLE";
    payload: "";
}

export interface ILedStyleTagState {
    html: string;
}

export type ILedStyleTagActionTypes = "SET_STYLE" | "CLEAR_STYLE";

export type ILedStyleTagActionPayloads =
    | ILedSetStyleAction["payload"]
    | ILedClearStyleAction["payload"];

export interface ILedStyleAction {
    type: ILedStyleTagActionTypes;
    payload: ILedStyleTagActionPayloads;
}
export interface ILoggedInState {
    loggedIn: boolean;
}

export interface IPresetButtonsListState {
    midiMode: boolean;
    presetButtons: IPresetButton[];
}
export interface ISetPresetButtonsListAction {
    type: "SET_BUTTONS_LIST";
    payload: IPresetButton[];
}

export type SetActiveButtonAction = (id: string) => ISetActiveButtonAction;

export interface ISetActiveButtonAction {
    type: "SET_ACTIVE_BUTTON";
    payload: string;
}
export type ITogglePresetButtonMidiMode = () => {
    type: "TOGGLE_MIDI_MODE";
    payload: null;
};
export type ICheckPresetButtonsActiveAction = (
    buttons: IPresetButton[],
    id: string
) => {
    type: "CHECK_BUTTONS_ACTIVE";
    payload: IPresetButton[];
};
export interface IPresetButtonsAction {
    type: IPresetButtonListActionTypes;
    payload: IPresetButtonListActionPayloads;
}
export type IPresetButtonListActionTypes =
    | ISetPresetButtonsListAction["type"]
    | ISetActiveButtonAction["type"]
    | "TOGGLE_MIDI_MODE"
    | "CHECK_BUTTONS_ACTIVE"
    | "SET_ALL_INACTIVE"
    | "DELETE_PRESET"
    | "TOGGLE_DELETE_MODE";

export type IPresetButtonListActionPayloads =
    | ISetPresetButtonsListAction["payload"]
    | ISetActiveButtonAction["payload"]
    | boolean
    | IPresetButton[];

export interface IPresetButton {
    id: string;
    role: string;
    keyBinding: string;
    key: string;
    isActive: boolean;
    presetName: string;
    animVarCoeff: string;
    displayName: string;
    testid: string;
    classList?: string;
    clickHandler: React.MouseEventHandler<HTMLElement>;
}

export type ISetAllInactiveAction = (buttons: IPresetButton[]) => {
    type: "SET_ALL_INACTIVE";
    payload: IPresetButton[];
};
export type IToggleDeleteModeAction = (on: boolean) => {
    type: "TOGGLE_DELETE_MODE";
    payload: boolean;
};

export interface ILoggedinAction {
    type: ILoggedInActionTypes;
    payload: ILoggedInActionPayloads;
}

export type ILoggedInActionTypes = "LOG_IN" | "LOG_OUT";

export type ILoggedInActionPayloads = ILoginAction["payload"] | ILogoutAction["payload"];
export interface ILoginAction {
    type: "LOG_IN";
    payload: true;
}
export interface ILogoutAction {
    type: "LOG_OUT";
    payload: false;
}

export type GlobalState = IAccessRecordState &
    CombinedFormState &
    CombinedModalState &
    ILedState &
    IPresetButtonsListState &
    ILoggedInState &
    ILedStyleTagState &
    IArtScrollerState;

export interface MyRootState {
    accessRecordState: IAccessRecordState;
    saveModalState: ISaveModalState;
    gifsModalState: INewGifsModalState;
    deleteModalState: IDeleteModalState;
    ledState: ILedState;
    presetButtonsListState: IPresetButtonsListState;
    loggedInState: ILoggedInState;
    ledStyleTagState: ILedStyleTagState;
    loginFormState: ILoginFormState;
    signupFormState: ISignupFormState;
    artScrollerState: IArtScrollerState;
}

export interface ISignTestTokenArgs {
    _id?: string;
    username: string;
    email: string;
    role?: string;
    uuid?: string;
}
export interface ISaveUserPresetArgs {
    presetName: string;
    animVarCoeff: string;
    displayName: string;
}

export interface IUserResponse {
    user: {
        username: string;
        email: string;
        token?: string;
        orders?: Array<IOrder>;
        presets?: Array<IDBPreset>;
        defaultPreset?: IDBPreset;
        userSearchTerm?: ISearchTerm;
    };
}

export interface IOrder {
    purchaseDate?: Date;
    products: Array<IProduct>;
}

export interface IProduct {
    name: string;
    description?: string;
    image?: string;
    price: number;
    quantity?: number;
    category: ICategory;
}

export interface ICategory {
    name: string;
}
export interface ISearchTerm {
    termText?: string;
    termCategory?: string;
    limit?: string;
}
export interface ISetDeleteModalOpenAction {
    type: "SET_DELETE_MODAL_OPEN";
    payload: boolean;
}
export interface ISetDeleteModalContextAction {
    type: "SET_DELETE_MODAL_CONTEXT";
    payload: { btnId: string; displayName: string };
}

export interface ISetSaveModalContextAction {
    type: "SET_SAVE_MODAL_CONTEXT";
    payload: { animVarCoeff: string; presetName: string };
}
export interface ISetSaveModalIsOpenAction {
    type: "SET_SAVE_MODAL_OPEN";
    payload: boolean;
}
export type INewGifsModalActionTypes = "SET_GIFS_MODAL_OPEN" | "SET_GIFS_MODAL_CONTEXT";
export type INewGifsModalActionPayloads = boolean | { listName: string; gif: IGif };
export type SetGifsModalContextAction = (ctx: {
    listName: string;
    gif: IGif;
}) => ISetGifsModalContextAction;
export type SetGifsModalIsOpen = (isOpen: boolean) => ISetGifsModalIsOpenAction;
export interface ISetGifsModalContextAction {
    type: "SET_GIFS_MODAL_CONTEXT";
    payload: { listName: string; gif: IGif };
}
export interface ISetGifsModalIsOpenAction {
    type: "SET_GIFS_MODAL_OPEN";
    payload: boolean;
}
export interface INewGifsModalAction {
    type: INewGifsModalActionTypes;
    payload: INewGifsModalActionPayloads;
}
export interface INewGifsModalState {
    gifsModalIsOpen: boolean;
    gifsModalContext: { listName: string; gif: IGif };
}
export interface ISaveModalState {
    saveModalIsOpen: boolean;
    saveModalContext: { animVarCoeff: string; presetName: string };
}
export type ISaveModalActionTypes =
    | ISetSaveModalIsOpenAction["type"]
    | ISetSaveModalContextAction["type"];

export type ISaveModalActionPayloads =
    | ISetSaveModalIsOpenAction["payload"]
    | ISetSaveModalContextAction["payload"];
export interface ISaveModalAction {
    type: ISaveModalActionTypes;
    payload: ISaveModalActionPayloads;
}
export interface IDeleteModalState {
    deleteModalIsOpen: boolean;
    deleteModeActive: boolean;
    deleteModalContext: { btnId: string; displayName: string };
}

export type UDeleteModalActionTypes =
    | ISetDeleteModalOpenAction["type"]
    | "TOGGLE_DELETE_MODE"
    | ISetDeleteModalContextAction["type"];

export type UDeleteModalActionPayloads =
    | ISetDeleteModalOpenAction["payload"]
    | boolean
    | ISetDeleteModalContextAction["payload"];

export interface IDeleteModalAction {
    type: UDeleteModalActionTypes;
    payload: UDeleteModalActionPayloads;
}
export interface IDeletePresetAction {
    type: "DELETE_PRESET";
    payload: IPresetButton[];
}

export type IAccessRecordState = {
    midiEditMode: boolean;
    usingFader: boolean;
    usingKnob: boolean;
    inputs: Array<MIDIInput>;
    outputs: Array<MIDIOutput>;
    online: boolean;
    access: {
        inputs: Map<string, any>;
        outputs: Map<string, any>;
        sysexEnabled: boolean;
        onstatechange: onstatechangeHandler | null;
    };
    onstatechange: onstatechangeHandler | null;
    sysexEnabled: boolean;
};

export type UAccessRecordActionTypes =
    | "SET_ACCESS"
    | "DETERMINE_DEVICE_CONTROL"
    | "SET_MIDI_EDIT_MODE";

export interface ISetAccessRecordAction {
    type: "SET_ACCESS";
    payload: IAccessRecordState;
}
export interface ISetMIDIEditModeAction {
    type: "SET_MIDI_EDIT_MODE";
    payload: boolean;
}
export type SetMIDIEditModeAction = (mode: boolean) => ISetMIDIEditModeAction;

export type SetAccessRecordAction = (
    access: MIDIController,
    onmidicb?: (event: MIDIMessageEvent) => void,
    onstatechangecb?: (event: MIDIConnectionEvent) => void
) => Partial<ISetAccessRecordAction>;

export interface IDetermineDeviceControlAction {
    type: "DETERMINE_DEVICE_CONTROL";
    payload: { usingFader: boolean; usingKnob: boolean };
}

export type AccessRecordActionPayloads =
    | IDetermineDeviceControlAction["payload"]
    | ISetAccessRecordAction["payload"]
    | ISetMIDIEditModeAction["payload"];

export interface IAccessRecordAction {
    type: UAccessRecordActionTypes;
    payload: AccessRecordActionPayloads;
}
