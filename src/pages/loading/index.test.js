import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';

import AsyncStorage from '@react-native-community/async-storage';

import AuthLoadingScreen from '.';

it('renders correctly', () => {
  renderer.create(<AuthLoadingScreen />);
});

it('checks if Async Storage is used to call UserId', async () => {
  await AuthLoadingScreen.CheckForToken;
  expect(AsyncStorage.getItem).toBeCalledWith('userId');
});
