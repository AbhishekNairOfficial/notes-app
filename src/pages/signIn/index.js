import React, {useState, useEffect, memo} from 'react';
import {
  View,
  Text,
  Image,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  // TouchableOpacity,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';
import signInImage from '../../../assets/sign_in_background_2.png';
import {signInBackground, primaryColor} from '../../config';
import useGlobal from '../../store';
import {trackScreenView} from '../../functions';
import useStyle from './styles';

const SignIn = memo(({navigation}) => {
  StatusBar.setBarStyle('dark-content', false);
  const [, globalActions] = useGlobal();
  const [initilizing, setInitilizing] = useState(true);
  const [statusText, setStatusText] = useState('');
  const {container, text, googleButton, description, image} = useStyle();

  // Small function to give me easy await functionality
  const sleep = m => new Promise(r => setTimeout(r, m));

  useEffect(() => {
    trackScreenView('SignInPage');
  }, []);

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

  const onSignIn = async () => {
    try {
      await GoogleSignin.hasPlayServices();
      const {idToken} = await GoogleSignin.signIn();

      setStatusText('Loading your details...');
      const {accessToken} = await GoogleSignin.getTokens();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      const userInfo = await auth().signInWithCredential(credential);
      const {uid, email, displayName} = userInfo.user;

      setStatusText('Checking whether you already have used the app before..');
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
            setStatusText('Creating a user profile for you...!');
            await ref.set({
              uid,
              name: displayName,
              email,
              preferences: {darkMode: false},
              list: [],
            });
          } else {
            // User has already used the app
            setStatusText('Loading all your notes from Google...');
            await sleep(1000);
            const {list, preferences} = userProfile;

            if (list) {
              await globalActions.addAllNotes(Object.values(list));
            }
            globalActions.toggleDarkMode(preferences.darkMode);
          }
          setStatusText('All Set!');
          await sleep(1000);
          navigation.navigate('App');
        });
    } catch (error) {
      await crashlytics().recordError(new Error(error));
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
    <View style={container}>
      <StatusBar backgroundColor={signInBackground} barStyle="dark-content" />
      {statusText !== '' && (
        <SafeAreaView style={container}>
          <ActivityIndicator size="large" color={primaryColor} />
          <Text style={text}>{statusText}</Text>
        </SafeAreaView>
      )}
      <Image style={image} source={signInImage} />
      <Text style={text}>Hi there, Stranger</Text>
      <Text style={text}>Welcome to NotesApp!</Text>
      <Text style={description}>
        Login with one of the options below, and let&apos;s get you started!
      </Text>
      <GoogleSigninButton
        style={googleButton}
        size={GoogleSigninButton.Size.Wide}
        color={GoogleSigninButton.Color.Light}
        onPress={onSignIn}
        disabled={false}
      />
      {/* <Text style={description}>or</Text>
      <TouchableOpacity onPress={() => signInAnonymously()}>
        <Text style={anonText}>Sign In anonymously</Text>
      </TouchableOpacity> */}
    </View>
  );
});

SignIn.navigationOptions = () => {
  return {
    header: null,
  };
};

export default SignIn;
