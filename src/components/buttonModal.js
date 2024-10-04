import React from "react";

function ButtonModal(props) {
  const { onClick, icon, variant, children, disabled } = props;

  const getButtonClasses = () => {
    return `btn gap-1 btn-width-3 btn-outline-${variant} d-flex justify-content-center align-items-center`;
  };

  return (
    <button type="button" className={getButtonClasses()} onClick={onClick} disabled={disabled}>
      <i className={`pi ${icon}`}></i>
      {children}
    </button>
  );
}

export default ButtonModal;
