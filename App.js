/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {createSwitchNavigator, createAppContainer} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import AuthLoadingScreen from './src/pages/loading';
import SignIn from './src/pages/signIn';
import NotesListing from './src/pages/notesListing';
import NotesPage from './src/pages/notesPage';
import ImagePage from './src/pages/imagePage';
import {primaryColor, secondaryColor} from './src/config';

const AuthStack = createStackNavigator({SignIn});
const AppStack = createStackNavigator(
  {
    Listing: NotesListing,
    Note: NotesPage,
    Image: ImagePage,
  },
  {
    initialRouteName: 'Listing',
    /* The header config from HomeScreen is now here */
    headerLayoutPreset: 'center',
    defaultNavigationOptions: {
      headerStyle: {
        backgroundColor: primaryColor,
      },
      headerTintColor: secondaryColor,
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
