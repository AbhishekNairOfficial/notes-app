import React, {useState, memo, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  // Image,
  TextInput,
  Button,
  Dimensions,
  StatusBar,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
// import signInImage from '../../../assets/sign_in_background.jpg';
import {secondaryColor, black} from '../../config';

const onSignIn = async () => {
  try {
    await GoogleSignin.hasPlayServices();
    const userInfo = await GoogleSignin.signIn();
    this.setState({userInfo, loggedIn: true});
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_CANCELLED) {
      // user cancelled the login flow
    } else if (error.code === statusCodes.IN_PROGRESS) {
      // operation (f.e. sign in) is in progress already
    } else if (error.code === statusCodes.PLAY_SERVICES_NOT_AVAILABLE) {
      // play services not available or outdated
    } else {
      // some other error happened
    }
  }
};

// const signOut = async () => {
//   try {
//     await GoogleSignin.revokeAccess();
//     await GoogleSignin.signOut();
//     this.setState({user: null, loggedIn: false}); // Remember to remove the user from your app's state as well
//   } catch (error) {
//     console.error(error);
//   }
// };

const getCurrentUserInfo = async () => {
  try {
    const userInfo = await GoogleSignin.signInSilently();
    this.setState({userInfo});
  } catch (error) {
    if (error.code === statusCodes.SIGN_IN_REQUIRED) {
      // user has not signed in yet
      this.setState({loggedIn: false});
    } else {
      // some other error
      this.setState({loggedIn: false});
    }
  }
};

const SignIn = memo(({navigation}) => {
  StatusBar.setBarStyle('dark-content', false);
  const [userId, setUserId] = useState('');

  useEffect(() => {
    GoogleSignin.configure({
      scopes: ['https://www.googleapis.com/auth/drive.readonly'],
      webClientId:
        '445354016106-kgprss2d95vkpinlsdqphc7bsvmi6cih.apps.googleusercontent.com',
      offlineAccess: true,
      hostedDomain: '',
      loginHint: '',
      forceConsentPrompt: true,
      accountName: '',
    });
    getCurrentUserInfo();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Hi there!</Text>
      <Text style={styles.text}>Welcome to NotesApp!</Text>
      {/* <Image style={styles.image} source={signInImage} /> */}
      <GoogleSigninButton
        style={{...{width: 312, height: 48}}}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={onSignIn}
        disabled={false}
      />
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
