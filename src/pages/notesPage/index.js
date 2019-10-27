import React, {useState, useEffect, memo} from 'react';
import {
  View,
  TextInput,
  StyleSheet,
  ToastAndroid,
  Platform,
  ActivityIndicator,
  Text,
  Image,
  Share,
  TouchableOpacity,
  Alert,
} from 'react-native';
import useDebouncedEffect from 'use-debounced-effect';
import {NavigationEvents} from 'react-navigation';
import debounce from '../../functions';
import useGlobal from '../../store';
import {
  secondaryColor,
  black,
  placeHolderColorDark,
  placeHolderColor,
} from '../../config';

const shareIconDark = require('../../../assets/share_icon.svg');
const shareIcon = require('../../../assets/share_icon_dark.svg');

const NotesPage = memo(props => {
  const [globalState, globalActions] = useGlobal();
  const {navigation} = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  useEffect(() => {
    if (globalState.darkMode !== darkMode) {
      setDarkMode(globalState.darkMode);
    }
  }, [darkMode, globalState.darkMode]);

  // Dark mode effect
  useEffect(() => {
    const firstTimeThisEffectIsFiring = !navigation.state.params;
    if (
      firstTimeThisEffectIsFiring ||
      navigation.state.params.darkMode !== darkMode
    ) {
      navigation.setParams({
        darkMode,
      });
    }
  }, [darkMode, navigation]);

  // Sending data to header for share
  useEffect(() => {
    if (
      (navigation.state.params.title &&
        navigation.state.params.title === title) ||
      (navigation.state.params.body && navigation.state.params.body === body)
    ) {
      return;
    }
    navigation.setParams({title, body});
  }, [title, body, navigation]);

  const styles = StyleSheet.create({
    container: {
      padding: 15,
      height: '100%',
      backgroundColor: darkMode ? black : secondaryColor,
      justifyContent: 'space-between',
    },
    title: {
      fontFamily: 'Product Sans',
      fontSize: 28,
      paddingBottom: 15,
      marginBottom: 10,
      borderBottomColor: placeHolderColor,
      borderBottomWidth: 1,
      color: darkMode ? placeHolderColor : black,
    },
    body: {
      fontFamily: 'Product Sans',
      fontSize: 20,
      height: '100%',
      color: darkMode ? placeHolderColor : black,
    },
  });

  // Effect to show loader on header
  useDebouncedEffect(
    () => {
      navigation.setParams({
        saving: true,
      });
      setTimeout(() => {
        navigation.setParams({
          saving: false,
        });
      }, 500);
    },
    1000,
    [title, body],
  );

  const inputValidation = () => {
    return title || body;
  };

  const callAddNoteAction = () => {
    if (!inputValidation()) {
      return;
    }
    const newNote = {
      id,
      title,
      body,
    };
    if (!id) {
      globalActions.addNote(newNote);
    } else {
      globalActions.editNote(newNote);
    }
    if (Platform.OS === 'android') {
      ToastAndroid.show('Saved!', ToastAndroid.SHORT);
    }
    navigation.goBack();
  };
  return (
    <View style={styles.container}>
      <NavigationEvents onWillBlur={() => callAddNoteAction()} />
      <TextInput
        placeholderTextColor={
          darkMode ? placeHolderColorDark : placeHolderColor
        }
        style={styles.title}
        autoCorrect={false}
        autoFocus={!id}
        autoCapitalize="sentences"
        maxLength={25}
        onChangeText={value => debounce(setTitle(value), 1000)}
        value={title}
        placeholder="Title"
      />
      <TextInput
        placeholderTextColor={
          darkMode ? placeHolderColorDark : placeHolderColor
        }
        multiline
        textAlignVertical="top"
        autoCapitalize="sentences"
        autoCorrect={false}
        maxLength={1000}
        style={styles.body}
        onChangeText={value => debounce(setBody(value), 1000)}
        value={body}
        placeholder="Type something Here"
      />
    </View>
  );
});

NotesPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {saving, darkMode, title, body} = params;

  const onShare = async () => {
    try {
      const result = await Share.share(
        {
          message: body,
          title,
        },
        {
          // Android only:
          dialogTitle: title,
        },
      );

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };
  const styles = StyleSheet.create({
    saveHolder: {
      margin: 15,
      flexDirection: 'row',
    },
    saveText: {
      marginLeft: 5,
      color: darkMode ? black : secondaryColor,
    },
    shareIcon: {
      width: 30,
      height: 30,
    },
    shareHolder: {
      padding: 15,
      alignItems: 'center',
    },
  });
  return {
    headerRight: (
      <View>
        {saving && (
          <View style={styles.saveHolder}>
            <ActivityIndicator
              size="small"
              animating={saving}
              color={darkMode ? black : secondaryColor}
            />
            <Text style={styles.saveText}>Saving</Text>
          </View>
        )}
        {!saving && (
          <TouchableOpacity onPress={onShare} style={styles.shareHolder}>
            <Image
              resizeMode="contain"
              style={styles.shareIcon}
              source={darkMode ? shareIconDark : shareIcon}
            />
          </TouchableOpacity>
        )}
      </View>
    ),
    headerTintColor: darkMode ? black : secondaryColor,
  };
};

export default NotesPage;
