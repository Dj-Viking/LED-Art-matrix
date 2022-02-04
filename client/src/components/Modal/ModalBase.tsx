import React, { ReactNode } from "react";


interface ModalProps {
  isOpen: boolean;
  children: ReactNode[] | ReactNode
}

const Modal: React.FC<ModalProps> = ({ 
  isOpen, 
  children 
}) => {
  return (
    <>
      <div 
        style={{ 
          position: "relative", 
          height: "0", 
          width: "250px", 
          margin: "0 auto" 
        }}
      >
        <div
          data-testid="modal-base" 
          style={{
            
            display: isOpen ? "flex" : "none", 
            position: "absolute",
            justifyContent: "center",
            backgroundColor: "white",
            borderRadius: "10px",
            height: "250px",
            width: "250px"
          }}
        >
          {children}
        </div>
      </div>
    </>
  );
};

export default Modal;