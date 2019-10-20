import React, {useEffect, useState, memo} from 'react';
import {
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import useGlobal from '../../store';
import ModalComponent from '../../components/modal';
import ListItem from '../../components/listItem';
import {black, white, primaryColor} from '../../config';
import LogoTitle from '../../components/title';

const addButton = require('../../../assets/add_btn.png');
const addButtonDark = require('../../../assets/add_btn_dark.png');
const emptyIcon = require('../../../assets/empty_icon.png');
const emptyIconDark = require('../../../assets/empty_icon_dark.png');
const logoutIconDark = require('../../../assets/logout_icon.png');
const logoutIcon = require('../../../assets/logout_icon_dark.png');

const NotesListing = memo(props => {
  const [globalState] = useGlobal();
  const {navigation} = props;
  const [darkMode, setDarkMode] = useState(globalState.darkMode);
  const [logoutModalVisible, setLogoutModalVisible] = useState(false);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
    // Changing the Statusbar text to light content on iOS
    if (globalState.darkMode) {
      StatusBar.setBarStyle('dark-content', true);
    } else {
      StatusBar.setBarStyle('light-content', true);
    }
  }, [globalState.darkMode]);

  useEffect(() => {
    const {logout} = navigation.state.params
      ? navigation.state.params
      : {logout: false};
    if (logout) {
      setLogoutModalVisible(true);
    }
  }, [navigation.state.params]);

  useEffect(() => {
    const firstTimePageIsLoading = !navigation.state.params;
    const itHasNotChanged = firstTimePageIsLoading
      ? true
      : navigation.state.params.darkMode === globalState.darkMode;
    if (!itHasNotChanged || firstTimePageIsLoading) {
      navigation.setParams({
        darkMode: globalState.darkMode,
      });
    }
  }, [globalState.darkMode, navigation]);

  const signOut = async () => {
    try {
      await GoogleSignin.revokeAccess();
      await GoogleSignin.signOut();
      setLogoutModalVisible(false);
      navigation.navigate('Auth');
    } catch (error) {
      console.error(error);
      setLogoutModalVisible(false);
    }
  };

  const cancelSignOut = () => {
    setLogoutModalVisible(false);
  };

  const innerStyles = StyleSheet.create({
    scrollViewStyle: {
      backgroundColor: darkMode ? black : white,
    },
    emptyContainer: {
      justifyContent: 'center',
      alignItems: 'center',
      flex: 1,
      height: '100%',
      width: '100%',
    },
    emptyText: {
      fontSize: 22,
      color: darkMode ? white : black,
    },
    image: {
      height: 50,
      width: 50,
    },
  });

  return (
    <>
      <ModalComponent
        darkMode={darkMode}
        leftButton="Delete"
        leftAction={signOut}
        rightAction={cancelSignOut}
        visible={logoutModalVisible}
      />
      <StatusBar
        backgroundColor={primaryColor}
        barStyle={darkMode ? 'dark-content' : 'light-content'}
      />
      {globalState.list.length > 0 && (
        <ScrollView style={innerStyles.scrollViewStyle}>
          {/* Changing the Statusbar text to light content on Android */}
          {globalState.list.map((note, key) => {
            return (
              <ListItem
                key={key}
                id={note.id}
                title={note.title}
                body={note.body}
                navigation={navigation}
              />
            );
          })}
        </ScrollView>
      )}
      {/* Empty Condition */}
      {globalState.list.length === 0 && (
        <View
          style={{
            ...innerStyles.emptyContainer,
            ...innerStyles.scrollViewStyle,
          }}
        >
          <Image
            style={styles.emptyIcon}
            source={darkMode ? emptyIconDark : emptyIcon}
          />
          <Text style={innerStyles.emptyText}>No Notes found!</Text>
          <Text style={innerStyles.emptyText}>
            Click on the + icon to add a note.
          </Text>
        </View>
      )}
    </>
  );
});

NotesListing.navigationOptions = ({navigation}) => ({
  title: 'NotesApp',
  headerTitle: <LogoTitle />,
  headerRight: () => {
    const darkMode = navigation.state.params
      ? navigation.state.params.darkMode
      : false;
    return (
      <TouchableOpacity onPress={() => navigation.navigate('Note')}>
        <Image
          style={styles.icon}
          source={darkMode ? addButtonDark : addButton}
        />
      </TouchableOpacity>
    );
  },
  headerLeft: () => {
    const darkMode = navigation.state.params
      ? navigation.state.params.darkMode
      : false;
    return (
      <TouchableOpacity
        onPress={() => {
          navigation.setParams({
            logout: true,
          });
        }}
      >
        <Image
          style={styles.logoutIcon}
          source={darkMode ? logoutIconDark : logoutIcon}
        />
      </TouchableOpacity>
    );
  },
});

const styles = StyleSheet.create({
  icon: {
    height: 40,
    width: 40,
  },
  logoutIcon: {
    height: 30,
    width: 30,
    marginLeft: 10,
  },
  emptyIcon: {
    height: 52,
    width: 52,
  },
});

export default NotesListing;
