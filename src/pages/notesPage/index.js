import React, {useState, useCallback, useEffect, memo} from 'react';
import {
  View,
  TextInput,
  Platform,
  ActivityIndicator,
  Text,
  AppState,
  Image,
  ScrollView,
  KeyboardAvoidingView,
  Share,
  TouchableOpacity,
  Alert,
  Keyboard,
  SafeAreaView,
} from 'react-native';
import Toast from 'react-native-simple-toast';
import analytics from '@react-native-firebase/analytics';
import crashlytics from '@react-native-firebase/crashlytics';
import useDebouncedEffect from 'use-debounced-effect';
import {NavigationEvents} from 'react-navigation';
import {debounce, useDarkMode, trackScreenView} from '../../functions';
import useGlobal from '../../store';
import useStyle from './styles';
import {
  secondaryColor,
  black,
  placeHolderColorDark,
  placeHolderColor,
  primaryColor,
} from '../../config';

let shareIconDark = null;
let shareIcon = null;

const NotesPage = memo(props => {
  const [, globalActions] = useGlobal();
  const {navigation} = props;
  const id = navigation.getParam('id');
  const [title, setTitle] = useState(navigation.getParam('title'));
  const [body, setBody] = useState(navigation.getParam('body'));
  const darkMode = useDarkMode();
  const {
    flex,
    safeAreaView,
    container,
    scrollView,
    titleStyle,
    bodyStyle,
  } = useStyle(darkMode);

  useEffect(() => {
    trackScreenView('NotesPage');
  }, []);

  // Sending data to header for share
  // Also, sending dark mode
  useEffect(() => {
    if (!title || !body) {
      return;
    }
    if (
      (navigation.state.params.title &&
        navigation.state.params.title === title) ||
      (navigation.state.params.body && navigation.state.params.body === body) ||
      navigation.state.params.darkMode === undefined ||
      navigation.state.params.darkMode !== darkMode
    ) {
      return;
    }
    navigation.setParams({title, body, darkMode});
  }, [title, body, navigation, darkMode]);

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

  const callAddNoteAction = useCallback(
    nextAppState => {
      const appIsActive = nextAppState === 'active';
      if (appIsActive) {
        // When you return from multi tasking, back to the app.
        // No need to save again.
        return;
      }
      const inputValidation = () => {
        return title || body;
      };
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
      if (!nextAppState) {
        // Only navigate back when this event is caused by navigation, not by multitasking
        Toast.show('Saved!', Toast.LONG);
        navigation.goBack();
      }
    },
    [body, globalActions, id, navigation, title],
  );

  useEffect(() => {
    AppState.addEventListener('change', callAddNoteAction);
    return () => AppState.removeEventListener('change', callAddNoteAction);
  }, [callAddNoteAction]);

  return (
    <SafeAreaView style={safeAreaView}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
        style={flex}
      >
        <ScrollView
          onScrollEndDrag={() => Keyboard.dismiss()}
          keyboardDismissMode="on-drag"
          style={container}
          contentContainerStyle={scrollView}
        >
          <NavigationEvents onWillBlur={() => callAddNoteAction()} />
          <TextInput
            placeholderTextColor={
              darkMode ? placeHolderColorDark : placeHolderColor
            }
            style={titleStyle}
            autoCorrect={false}
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
            autoFocus={!id}
            multiline
            textAlignVertical="top"
            autoCapitalize="sentences"
            autoCorrect={false}
            maxLength={1000}
            style={bodyStyle}
            onChangeText={value => debounce(setBody(value), 1000)}
            value={body}
            placeholder="Type something Here"
          />
          <View style={flex} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
});

NotesPage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {saving, darkMode, title, body} = params;
  const firstTime = darkMode === undefined;
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const {saveHolder, saveText, shareHolder, shareIconStyle} = useStyle(
    darkMode,
  );

  // Rendering the icons here when needed
  if (shareIcon === null) {
    shareIcon = require('../../../assets/share_icon_dark.svg');
  }
  if (shareIconDark === null) {
    shareIconDark = require('../../../assets/share_icon.svg');
  }

  const headerTintColor = () => {
    if (firstTime) {
      return primaryColor;
    }
    if (darkMode) {
      return black;
    }
    return secondaryColor;
  };
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
        await analytics().logEvent('shared_a_note');
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      await crashlytics().recordError(new Error(error));
      Alert.alert(error.message);
    }
  };

  return {
    headerRight: (
      <>
        {saving && (
          <View style={saveHolder}>
            <ActivityIndicator
              size="small"
              animating={saving}
              color={darkMode ? black : secondaryColor}
            />
            <Text style={saveText}>Saved</Text>
          </View>
        )}
        {!saving && (
          <TouchableOpacity onPress={onShare} style={shareHolder}>
            {!firstTime && (
              <Image
                resizeMode="contain"
                style={shareIconStyle}
                source={darkMode ? shareIconDark : shareIcon}
              />
            )}
          </TouchableOpacity>
        )}
      </>
    ),
    headerTintColor: headerTintColor(),
  };
};

export default NotesPage;
