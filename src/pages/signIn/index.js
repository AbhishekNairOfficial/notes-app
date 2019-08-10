import React from 'react';
import { View, Text, AsyncStorage } from 'react-native';

const SignIn = props => {
  AsyncStorage.setItem('userId', 'abhishek');
  return (
    <View>
      <Text>I am Sign In page</Text>
    </View>
  );
};

export default SignIn;
