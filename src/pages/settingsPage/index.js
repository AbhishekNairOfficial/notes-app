import React, {useState, memo, useEffect} from 'react';
import {View, Text, Switch, SafeAreaView} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import {TouchableOpacity} from 'react-native-gesture-handler';

import auth from '@react-native-firebase/auth';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';

import ModalComponent from '../../components/modal';
import useGlobal from '../../store';
import {useDarkMode, trackScreenView} from '../../functions';
import {secondaryColor, black, primaryColor} from '../../config';

import useStyles from './styles';

const SettingsPage = memo(({navigation}) => {
  const darkMode = useDarkMode();
  const [globalState, globalActions] = useGlobal();
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);
  const {
    container,
    safeAreaView,
    paragraphText,
    settingsItemStyle,
    hr,
    textStyle,
    logoutContainer,
    logoutButton,
    toggleText,
  } = useStyles(darkMode);

  useEffect(() => {
    navigation.setParams({darkMode});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  useEffect(() => {
    trackScreenView('SettingsPage');
  }, []);

  const SettingsItem = ({title, callback, value}) => (
    <View style={settingsItemStyle}>
      <Text style={[textStyle, toggleText]}>{title}</Text>
      <Switch onValueChange={callback} value={value} />
    </View>
  );

  const toggleDarkMode = value => {
    globalActions.toggleDarkMode(value);
  };

  const toggleBiometric = value => {
    globalActions.toggleBiometric(value);
  };

  const signOut = async () => {
    try {
      await GoogleSignin.signOut();
      await auth().signOut();
      globalActions.logout();
      await analytics().resetAnalyticsData();
      navigation.navigate('Auth');
    } catch (error) {
      await crashlytics().recordError(new Error(error));
    } finally {
      setLogoutModalVisible(false);
    }
  };

  const cancelSignOut = () => {
    setLogoutModalVisible(false);
    navigation.setParams({
      logout: false,
    });
  };

  return (
    <SafeAreaView style={[safeAreaView]}>
      <View style={container}>
        <Text style={[paragraphText, textStyle]}>
          Here, you&#39;ll find few options you can tweak to suit your
          experience.
        </Text>
        <View style={hr} />
        {/* The List of Options */}
        <SettingsItem
          title="Dark Mode"
          callback={toggleDarkMode}
          value={darkMode}
        />
        <SettingsItem
          title="Biometric Authentication"
          callback={toggleBiometric}
          value={globalState.biometric}
        />
        {/* <View style={hr} /> */}
        <View style={logoutContainer}>
          <TouchableOpacity onPress={() => setLogoutModalVisible(true)}>
            <Text style={[textStyle, logoutButton]}>Logout</Text>
          </TouchableOpacity>
        </View>
        <ModalComponent
          darkMode={darkMode}
          leftButton="Logout"
          leftAction={signOut}
          rightAction={cancelSignOut}
          visible={logoutModalVisible}
          text="Are you sure you want to logout?"
        />
      </View>
    </SafeAreaView>
  );
});

SettingsPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {darkMode} = params;
  const firstTime = darkMode === undefined;
  const headerTintColor = () => {
    if (firstTime) {
      return primaryColor;
    }
    if (darkMode) {
      return black;
    }
    return secondaryColor;
  };

  return {
    title: 'Settings',
    headerTitleStyle: {
      fontSize: 28,
      fontFamily: 'Product Sans',
    },
    headerTintColor: headerTintColor(),
  };
};

export default SettingsPage;
