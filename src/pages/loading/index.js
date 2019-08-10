import React from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  View,
  Text,
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { SafeAreaView } from 'react-navigation';
import { secondaryColor } from '../../config';

const AuthLoadingScreen = props => {
  const { navigation } = props;
  // Fetch the token from storage then navigate to our appropriate place
  const CheckForToken = async () => {
    try {
      // This will switch to the App screen or Auth screen and this loading
      // screen will be unmounted and thrown away.
      const value = await AsyncStorage.getItem('userId');
      navigation.navigate(value ? 'App' : 'Auth');
    } catch (e) {
      // error reading value
    }
  };
  CheckForToken();

  return (
    <View>
      <ActivityIndicator />
      <StatusBar barStyle="default" />
      <SafeAreaView style={styles.container}>
        <Text style={styles.text}>Loading.....</Text>
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
    fontSize: 32,
    fontWeight: 'bold',
  },
});

export default AuthLoadingScreen;
