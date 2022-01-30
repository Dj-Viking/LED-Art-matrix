import React from "react";


interface SliderProps {
  inputValueState: number;
  name: string;
  testid: string;
  label: string;
  handleChange: React.ChangeEventHandler<HTMLInputElement>; 
}

const Slider: React.FC<SliderProps> = ({ 
  inputValueState,
  name,
  testid,
  label, 
  handleChange 
}) => {
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column", justifyContent: "center" }}>

        <label
          htmlFor={name}
          style={{ color: "white", margin: "0 auto" }}
        >
          {label}{inputValueState}
        </label>

        <span style={{color: "white", marginLeft: "20%"}}>
          &nbsp; <span style={{color: "white", marginLeft: "60%"}}>&nbsp;</span>
        </span>
        
        <input 
          name={name}
          className="slider-style"
          data-testid={testid}
          type="range"
          min="0"
          max="200"
          value={inputValueState}
          onChange={handleChange}
        />
        
      </div>
    </>
  );
};

export { Slider };