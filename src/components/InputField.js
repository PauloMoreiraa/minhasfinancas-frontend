import React from "react";

const InputField = ({ type, value, onChange, id, placeholder, name, disabled }) => {
    return (
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className="form-control" 
            id={id} 
            placeholder={placeholder} 
            name={name}
            disabled={disabled}
        />
    );
};

export default InputField;
