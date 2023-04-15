import React, { useEffect, useState } from "react";
import API from "../../utils/ApiService";
import AuthService from "../../utils/AuthService";
import { useDispatch, useSelector } from "react-redux";
import { INewGifsModalState } from "../../types";
import styled from "styled-components";
import { setGifModalContext, setGifModalIsOpen } from "../../actions/gif-modal-actions";
import { getGlobalState } from "../../reducers";
interface SaveGifsModalProps {
    onClose: React.MouseEventHandler<HTMLElement>;
    context: INewGifsModalState["gifsModalContext"];
}

const ModalCloseButton = styled.button`
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

const ModalSaveButton = styled.button`
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

const SaveGifsModal: React.FC<SaveGifsModalProps> = ({ onClose, context: { listName, gif } }) => {
    const [error, setError] = useState<string>("");
    const [input, setInput] = useState<string>(listName);
    const { gifsModalIsOpen } = getGlobalState(useSelector);
    const dispatch = useDispatch();

    useEffect(() => {
        setInput(listName);
    }, [listName, gifsModalIsOpen]);

    function handleChange(event: any): void {
        event.preventDefault();
        setInput(event.target.value);
    }
    async function handleSubmit(event: any): Promise<void | unknown> {
        event.preventDefault();
        try {
            await API.createGifs(AuthService.getToken() as string, gif, input);

            dispatch(setGifModalIsOpen(false));
            dispatch(setGifModalContext({ listName: listName, gif: {} as any }));

            return void 0;
        } catch (error) {
            const err = error as Error;
            setError(`Oops! ${err.message}`);
            return void 0;
        }
    }
    return (
        <>
            <GifSaveModalContainer data-testid="gif-save-modal">
                <ModalCloseButton
                    role="button"
                    type="button"
                    data-testid="gif-modal-close-button"
                    onClick={(event) => {
                        onClose(event);
                    }}
                >
                    CLOSE
                </ModalCloseButton>
                <h1 style={{ color: "black" }}>SAVE GIFS</h1>

                <span
                    data-testid="gif-modal-list-name"
                    style={{
                        color: "black",
                        marginBottom: "1em",
                    }}
                >
                    List Name: {input}
                </span>

                <form>
                    <label style={{ color: "black" }} htmlFor="list-name">
                        List Name:
                    </label>

                    <input
                        autoComplete="off"
                        name="list-name"
                        data-testid="gif-modal-list-name-input"
                        style={{ color: "black" }}
                        type="text"
                        value={input}
                        onChange={handleChange}
                    />

                    <ModalSaveButton
                        data-testid="gif-modal-save-button"
                        disabled={input.length === 0}
                        role="button"
                        type="submit"
                        style={input.length === 0 ? saveButtonDisabledStyles : {}}
                        onClick={(event) => (async () => await handleSubmit(event))()}
                    >
                        SAVE
                    </ModalSaveButton>
                    {error.length ? (
                        <span data-testid="add-gif-error" style={{ color: "red" }}>
                            {error}
                        </span>
                    ) : null}
                </form>
            </GifSaveModalContainer>
        </>
    );
};

export { SaveGifsModal };
