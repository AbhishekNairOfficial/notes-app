import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
  View,
  Text,
} from 'react-native';
import useGlobal from '../../store';
import ListItem from '../../components/listItem';
import {black, white, primaryColor} from '../../config';
import LogoTitle from '../../components/title';

const addButton = require('../../../assets/add_btn.png');
const addButtonDark = require('../../../assets/add_btn_dark.png');
const emptyIcon = require('../../../assets/empty_icon.png');
const emptyIconDark = require('../../../assets/empty_icon_dark.png');

const NotesListing = props => {
  const [globalState] = useGlobal();
  const {navigation} = props;
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
  }, [globalState.darkMode]);

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

  // Changing the Statusbar text to light content on iOS
  StatusBar.setBarStyle('light-content', true);

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
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
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
};

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
});

const styles = StyleSheet.create({
  icon: {
    height: 40,
    width: 40,
  },
  emptyIcon: {
    height: 52,
    width: 52,
  },
});

export default NotesListing;
