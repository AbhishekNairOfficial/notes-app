import React, {useEffect, useState, memo} from 'react';
import {
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Text,
  ImageBackground,
  SafeAreaView,
} from 'react-native';
import {GoogleSignin} from 'react-native-google-signin';
import useGlobal from '../../store';
import ModalComponent from '../../components/modal';
import ListItem from '../../components/listItem';
import {
  black,
  white,
  primaryColor,
  placeHolderColorDark,
  buttonColor,
} from '../../config';
import LogoTitle from '../../components/title';

const addButton = require('../../../assets/add_btn.png');
const addButtonDark = require('../../../assets/add_btn_dark.png');
const emptyIcon = require('../../../assets/empty_icon.png');
const emptyIconDark = require('../../../assets/empty_icon_dark.png');
const logoutIconDark = require('../../../assets/logout_icon.png');
const logoutIcon = require('../../../assets/logout_icon_dark.png');
const backgroundImage = require('../../../assets/listing_page_background.jpg');

const NotesListing = memo(props => {
  const [globalState, globalActions] = useGlobal();
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
      globalActions.logout();
      navigation.navigate('Auth');
    } catch (error) {
      console.error(error);
      setLogoutModalVisible(false);
    }
  };

  const cancelSignOut = () => {
    setLogoutModalVisible(false);
    navigation.setParams({
      logout: false,
    });
  };
  const {height, width} = Dimensions.get('window');

  const innerStyles = StyleSheet.create({
    safeAreaView: {
      flex: 1,
      position: 'relative',
      backgroundColor: darkMode ? black : null,
    },
    scrollViewStyle: {
      backgroundColor: darkMode ? black : null,
    },
    emptyContainer: {
      marginTop: height / 3,
      justifyContent: 'flex-start',
      backgroundColor: darkMode ? black : white,
      opacity: darkMode ? 1 : 9.5,
      alignItems: 'center',
      flex: 1,
      height,
      width,
    },
    emptyText: {
      fontSize: 22,
      color: darkMode ? white : black,
    },
    image: {
      height: 50,
      width: 50,
    },

    buttonHolder: {
      height: 56,
      width: 56,
      backgroundColor: buttonColor,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 2,
      bottom: 86,
      right: 20,
      shadowOpacity: 0.75,
      shadowRadius: 5,
      shadowColor: darkMode ? placeHolderColorDark : black,
      shadowOffset: {
        height: 1,
        width: 1,
      },
    },
  });

  return (
    <ImageBackground
      source={darkMode ? null : backgroundImage}
      imageStyle={{width, marginTop: width / 2}}
      style={{height, width}}
    >
      <SafeAreaView style={innerStyles.safeAreaView}>
        <ModalComponent
          darkMode={darkMode}
          leftButton="Logout"
          leftAction={signOut}
          rightAction={cancelSignOut}
          visible={logoutModalVisible}
          text="Are you sure you want to logout?"
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
              ...innerStyles.scrollViewStyle,
              ...innerStyles.emptyContainer,
            }}
          >
            <TouchableOpacity onPress={() => navigation.navigate('Note')}>
              <Image
                style={styles.emptyIcon}
                source={darkMode ? emptyIconDark : emptyIcon}
              />
            </TouchableOpacity>
            <Text style={innerStyles.emptyText}>No Notes found!</Text>
            <Text style={innerStyles.emptyText}>
              Click on the + icon to add a note.
            </Text>
          </View>
        )}
        {/* The floating action button */}
        <TouchableOpacity
          onPress={() => navigation.navigate('Note')}
          style={innerStyles.buttonHolder}
        >
          <Image
            style={styles.addButton}
            source={darkMode ? addButtonDark : addButton}
          />
        </TouchableOpacity>
      </SafeAreaView>
    </ImageBackground>
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
    marginRight: 10,
  },
  emptyIcon: {
    height: 52,
    width: 52,
  },
  addButton: {
    height: 40,
    width: 40,
  },
});

export default NotesListing;
