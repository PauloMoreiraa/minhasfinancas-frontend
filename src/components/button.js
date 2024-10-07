import React from "react";

function ButtonComponent(props) {
  const getButtonClasses = (variant) => {
    let baseClasses = 'btn gap-1 mx-1 d-flex justify-content-center align-items-center';
    
    switch (variant) {
      case 'dark':
          return `${baseClasses} btn-dark`;
      case 'info':
          return `${baseClasses} btn-info`;
      case 'info-2':
          return `${baseClasses} btn-info`;
      case 'info-3':
          return `${baseClasses} btn-info`;
      case 'success':
          return `${baseClasses} btn-success`;
      case 'danger':
          return `${baseClasses} btn-danger`;
      default:
          return `${baseClasses} btn-secondary`;
    }
  };

  const getButtonSizeClass = (size) => {
    switch (size) {
      case 'small':
        return 'btn-width-1';
      case 'medium':
        return 'btn-width-2';
      case 'large':
        return 'btn-width-3';
      default:
        return 'btn-width-2';
    }
  };

  return (
    <button 
      onClick={props.onClick} 
      type={props.type} 
      className={`${getButtonClasses(props.variant)} ${getButtonSizeClass(props.size)}`}
      disabled={props.disabled}
    >
      <i className={`pi ${props.icon}`}></i> {props.label}
    </button>
  );
}

export default ButtonComponent;
