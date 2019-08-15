/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import React from 'react';
import {Button} from 'react-native';
import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';

import AuthLoadingScreen from './src/pages/loading';
import SignIn from './src/pages/signIn';
import NotesListing from './src/pages/notesListing';
import NotesPage from './src/pages/notesPage';
import {primaryColor, secondaryColor} from './src/config';

const AuthStack = createStackNavigator({SignIn});
const AppStack = createStackNavigator(
  {
    Listing: {
      screen: NotesListing,
      navigationOptions: navigation => ({
        title: 'NotesApp',
        headerRight: (
          <Button
            onPress={() => navigation.navigation.navigate('Note')}
            title="Add"
            color={secondaryColor}
          />
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
