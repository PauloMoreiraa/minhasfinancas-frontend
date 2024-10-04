import React from "react";

function ButtonComponent(props) {
  const getButtonClasses = (variant) => {
    switch (variant) {
        case 'dark':
            return 'btn gap-1 btn-width-1 btn-dark mx-1 d-flex justify-content-center align-items-center';
        case 'info':
            return 'btn gap-1 btn-width-1 btn-info d-flex justify-content-center align-items-center';
        case 'info-2':
            return 'btn gap-1 btn-width-2 btn-info d-flex justify-content-center align-items-center';
        case 'success':
            return 'btn gap-1 btn-width-2 btn-success d-flex justify-content-center align-items-center';
        case 'danger':
            return 'btn gap-1 btn-width-2 btn-danger d-flex justify-content-center align-items-center';
        default:
            return 'btn gap-1 btn-secondary d-flex justify-content-center align-items-center';
    }
  };

  return (
    <button 
      onClick={props.onClick} 
      type={props.type} 
      className={getButtonClasses(props.variant)}
      disabled={props.disabled}
    >
      <i className={`pi ${props.icon}`}></i> {props.label}
    </button>
  );
}

export default ButtonComponent;
