import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  Dimensions,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import auth, {firebase} from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import signInImage from '../../../assets/sign_in_background_2.png';
import {signInBackground} from '../../config';
import useGlobal from '../../store';

const SignIn = memo(({navigation}) => {
  StatusBar.setBarStyle('dark-content', false);
  const [, globalActions] = useGlobal();
  const [initilizing, setInitilizing] = useState(true);

  useEffect(() => {
    // Handle user state changes
    const onAuthStateChanged = () => {
      if (initilizing) {
        setInitilizing(false);
      }
    };
    const subscriber = auth().onAuthStateChanged(onAuthStateChanged);
    return subscriber; // unsubscribe on unmount
  }, [initilizing]);

  if (initilizing) return null;

  const signInAnonymously = async () => {
    try {
      await auth().signInAnonymously();
      navigation.navigate('App');
    } catch (e) {
      switch (e.code) {
        case 'auth/operation-not-allowed':
          console.log('Enable anonymous in your firebase console.');
          break;
        default:
          console.error(e);
          break;
      }
    }
  };

  const onSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken, accessToken} = await GoogleSignin.signIn();
      const credential = firebase.auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      const userInfo = await firebase.auth().signInWithCredential(credential);
      const {uid, email, displayName} = userInfo.user;
      // Create a reference
      const ref = database().ref(`/users/${uid}`);
      globalActions.updateUid(uid);
      // Checking whether the user already has data here
      await database()
        .ref(`/users/${uid}`)
        .once('value')
        .then(async snapshot => {
          const userProfile = snapshot.val();
          if (userProfile === null) {
            // User doesn't exist
            // Creating Initial State for user
            await ref.set({
              uid,
              name: displayName,
              email,
              preferences: {darkMode: false},
              list: [],
            });
          } else {
            // User has already used the app
            const {list, preferences} = userProfile;
            globalActions.addAllNotes(Object.values(list));
            globalActions.toggleDarkMode(preferences.darkMode);
          }
        });
      navigation.navigate('App');
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

  return (
    <View style={styles.container}>
      <Image style={styles.image} source={signInImage} />
      <Text style={styles.text}>Hi there, Stranger</Text>
      <Text style={styles.text}>Welcome to NotesApp!</Text>
      <Text style={styles.description}>
        Login with one of the options below, and let&apos;s get you started!
      </Text>
      <GoogleSigninButton
        style={styles.googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={onSignIn}
        disabled={false}
      />
      <Text style={styles.description}>or</Text>
      <TouchableOpacity onPress={() => signInAnonymously()}>
        <Text style={styles.anonText}>Sign In anonymously</Text>
      </TouchableOpacity>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    height: '100%',
    padding: 20,
    paddingTop: Dimensions.get('screen').height / 5,
    alignItems: 'center',
    justifyContent: 'flex-start',
    backgroundColor: signInBackground,
  },
  googleButton: {
    width: 312,
    height: 48,
  },
  text: {
    fontSize: 28,
    marginBottom: 10,
    fontFamily: 'Product Sans',
  },
  description: {
    fontSize: 18,
    fontFamily: 'Product Sans',
    margin: 15,
  },
  image: {
    width: Dimensions.get('screen').width / 2,
    height: Dimensions.get('screen').width / 2,
  },
  anonText: {
    fontSize: 22,
    fontFamily: 'Product Sans',
  },
});

SignIn.navigationOptions = () => {
  return {
    header: null,
  };
};

export default SignIn;
