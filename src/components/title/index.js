import React, {memo} from 'react';
import {Text} from 'react-native';

import {useDarkMode} from '../../functions';

import useStyle from './styles';

const LogoTitle = memo(() => {
  const darkMode = useDarkMode();
  const {title} = useStyle(darkMode);

  return <Text style={title}>NotesApp</Text>;
});

export default LogoTitle;
