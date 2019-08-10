import 'react-native';
import React from 'react';
import renderer from 'react-test-renderer';
import AsyncStorage from '@react-native-community/async-storage';
import SignIn from './';

it('renders SignIn correctly', () => {
  renderer.create(<SignIn />);
});

test('checks if Async Storage is used to set userId', async () => {
  await SignIn;
  expect(AsyncStorage.setItem).toBeCalled();
});
