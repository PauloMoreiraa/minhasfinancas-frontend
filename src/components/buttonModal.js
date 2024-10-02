import React from "react";

function ButtonModal(props) {
  const { onClick, title, icon, variant, children } = props;

  const getButtonClasses = () => {
    return `btn gap-1 btn-width-3 btn-outline-${variant} d-flex justify-content-center align-items-center`;
  };

  return (
    <button type="button" className={getButtonClasses()} onClick={onClick}>
      <i className={`pi ${icon}`}></i>
      {children}
    </button>
  );
}

export default ButtonModal;
