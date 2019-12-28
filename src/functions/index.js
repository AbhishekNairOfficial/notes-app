import {useState, useEffect} from 'react';
// eslint-disable-next-line import/no-cycle
import useGlobal from '../store';

export const debounce = (func, wait) => {
  let timeout;
  return (...args) => {
    const context = this;
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(context, args), wait);
  };
};

export const useDarkMode = () => {
  const [globalState] = useGlobal();
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
  }, [globalState]);

  return darkMode;
};
