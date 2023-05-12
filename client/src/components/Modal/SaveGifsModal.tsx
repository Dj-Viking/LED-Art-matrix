import React, { useEffect, useState } from "react";
import API from "../../utils/ApiService";
import AuthService from "../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { INewGifsModalState } from "../../types";
import styled from "styled-components";
import { modalActions } from "../../reducers/modalSlice";
import { getGlobalState } from "../../reducers/store";

const StyledModalCloseButton = styled.button`
    & {
        border: 1px solid grey;
        cursor: pointer;
        background-color: white;
        color: red;
        width: 100px;
        height: 40px;
        margin: 0 auto;
        border-radius: 10px;
        margin: 0.5em;
        transition: 0.1s;
        box-shadow: 4px 3px 8px black;
    }

    &:hover {
        transition: 0.5s;
        background-color: red;
        color: white;
        box-shadow: 5px 4px 9px red;
    }
`;

const StyledModalSaveButton = styled.button`
    & {
        border: 1px solid grey;
        cursor: pointer;
        background-color: green;
        color: white;
        height: 40px;
        width: 100px;
        border-radius: 10px;
        margin: 0.5em;
        transition: 0.1s;
        box-shadow: 4px 3px 8px black;
    }

    &:hover {
        transition: 0.5s;
        background-color: green;
        color: white;
        box-shadow: 5px 4px 9px green;
    }
`;

const GifSaveModalContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
`;

const saveButtonDisabledStyles: React.CSSProperties = {
    height: "40px",
    width: "100px",
    border: "1px solid grey",
    margin: ".5em",
    pointerEvents: "none",
    backgroundColor: "grey",
    color: "white",
    borderRadius: "10px",
};

const ModalInfo: React.FC<{ text: string; input: string }> = (props) => {
    return (
        <span
            data-testid="gif-modal-list-name"
            style={{
                color: "black",
                marginBottom: "1em",
            }}
        >
            {props.text} {props.input}
        </span>
    );
};

const ModalCloseButton: React.FC<{ text: string; onClose: (event?: any) => void }> = (props) => {
    return (
        <StyledModalCloseButton
            role="button"
            type="button"
            data-testid="gif-modal-close-button"
            onClick={(event) => {
                props.onClose(event);
            }}
        >
            {props.text}
        </StyledModalCloseButton>
    );
};

const ModalSaveButton: React.FC<{ input: string; handleSubmit: (event: any) => Promise<void> }> = (
    props
) => {
    return (
        <StyledModalSaveButton
            data-testid="gif-modal-save-button"
            disabled={props.input.length === 0}
            role="button"
            type="submit"
            style={props.input.length === 0 ? saveButtonDisabledStyles : {}}
            onClick={(event) => (async () => await props.handleSubmit(event))()}
        >
            SAVE
        </StyledModalSaveButton>
    );
};

const ModalHeader: React.FC<{ text: string }> = (props) => {
    return <h1 style={{ color: "black" }}>{props.text}</h1>;
};

const ModalInputField: React.FC<{ input: string; handleChange: (event?: any) => void }> = (
    props
) => {
    return (
        <input
            autoComplete="off"
            name="list-name"
            data-testid="gif-modal-list-name-input"
            style={{ color: "black" }}
            type="text"
            value={props.input}
            onChange={props.handleChange}
        />
    );
};

const ModalLabel: React.FC<{ label: string }> = (props) => {
    return (
        <label style={{ color: "black" }} htmlFor="list-name">
            {props.label}
        </label>
    );
};

const ErrorSpan: React.FC<{ error: string }> = (props) => {
    return (
        <>
            {props.error.length && (
                <span data-testid="add-gif-error" style={{ color: "red" }}>
                    {props.error}
                </span>
            )}
        </>
    );
};

interface SaveGifsModalProps {
    onClose: React.MouseEventHandler<HTMLElement>;
    context: INewGifsModalState["gifsModalContext"];
}

const SaveGifsModal: React.FC<SaveGifsModalProps> = ({ onClose, context: { listName, gif } }) => {
    const [error, setError] = useState<string>("");
    const [input, setInput] = useState<string>(listName);
    const { gifsModalIsOpen } = getGlobalState(useSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        setInput(listName);
    }, [listName, gifsModalIsOpen]);

    const handleChange = React.useCallback((event: any): void => {
        event.preventDefault();
        setInput(event.target.value);
    }, []);

    const handleSubmit = React.useCallback(
        async (event: any): Promise<void> => {
            event.preventDefault();
            try {
                await API.createGifs(AuthService.getToken() as string, gif, input);

                dispatch(modalActions.setGifModalIsOpen(false));
                dispatch(modalActions.setGifModalContext({ listName: listName, gif: {} as any }));

                return void 0;
            } catch (error) {
                const err = error as Error;
                setError(`Oops! ${err.message}`);
                return void 0;
            }
        },
        [dispatch, gif, input, listName]
    );

    return (
        <>
            <GifSaveModalContainer data-testid="gif-save-modal">
                <ModalCloseButton text={"CLOSE"} onClose={onClose} />

                <ModalHeader text="SAVE GIFS" />
                <ModalInfo text={"List Name: "} input={input} />

                <form>
                    <ModalLabel label="List Name: " />
                    <ModalInputField input={input} handleChange={handleChange} />
                    <ModalSaveButton input={input} handleSubmit={handleSubmit} />
                    <ErrorSpan error={error} />
                </form>
            </GifSaveModalContainer>
        </>
    );
};

export { SaveGifsModal };
