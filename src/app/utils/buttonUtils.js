export const getButtonSizeClass = (size) => {
    switch (size) {
      case 'small':
        return 'btn-width-1';
      case 'medium':
        return 'btn-width-2';
      case 'large':
        return 'btn-width-3';
      case 'max-w':
        return 'btn-max-width';
      default:
        return 'btn-width-2';
    }
  };
  