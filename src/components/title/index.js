import React, {useState, useEffect, memo} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import {secondaryColor, black} from '../../config';
import useGlobal from '../../store';

const LogoTitle = memo(() => {
  const [globalState, globalActions] = useGlobal();
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
  }, [globalState]);

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
