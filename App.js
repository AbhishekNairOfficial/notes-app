/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow
 */

import {
  createSwitchNavigator,
  createStackNavigator,
  createAppContainer,
} from 'react-navigation';
import AuthLoadingScreen from './src/pages/loading';
import SignIn from './src/pages/signIn';
import NotesListing from './src/pages/notesListing';
import NotesPage from './src/pages/notesPage';

const AuthStack = createStackNavigator({ SignIn: SignIn });
const AppStack = createStackNavigator({
  Listing: NotesListing,
  Note: NotesPage,
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
