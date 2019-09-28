import React, {useEffect, useState} from 'react';
import {
  ScrollView,
  StatusBar,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import useGlobal from '../../store';
import ListItem from '../../components/listItem';
import {primaryColor} from '../../config';
import LogoTitle from '../../components/title';

const addButton = require('../../../assets/add_btn.png');
const addButtonDark = require('../../../assets/add_btn_dark.png');

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
  return (
    <ScrollView
      style={{
        backgroundColor: darkMode ? '#000' : '#fff',
      }}
    >
      {/* Changing the Statusbar text to light content on Android */}
      <StatusBar backgroundColor={primaryColor} barStyle="light-content" />
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
});

export default NotesListing;
