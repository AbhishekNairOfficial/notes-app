import React, {useState, useEffect, memo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import database from '@react-native-firebase/database';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import {firebase} from '@react-native-firebase/auth';
import {SafeAreaView} from 'react-navigation';
import {secondaryColor, primaryColor, googleConfig} from '../../config';
import useGlobal from '../../store';

const AuthLoadingScreen = memo(props => {
  const {navigation} = props;
  const [globalState, globalActions] = useGlobal();
  // const [data, setData] = useState();
  const [darkMode, setDarkMode] = useState();
  const [statusText, setStatusText] = useState('Loading..');
  const [userName, setUsername] = useState('');

  useEffect(() => {
    const CheckForDarkMode = async () => {
      try {
        const darkModeFromAsyncStorage =
          (await AsyncStorage.getItem('darkMode')) === 'true';
        if (darkModeFromAsyncStorage) {
          setDarkMode(darkModeFromAsyncStorage);
          globalActions.toggleDarkMode(darkModeFromAsyncStorage);
        }
      } catch (e) {
        // error reading value
      }
    };

    if (!darkMode) {
      CheckForDarkMode();
    }
  }, [darkMode, globalActions]);

  useEffect(() => {
    GoogleSignin.configure(googleConfig);

    const getCurrentUserInfo = async () => {
      try {
        // Trying to Sign in Silently
        if (userName) {
          setStatusText(`Welcome back, ${userName}!`);
          return;
        }
        const userInfo = await firebase.auth().currentUser;
        if (userInfo) {
          // User is signed in.
          const {_user} = userInfo;
          setUsername(_user.displayName);
          if (globalState.list.length === 0) {
            setStatusText(`Getting your data ready!`);
            const listFromStorage = await AsyncStorage.getItem('list');
            globalActions.addAllNotes(JSON.parse(listFromStorage));
            // Showing Welcome Message
            // Setting Timeout, so state update can happen, name gets populated.
            navigation.navigate('App');
            const {uid} = _user;
            const snapshot = await database()
              .ref(`/users/${uid}`)
              .once('value');
            const userProfile = snapshot.val();
            const {list} = userProfile;
            if (list) {
              await globalActions.addAllNotes(Object.values(list));
            }
          }
        } else {
          // No user is signed in.
          navigation.navigate('Auth');
        }
      } catch (error) {
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
  }, [globalActions, globalState.list, navigation, userName]);

  return (
    <View>
      <StatusBar barStyle="default" />
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.text}>{statusText}</Text>
      </SafeAreaView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: '100%',
    padding: 30,
    backgroundColor: secondaryColor,
    alignItems: 'center',
    justifyContent: 'center',
  },
  text: {
    fontSize: 28,
    fontWeight: 'bold',
    textAlign: 'center',
    fontFamily: 'Product Sans',
  },
});

export default AuthLoadingScreen;
