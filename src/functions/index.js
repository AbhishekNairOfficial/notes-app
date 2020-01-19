import {useState, useEffect} from 'react';
import {Alert} from 'react-native';
import TouchID from 'react-native-touch-id';

import analytics from '@react-native-firebase/analytics';

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

export const trackScreenView = async screen => {
  // Set & override the MainActivity screen name
  await analytics().setCurrentScreen(screen, screen);
};

export const biometricAuthentication = async () => {
  const authenticate = () => {
    return TouchID.authenticate()
      .then(success => {
        console.log(success);
        return true;
        // Alert.alert('Authenticated Successfully');
      })
      .catch(error => {
        console.log(error);
        Alert.alert(error.message);
        return false;
      });
  };

  try {
    const isSupported = await TouchID.isSupported();

    return isSupported && authenticate();
  } catch (error) {
    Alert.alert('TouchID not supported');
  }
};

// Particulrly used for Ios as elevation property is not working in Ios

export const elevationShadowStyle = elevation => {
  return {
    elevation,
    shadowColor: '#333',
    shadowOffset: {width: elevation, height: 2.4 * elevation},
    shadowOpacity: 0.1,
    shadowRadius: 2.4 * elevation,
  };
};
