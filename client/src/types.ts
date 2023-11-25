import jwt from "jsonwebtoken";
import { MIDIAccessRecord, MIDIInput, MIDIOutput, onstatechangeHandler } from "./utils/MIDIControlClass";
import { CallbackMapping, MIDIMapping } from "./utils/MIDIMappingClass";
import { IDBPreset } from "./utils/PresetButtonsListClass";
import { CombinedFormState } from "./store/formSlice";
import { CombinedModalState } from "./store/modalSlice";
import { Action } from "@reduxjs/toolkit";
import { ToolkitDispatch, ToolkitRootState } from "./store/store";
import { MIDIInputName, UIInterfaceDeviceName } from "./constants";
import { KeyboardSliceState } from "./store/keyboardSlice";

export type MyThunkConfig = { state: ToolkitRootState; dispatch: ToolkitDispatch };

type RecordKey = string | number | symbol;
declare global {
    type Tuple<First, Second> = [First, Second];
    // make own overloads to the object static class methods
    interface ObjectConstructor {
        entries<K extends RecordKey, V>(o: Record<K, V> | ArrayLike<V>): [K, V][];
        keys<O = object>(o: O): Array<keyof O>;
        values<O = object>(o: O): Array<O[keyof O]>;
    }
    interface TypedActionCreator<T extends string> {
        (...args: any[]): Action<T>;
        type: T;
    }
    interface Navigator {
        requestMIDIAccess(): Promise<MIDIAccessRecord>;
    }
    interface EventTarget {
        id: string;
        value: any;
    }
    interface CanvasRenderingContext2D {
        roundRect(
            x: number,
            y: number,
            w: number,
            h: number,
            radii?: number | DOMPointInit | (number | DOMPointInit)[] | undefined
        ): void;
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
    resetTimerFn: () => void;
    isHSL: boolean;
    presetName: string;
    animVarCoeff: string;
}

export interface IGif {
    listName: string;
    gifSrcs: string[];
    listOwner: string;
    _id: string;
}

export interface ILoginFormState {
    loginUsernameOrEmail: string;
    loginEmailIsComplete: boolean;
    loginPassword: string;
    loginPasswordIsComplete: boolean;
}

export interface ISignupFormState {
    signupUsername: string;
    signupUsernameIsComplete: boolean;
    signupEmail: string;
    signupEmailIsComplete: boolean;
    signupPassword: string;
    signupPasswordIsComplete: boolean;
}

export interface IArtScrollerState {
    figureOn: boolean;
    gifs: Array<IGif>;
    listName: string;
    listNameIndex: number;
    listNames: string[];
    slider: {
        animDuration: string;
        vertPos: string;
        hPos: string;
        circleWidth: string;
        invert: string;
    };
}

export interface ILedStyleTagState {
    html: string;
}

export interface ILoggedInState {
    loggedIn: boolean;
}

export interface IPresetButtonsListState {
    presetButtons: IPresetButton[];
}
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

export type GlobalState = KeyboardSliceState &
    IAccessRecordState &
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

export interface INewGifsModalState {
    gifsModalIsOpen: boolean;
    gifsModalContext: { listName: string; gif: IGif };
}
export interface ISaveModalState {
    saveModalIsOpen: boolean;
    saveModalContext: { animVarCoeff: string; presetName: string };
}

export interface IDeleteModalState {
    deleteModalIsOpen: boolean;
    deleteModeActive: boolean;
    deleteModalContext: { btnId: string; displayName: string };
}

export type IAccessRecordState = {
    selectedController: MIDIInputName;
    isTesting: boolean;
    usingMidi: boolean;
    controllerInUse: MIDIInputName;
    midiMappingInUse: {
        callbackMap: CallbackMapping;
        recentlyUsed: MIDIInputName;
        hasPreference: boolean;
        midiMappingPreference: Record<MIDIInputName, MIDIMapping<MIDIInputName>>;
    };
    midiEditMode: boolean;
    isListeningForMappingEdit: boolean;
    mappingEditOptions: {
        uiName: UIInterfaceDeviceName;
    };
    usingFader: boolean;
    usingKnob: boolean;
    channel: number;
    intensity: number;
    inputs: Array<MIDIInput>;
    outputs: Array<MIDIOutput>;
    online: boolean;
    access: {
        inputs: Map<string, any>;
        outputs: Map<string, any>;
        sysexEnabled: boolean;
        onstatechange: onstatechangeHandler | null;
    };
};
