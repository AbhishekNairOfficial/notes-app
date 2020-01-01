import React, {memo} from 'react';
import {Text} from 'react-native';
import useStyle from './styles';
import {useDarkMode} from '../../functions';

const LogoTitle = memo(() => {
  const darkMode = useDarkMode();
  const {title} = useStyle(darkMode);

  return <Text style={title}>NotesApp</Text>;
});

export default LogoTitle;
