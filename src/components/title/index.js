import React, {useState, useEffect} from 'react';
import {Text, StyleSheet, TouchableOpacity} from 'react-native';
import {secondaryColor} from '../../config';
import useGlobal from '../../store';

const LogoTitle = () => {
  const [globalState, globalActions] = useGlobal();
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
  }, [globalState]);

  const styles = StyleSheet.create({
    title: {
      // fontWeight: 'bold',
      color: darkMode ? '#000' : secondaryColor,
      fontSize: 24,
      fontFamily: 'Product Sans',
    },
  });

  return (
    <TouchableOpacity onPress={() => globalActions.toggleDarkMode()}>
      <Text style={styles.title}>NotesApp</Text>
    </TouchableOpacity>
  );
};

export default LogoTitle;
