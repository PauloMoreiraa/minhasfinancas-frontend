import React from "react";
import { getButtonSizeClass } from '../app/utils/buttonUtils'; 

function ButtonComponent(props) {
  const getButtonClasses = (variant) => {
    let baseClasses = 'btn gap-1 mx-1 d-flex justify-content-center align-items-center';
    
    switch (variant) {
      case 'dark':
        return `${baseClasses} btn-dark`;
      case 'info':
        return `${baseClasses} btn-info`;
      case 'success':
        return `${baseClasses} btn-success`;
      case 'danger':
        return `${baseClasses} btn-danger`;
      default:
        return `${baseClasses} btn-secondary`;
    }
  };

  return (
    <button 
      onClick={props.onClick} 
      type={props.type} 
      className={`${getButtonClasses(props.variant)} ${getButtonSizeClass(props.size)}`} // Usa a função importada
      disabled={props.disabled}
    >
      <i className={`pi ${props.icon}`}></i> {props.label}
    </button>
  );
}

export default ButtonComponent;
