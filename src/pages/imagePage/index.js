import React, {useState, useEffect, useRef, memo} from 'react';
import {View, Text, StyleSheet, StatusBar, Button} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import useGlobal from '../../store';
import {black, secondaryColor, primaryColor} from '../../config';

const ImagePage = memo(({navigation}) => {
  const [globalState] = useGlobal();
  const [darkMode, setDarkMode] = useState(globalState.darkMode);

  // Ref for action sheet
  const actionSheetRef = useRef(null);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
    // Changing the Statusbar text to light content on iOS
    if (globalState.darkMode) {
      StatusBar.setBarStyle('dark-content', true);
    } else {
      StatusBar.setBarStyle('light-content', true);
    }
    if (
      navigation.state.params.darkMode === undefined ||
      navigation.state.params.darkMode !== darkMode
    ) {
      return;
    }
    navigation.setParams({darkMode});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [globalState.darkMode]);

  const styles = StyleSheet.create({
    container: {
      height: '100%',
      backgroundColor: darkMode ? black : null,
    },
  });

  // My Functions
  const onButtonPress = () => {
    actionSheetRef.current.show();
  };

  const onActionSelected = index => {
    // Opening camera or gallery based on selection.
    if (index === 0) {
      // Camera is selected
    } else if (index === 1) {
      // Gallery is selected
    }
  };

  return (
    <View style={styles.container}>
      <Text>Hey there!</Text>
      <Text>
        Welcome to my ML experiment. This is a new experimental feature to test
        out image scanning and text recognition.
      </Text>
      <Button onPress={onButtonPress} title="Try it out!" />
      <ActionSheet
        ref={actionSheetRef}
        title="Select Image Source"
        options={['Camera', 'Gallery', 'Cancel']}
        cancelButtonIndex={2}
        onPress={onActionSelected}
      />
    </View>
  );
});

ImagePage.navigationOptions = ({navigation}) => {
  const {params = {}} = navigation.state;
  const {darkMode} = params;
  const firstTime = darkMode === undefined;

  const headerTintColor = () => {
    if (firstTime) {
      return primaryColor;
    }
    if (darkMode) {
      return black;
    }
    return secondaryColor;
  };

  return {
    headerTintColor: headerTintColor(),
  };
};

export default ImagePage;
