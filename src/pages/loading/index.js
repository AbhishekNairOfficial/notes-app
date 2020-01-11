import React, {useState, useEffect, memo} from 'react';
import {ActivityIndicator, StatusBar, View, Text} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import database from '@react-native-firebase/database';
import perf from '@react-native-firebase/perf';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '@react-native-firebase/auth';
import {SafeAreaView} from 'react-navigation';
import {secondaryColor, primaryColor, googleConfig} from '../../config';
import useGlobal from '../../store';
import {trackScreenView, biometricAuthentication} from '../../functions';
import useStyles from './styles';

const AuthLoadingScreen = memo(props => {
  const {navigation} = props;
  const [, globalActions] = useGlobal();
  const [statusText, setStatusText] = useState('Loading..');
  const [userName, setUsername] = useState('');
  const {container, text} = useStyles();

  useEffect(() => {
    trackScreenView('LoadingPage');
  }, []);

  useEffect(() => {
    GoogleSignin.configure(googleConfig);

    const goToApp = async biometric => {
      if (biometric) {
        const authorized = await biometricAuthentication();

        if (authorized) {
          navigation.navigate('App');
        }
      } else {
        navigation.navigate('App');
      }
    };

    const getCurrentUserInfo = async () => {
      try {
        // Trying to Sign in Silently
        if (userName) {
          setStatusText(`Welcome back, ${userName}!`);
        }
        const userInfo = await firebase.auth().currentUser;

        if (userInfo) {
          // Using Firebase Performance plugin to measure time taken to sign in silently
          const trace = await perf().startTrace('silent_sign_in');
          const startTime = new Date().getTime();
          // User is signed in.
          const {_user} = userInfo;

          setUsername(_user.displayName);

          setStatusText(`Getting your data ready!`);
          const listFromStorage = await AsyncStorage.getItem('list');

          globalActions.addAllNotes(JSON.parse(listFromStorage));
          // Showing Welcome Message
          // Setting Timeout, so state update can happen, name gets populated.
          const {uid} = _user;
          const snapshot = await database()
            .ref(`/users/${uid}`)
            .once('value');
          const userProfile = snapshot.val();
          const {list, preferences} = userProfile;

          globalActions.toggleDarkMode(preferences.darkMode);
          globalActions.toggleBiometric(preferences.biometric);
          // Ending the firebase performance monitoring
          const endTime = new Date().getTime();

          trace.putAttribute('user_id', uid);
          trace.putMetric('time_taken', endTime - startTime);
          await trace.stop();
          goToApp(preferences.biometric);
          if (list) {
            await globalActions.addAllNotes(Object.values(list));
          }
        } else {
          // No user is signed in.
          navigation.navigate('Auth');
        }
      } catch (error) {
        await crashlytics().recordError(new Error(error));
        if (error.code === statusCodes.SIGN_IN_REQUIRED) {
          // user has not signed in yet
          setTimeout(() => {
            navigation.navigate('Auth');
          }, 300);
        } else {
          // some other error
          setTimeout(() => {
            navigation.navigate('Auth');
          }, 300);
        }
      }
    };

    getCurrentUserInfo();
    return () => {};
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View>
      <StatusBar backgroundColor={secondaryColor} barStyle="dark-content" />
      <SafeAreaView style={container}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={text}>{statusText}</Text>
      </SafeAreaView>
    </View>
  );
});

export default AuthLoadingScreen;
