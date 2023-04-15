import React, { ReactNode } from "react";
import styled from "styled-components";

interface ModalProps {
    isOpen: boolean;
    children: ReactNode[] | ReactNode;
}

const ModalContainer = styled.div`
    position: relative;
    height: 0px;
    width: 250px;
    margin: 0 auto;
`;

const ModalSubContainer = styled.div`
    position: absolute;
    justify-content: center;
    background-color: white;
    border-radius: 10px;
    height: 250px;
    width: 250px;
`;

const Modal: React.FC<ModalProps> = ({ isOpen, children }) => {
    return (
        <>
            <ModalContainer>
                <ModalSubContainer
                    data-testid="modal-base"
                    style={{ display: isOpen ? "flex" : "none" }}
                >
                    {children}
                </ModalSubContainer>
            </ModalContainer>
        </>
    );
};

export { Modal };
