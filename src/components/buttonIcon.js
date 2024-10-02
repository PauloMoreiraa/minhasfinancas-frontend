import React from "react";

function ButtonIcon(props) {
  const getButtonClasses = (variant) => {
    switch (variant) {
      case 'success':
        return 'btn btn-success';
      case 'warning':
        return 'btn btn-warning';
      case 'primary':
        return 'btn btn-primary';
      case 'danger':
        return 'btn btn-danger';
      default:
        return 'btn btn-secondary';
    }
  };

  return (
    <button
      title={props.title}
      disabled={props.disabled}
      onClick={props.onClick}
      type={props.type || "button"}
      className={getButtonClasses(props.variant)}
    >
      <i className={`pi ${props.icon}`}></i>
    </button>
  );
}

export default ButtonIcon;
