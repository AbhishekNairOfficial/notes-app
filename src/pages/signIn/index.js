import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {secondaryColor} from '../../config';

const SignIn = ({navigation}) => {
  // ;
  const [userId, setUserId] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi there!</Text>
      <Text style={styles.text}>Welcome to NotesApp!</Text>
      <TextInput
        style={styles.input}
        onChangeText={text => setUserId(text)}
        value={userId}
        placeholder="Enter your name"
      />
      {userId !== '' && (
        <Button
          onPress={() => {
            AsyncStorage.setItem('userId', userId);
            navigation.navigate('App');
          }}
          style={styles.button}
          title="Sign In"
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: secondaryColor,
  },
  text: {
    fontSize: 28,
    marginBottom: 30,
    fontFamily: 'Product Sans',
  },
  input: {
    margin: 30,
    fontFamily: 'Product Sans',
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '80%',
    fontSize: 20,
  },
  button: {
    alignSelf: 'flex-end',
  },
});

SignIn.navigationOptions = () => {
  return {
    header: null,
  };
};

export default SignIn;
