// hooks/useToast.js
import { useState } from 'react';

export const useToast = () => {
  const [toast, setToast] = useState({
    show: false,
    type: 'success',
    title: '',
    message: '',
    duration: 3000
  });

  const showToast = ({ type = 'success', title, message, duration = 3000 }) => {
    setToast({
      show: true,
      type,
      title,
      message,
      duration
    });
  };

  const hideToast = () => {
    setToast(prev => ({ ...prev, show: false }));
  };

  const showSuccess = (title, message, duration) => {
    showToast({ type: 'success', title, message, duration });
  };

  const showError = (title, message, duration) => {
    showToast({ type: 'error', title, message, duration });
  };

  const showWarning = (title, message, duration) => {
    showToast({ type: 'warning', title, message, duration });
  };

  const showInfo = (title, message, duration) => {
    showToast({ type: 'info', title, message, duration });
  };

  return {
    toast,
    showToast,
    hideToast,
    showSuccess,
    showError,
    showWarning,
    showInfo
  };
};
