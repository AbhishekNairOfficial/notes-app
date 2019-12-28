import React, {useEffect, useState, memo} from 'react';
import {
  StatusBar,
  Image,
  TouchableOpacity,
  Dimensions,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  FlatList,
} from 'react-native';
import ActionButton, {Item} from 'react-native-action-button';
import auth from '@react-native-firebase/auth';
import ContentLoader from 'react-native-easy-content-loader';
import analytics from '@react-native-firebase/analytics';
import {GoogleSignin} from 'react-native-google-signin';
import useGlobal from '../../store';
import ModalComponent from '../../components/modal';
import {
  black,
  white,
  primaryColor,
  placeHolderColorDark,
  buttonColor,
} from '../../config';
import LogoTitle from '../../components/title';

const ListItem = React.lazy(() => import('../../components/listItem'));

console.disableYellowBox = true;

const addButton = require('../../../assets/add_btn.png');
const addButtonDark = require('../../../assets/add_btn_dark.png');
const emptyIcon = require('../../../assets/empty_icon.png');
const emptyIconDark = require('../../../assets/empty_icon_dark.png');
const logoutIconDark = require('../../../assets/logout_icon.png');
const logoutIcon = require('../../../assets/logout_icon_dark.png');
const cameraIcon = require('../../../assets/camera_icon.svg');
const cameraIconDark = require('../../../assets/camera_icon_dark.svg');

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
      await GoogleSignin.signOut();
      await auth().signOut();
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
  const {height, width} = Dimensions.get('screen');

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
      bottom: 20,
      left: width - 76,
      shadowOpacity: 0.75,
      shadowRadius: 5,
      shadowColor: darkMode ? placeHolderColorDark : black,
      shadowOffset: {
        height: 1,
        width: 1,
      },
    },
  });

  const Loader = () => {
    return (
      <ContentLoader
        title={false}
        active
        pRows={4}
        pHeight={10}
        containerStyles={styles.loaderContainerStyle}
        pWidth={['100%', '90%', '80%', '70%']}
      />
    );
  };

  return (
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
      <FlatList
        data={globalState.list}
        renderItem={({item}) => {
          return (
            <React.Suspense fallback={<Loader />}>
              <ListItem
                key={item.id}
                id={item.id}
                title={item.title}
                body={item.body}
                navigation={navigation}
              />
            </React.Suspense>
          );
        }}
      />
      {/* Empty Condition */}
      {globalState.list.length === 0 && (
        <View
          style={{
            ...innerStyles.scrollViewStyle,
            ...innerStyles.emptyContainer,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Note', {darkMode})}
          >
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
      <ActionButton
        active
        renderIcon={() => (
          <Image
            style={styles.addButton}
            source={darkMode ? addButtonDark : addButton}
          />
        )}
        size={64}
        buttonColor={buttonColor}
      >
        <Item
          size={56}
          buttonColor={buttonColor}
          title="Scan Image"
          onPress={() => {
            const onProductView = async () => {
              await analytics().logEvent('scanned_an_image');
            };
            navigation.navigate('Image', {darkMode});
            onProductView();
          }}
        >
          <Image
            style={styles.addButton}
            source={darkMode ? cameraIconDark : cameraIcon}
          />
        </Item>
        <Item
          size={56}
          buttonColor={buttonColor}
          title="New Note"
          onPress={() => {
            const onProductView = async () => {
              await analytics().logEvent('created_a_note');
            };
            navigation.navigate('Note', {darkMode});
            onProductView();
          }}
        >
          <Image
            style={styles.addButton}
            source={darkMode ? emptyIcon : emptyIconDark}
          />
        </Item>
      </ActionButton>
    </SafeAreaView>
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
  contentContainerStyle: {
    paddingBottom: 20,
    justifyContent: 'space-between',
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
    height: 36,
    width: 36,
  },
  loaderContainerStyle: {
    padding: 10,
    height: 100,
  },
});

export default NotesListing;
