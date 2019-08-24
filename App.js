/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Image, StyleSheet} from 'react-native';
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import {TouchableOpacity} from 'react-native-gesture-handler';
import AuthLoadingScreen from './src/pages/loading';
import SignIn from './src/pages/signIn';
import NotesListing from './src/pages/notesListing';
import NotesPage from './src/pages/notesPage';
import {primaryColor, secondaryColor} from './src/config';

const addButton = require('./assets/add_btn.png');

const AuthStack = createStackNavigator({SignIn});
const AppStack = createStackNavigator(
  {
    Listing: {
      screen: NotesListing,
      navigationOptions: navigation => ({
        title: 'NotesApp',
        headerRight: (
          <TouchableOpacity
            onPress={() => navigation.navigation.navigate('Note')}
          >
            <Image style={styles.icon} source={addButton} />
          </TouchableOpacity>
        ),
      }),
    },
    Note: NotesPage,
  },
  {
    initialRouteName: 'Listing',
    /* The header config from HomeScreen is now here */
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: primaryColor,
      },
      headerTintColor: secondaryColor,
      headerTitleStyle: {
        fontWeight: 'bold',
        color: secondaryColor,
        fontSize: 24,
        fontFamily: 'Product Sans',
      },
    },
  },
);

const styles = StyleSheet.create({
  icon: {
    height: 40,
    width: 40,
  },
});

export default createAppContainer(
  createSwitchNavigator(
    {
      AuthLoading: AuthLoadingScreen,
      App: AppStack,
      Auth: AuthStack,
    },
    {
      initialRouteName: 'AuthLoading',
    },
  ),
);
