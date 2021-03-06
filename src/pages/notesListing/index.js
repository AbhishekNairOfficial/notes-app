import React, {useEffect, memo} from 'react';
import {
  StatusBar,
  Image,
  TouchableOpacity,
  View,
  Text,
  FlatList,
} from 'react-native';
import ActionButton, {Item} from 'react-native-action-button';
import ContentLoader from 'react-native-easy-content-loader';

import analytics from '@react-native-firebase/analytics';

import useGlobal from '../../store';
import {primaryColor, buttonColor} from '../../config';
import LogoTitle from '../../components/title';
import {useDarkMode, trackScreenView} from '../../functions';

import useStyle from './styles';

const ListItem = React.lazy(() => import('../../components/listItem'));

console.disableYellowBox = true;

let addButton = null;
let addButtonDark = null;
let emptyIcon = null;
let emptyIconDark = null;
let cameraIcon = null;
let cameraIconDark = null;

let settingsIconDark = null;
let settingsIcon = null;

const NotesListing = memo(props => {
  const [globalState] = useGlobal();
  const {navigation} = props;
  const darkMode = useDarkMode();
  const {
    safeAreaView,
    scrollViewStyle,
    emptyContainer,
    emptyText,
    addButtonStyle,
    loaderContainerStyle,
  } = useStyle(darkMode);

  useEffect(() => {
    trackScreenView('ListingPage');
  }, []);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.darkMode]);

  const Loader = () => {
    return (
      <ContentLoader
        title={false}
        active
        pRows={4}
        pHeight={10}
        containerStyles={loaderContainerStyle}
        pWidth={['100%', '90%', '80%', '70%']}
      />
    );
  };

  // Rendering icons here
  if (addButton === null) {
    addButton = require('../../../assets/add_btn.png');
  }
  if (addButtonDark === null) {
    addButtonDark = require('../../../assets/add_btn_dark.png');
  }
  if (emptyIcon === null) {
    emptyIcon = require('../../../assets/empty_icon.png');
  }
  if (emptyIconDark === null) {
    emptyIconDark = require('../../../assets/empty_icon_dark.png');
  }
  if (cameraIcon === null) {
    cameraIcon = require('../../../assets/camera_icon.svg');
  }
  if (cameraIconDark === null) {
    cameraIconDark = require('../../../assets/camera_icon_dark.svg');
  }

  return (
    <View style={safeAreaView}>
      <StatusBar
        backgroundColor={primaryColor}
        barStyle={darkMode ? 'dark-content' : 'light-content'}
      />
      <FlatList
        data={globalState.list.sort((a, b) => b.time - a.time)}
        renderItem={({item}) => {
          return (
            <React.Suspense fallback={<Loader />}>
              <ListItem
                key={item.id}
                id={item.id}
                time={item.time}
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
            ...scrollViewStyle,
            ...emptyContainer,
          }}
        >
          <TouchableOpacity
            onPress={() => navigation.navigate('Note', {darkMode})}
          >
            <Image
              style={emptyIcon}
              source={darkMode ? emptyIconDark : emptyIcon}
            />
          </TouchableOpacity>
          <Text style={emptyText}>No Notes found!</Text>
          <Text style={emptyText}>Click on the + icon to add a note.</Text>
        </View>
      )}
      {/* The floating action button */}
      <ActionButton
        active
        renderIcon={() => (
          <Image
            style={addButtonStyle}
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
            style={addButtonStyle}
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
            style={addButtonStyle}
            source={darkMode ? emptyIcon : emptyIconDark}
          />
        </Item>
      </ActionButton>
    </View>
  );
});

NotesListing.navigationOptions = ({navigation}) => ({
  title: 'NotesApp',
  headerTitle: <LogoTitle />,
  headerRight: () => {
    const darkMode = navigation.state.params
      ? navigation.state.params.darkMode
      : false;

    if (settingsIconDark === null) {
      settingsIconDark = require('../../../assets/settings_icon_dark.svg');
    }
    if (settingsIcon === null) {
      settingsIcon = require('../../../assets/settings_icon.svg');
    }
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const {logoutIconStyle} = useStyle(darkMode);

    return (
      <TouchableOpacity
        onPress={() => {
          navigation.navigate('Settings', {darkMode});
        }}
      >
        <Image
          style={logoutIconStyle}
          source={darkMode ? settingsIconDark : settingsIcon}
        />
      </TouchableOpacity>
    );
  },
});

export default NotesListing;
