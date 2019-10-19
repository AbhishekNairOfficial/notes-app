import React, {useState, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  Button,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import signInImage from '../../../assets/sign_in_background.jpg';
import {secondaryColor, black} from '../../config';

const SignIn = memo(({navigation}) => {
  StatusBar.setBarStyle('dark-content', false);
  const [userId, setUserId] = useState('');
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi there!</Text>
      <Text style={styles.text}>Welcome to NotesApp!</Text>
      <Image style={styles.image} source={signInImage} />
      <TextInput
        style={styles.input}
        onChangeText={text => setUserId(text)}
        value={userId}
        placeholderTextColor="#333"
        placeholder="Enter your name"
      />
      <Button
        disabled={userId === ''}
        onPress={() => {
          AsyncStorage.setItem('userId', userId);
          navigation.navigate('App');
        }}
        style={styles.button}
        title="Sign In"
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    color: secondaryColor,
  },
  text: {
    fontSize: 28,
    marginBottom: 15,
    fontFamily: 'Product Sans',
  },
  image: {
    width: Dimensions.get('screen').width,
    height: Dimensions.get('screen').width,
  },
  input: {
    margin: 15,
    padding: 15,
    fontFamily: 'Product Sans',
    borderColor: 'gray',
    borderBottomWidth: 1,
    width: '80%',
    fontSize: 20,
    color: black,
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
