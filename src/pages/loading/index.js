import React, {useState, useEffect} from 'react';
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
  const [data, setData] = useState();
  const [, globalActions] = useGlobal();

  const CheckForToken = async () => {
    try {
      const value = await AsyncStorage.getItem('userId');
      if (token) {
        return;
      }
      if (value) {
        setToken(value);
      } else {
        navigation.navigate('Auth');
      }
    } catch (e) {
      // error reading value
    }
  };

  const CheckForList = async () => {
    try {
      const value = await AsyncStorage.getItem('list');
      if (!token) {
        return;
      }
      if (!data) {
        if (value) {
          setData(value);
          globalActions.addAllNotes(JSON.parse(value));
          navigation.navigate('App');
        } else {
          navigation.navigate('App');
        }
      }
    } catch (e) {
      // error reading value
    }
  };
  useEffect(() => {
    if (!token) {
      CheckForToken();
    }
    if (!data) {
      CheckForList();
    }
  });

  return (
    <View>
      <StatusBar barStyle="default" />
      <SafeAreaView style={styles.container}>
        <ActivityIndicator size="large" color={primaryColor} />
        <Text style={styles.text}>Loading</Text>
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
