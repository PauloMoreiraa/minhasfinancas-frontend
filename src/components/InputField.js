import React from 'react';

const InputField = ({ type, value, onChange, id, placeholder, name }) => {
    return (
        <input 
            type={type} 
            value={value} 
            onChange={onChange} 
            className="form-control" 
            id={id} 
            placeholder={placeholder} 
            name={name}
        />
    );
};

export default InputField;
