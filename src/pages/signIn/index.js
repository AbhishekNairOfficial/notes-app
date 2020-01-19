import React, {useState, useRef, useEffect, memo} from 'react';
import {View, Text, StatusBar, SafeAreaView} from 'react-native';
import LottieView from 'lottie-react-native';
import {
  GoogleSignin,
  GoogleSigninButton,
  statusCodes,
} from 'react-native-google-signin';

import crashlytics from '@react-native-firebase/crashlytics';
import auth from '@react-native-firebase/auth';
import database from '@react-native-firebase/database';

import {signInBackground} from '../../config';
import useGlobal from '../../store';
import {trackScreenView} from '../../functions';

import useStyle from './styles';

const SignIn = memo(({navigation}) => {
  StatusBar.setBarStyle('dark-content', false);
  const [, globalActions] = useGlobal();
  const [initilizing, setInitilizing] = useState(true);
  const [statusText, setStatusText] = useState('');
  const {
    container,
    text,
    googleButton,
    description,
    image,
    animationStyle,
  } = useStyle();
  const animationRef = useRef();

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
      animationRef.current.play(0, 20);
      const {accessToken} = await GoogleSignin.getTokens();
      const credential = auth.GoogleAuthProvider.credential(
        idToken,
        accessToken,
      );
      const userInfo = await auth().signInWithCredential(credential);
      const {uid, email, displayName} = userInfo.user;

      animationRef.current.play(21, 60);
      setStatusText('Checking whether you already have used the app before..');
      // Create a reference
      const ref = database().ref(`/users/${uid}`);

      globalActions.updateUid(uid);
      // Checking whether the user already has data here
      const snapshot = await database()
        .ref(`/users/${uid}`)
        .once('value');

      const userProfile = snapshot.val();

      animationRef.current.play(61, 80);
      if (userProfile === null) {
        // User doesn't exist
        // Creating Initial State for user
        setStatusText('Creating a user profile for you...!');
        animationRef.current.play(81, 120);
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
        animationRef.current.play(81, 120);
        const {list, preferences} = userProfile;

        if (list) {
          await globalActions.addAllNotes(Object.values(list));
        }
        globalActions.toggleDarkMode(preferences.darkMode);
      }
      setStatusText('All Set!');
      await sleep(1000);
      navigation.navigate('App');
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
          <Text style={text}>{statusText}</Text>
          <LottieView
            ref={animationRef}
            style={animationStyle}
            source={require('../../../assets/download_animation.json')}
            loop={false}
          />
        </SafeAreaView>
      )}
      <LottieView
        ref={animationRef}
        style={image}
        source={require('../../../assets/welcome_animation.json')}
        loop
        autoPlay
      />
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
