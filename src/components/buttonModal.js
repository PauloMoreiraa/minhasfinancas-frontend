import React from "react";
import { getButtonSizeClass } from '../app/utils/buttonUtils'; 

function ButtonModal(props) {
  const { onClick, icon, variant, children, size, disabled } = props;

  const getButtonClasses = () => {
    return `btn gap-1 ${getButtonSizeClass(size)} btn-outline-${variant} d-flex justify-content-center align-items-center`;
  };

  return (
    <button type="button" className={getButtonClasses()} onClick={onClick} disabled={disabled}>
      <i className={`pi ${icon}`}></i>
      {children}
    </button>
  );
}

export default ButtonModal;
