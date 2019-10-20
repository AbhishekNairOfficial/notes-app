import React, {useState, useEffect, memo} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import {GoogleSignin, statusCodes} from 'react-native-google-signin';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView} from 'react-navigation';
import database from '@react-native-firebase/database';
import auth from '@react-native-firebase/auth';
import {secondaryColor, primaryColor} from '../../config';
import useGlobal from '../../store';

const AuthLoadingScreen = memo(props => {
  const {navigation} = props;
  const [, globalActions] = useGlobal();
  // const [data, setData] = useState();
  const [darkMode, setDarkMode] = useState();
  const [statusText, setStatusText] = useState('Loading..');
  const [userName, setUsername] = useState('');

  useEffect(() => {
    // const CheckForList = async () => {
    //   try {
    //     const value = await AsyncStorage.getItem('list');
    //     if (!data || !userName) {
    //       if (value) {
    //         setData(value);
    //         globalActions.addAllNotes(JSON.parse(value));
    //         setTimeout(() => {
    //           // navigation.navigate('App');
    //         }, 500);
    //       } else {
    //         setTimeout(() => {
    //           // navigation.navigate('App');
    //         }, 500);
    //       }
    //     }
    //   } catch (e) {
    //     // error reading value
    //   }
    // };

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
    // if (!data) {
    // CheckForList();
    // }
  }, [darkMode, globalActions]);

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

    const getCurrentUserInfo = async () => {
      try {
        const userInfo = await GoogleSignin.signInSilently();
        setUsername(userInfo.user.name);
        setStatusText(`Welcome back, ${userName}`);
        setTimeout(() => {
          navigation.navigate('App');
        }, 300);
        // Get the users ID
        const {uid} = auth().currentUser;

        // Create a reference
        const ref = database().ref(`/users/${uid}`);

        await ref.set({
          uid,
          name: userName,
          role: 'admin',
        });

        console.log('done');
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
  }, [navigation, userName]);

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
