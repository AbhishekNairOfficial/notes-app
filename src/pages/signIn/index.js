import React from 'react';
import { View, Text } from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const SignIn = props => {
  AsyncStorage.setItem('userId', 'abhishek');
  return (
    <View>
      <Text>I am Sign In page</Text>
    </View>
  );
};

export default SignIn;
