import React, {memo} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {secondaryColor, black} from '../../config';
import useGlobal from '../../store';
import {useDarkMode} from '../../functions';

const LogoTitle = memo(() => {
  const [, globalActions] = useGlobal();
  const darkMode = useDarkMode();

  const styles = StyleSheet.create({
    title: {
      fontWeight: '600',
      color: darkMode ? black : secondaryColor,
      fontSize: 28,
      fontFamily: 'Product Sans',
    },
  });

  return (
    <TouchableOpacity
      onLongPress={async () => {
        globalActions.toggleDarkMode(!darkMode);
        await analytics().logEvent('toggled_dark_mode', {
          darkMode,
          time: new Date().getTime(),
        });
      }}
    >
      <Text style={styles.title}>NotesApp</Text>
    </TouchableOpacity>
  );
});

export default LogoTitle;
