import React, {memo} from 'react';
import {Text, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import useStyle from './styles';
import useGlobal from '../../store';
import {useDarkMode} from '../../functions';

const LogoTitle = memo(() => {
  const [, globalActions] = useGlobal();
  const darkMode = useDarkMode();
  const {title} = useStyle(darkMode);

  const onLongPress = async () => {
    globalActions.toggleDarkMode(!darkMode);
    await analytics().logEvent('toggled_dark_mode', {
      darkMode,
      time: new Date().getTime(),
    });
  };

  return (
    <TouchableOpacity onLongPress={onLongPress}>
      <Text style={title}>NotesApp</Text>
    </TouchableOpacity>
  );
});

export default LogoTitle;
