import React, {useState} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {SafeAreaView} from 'react-navigation';
import {secondaryColor, primaryColor} from '../../config';
import useGlobal from '../../store';

const AuthLoadingScreen = props => {
  const {navigation} = props;
  const [token, setToken] = useState('');
  const [message, setMessage] = useState('Searching for Token!');
  const [data, setData] = useState();
  const [, globalActions] = useGlobal();

  const CheckForToken = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      setToken(value);
      if (value) {
        setTimeout(() => {
          setMessage('Found token,\nchecking for data!');
        }, 1000);
      } else {
        setMessage('No token found!,\nRedirecting to Sign up!');
        setTimeout(() => {
          navigation.navigate('Auth');
        }, 500);
      }
    } catch (e) {
      // error reading value
    }
  };

  const CheckForList = async () => {
    try {
      const value = await AsyncStorage.getItem('list');
      if (!data) {
        setData(value);
        if (value) {
          setMessage('Found data, Opening App now!');
          globalActions.addAllNotes(JSON.parse(value));
          setTimeout(() => {
            navigation.navigate('App');
          }, 1000);
          navigation.navigate('App');
        } else {
          setMessage('No Data found, redirecting to App!');
          setTimeout(() => {
            navigation.navigate('App');
          }, 1000);
        }
      }
    } catch (e) {
      // error reading value
    }
  };
  if (!token) {
    CheckForToken();
  }
  if (!data) {
    CheckForList();
  }

  return (
    <View>
      <StatusBar barStyle="default" />
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.text}>{message}</Text>
      </SafeAreaView>
    </View>
  );
};

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
  },
});

export default AuthLoadingScreen;
