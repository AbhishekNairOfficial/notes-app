import React, {useState} from 'react';
import {View, Text, StyleSheet, TextInput, Button} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';

const SignIn = ({navigation}) => {
  // ;
  const [userId, setUserId] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi, Welcome to NotesApp!</Text>
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
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
  },
  input: {
    margin: 30,
    height: 40,
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '80%',
    fontSize: 20,
  },
  button: {
    alignSelf: 'flex-end',
  },
});

export default SignIn;
