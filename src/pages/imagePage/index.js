import React, {useState, useEffect, useRef, memo} from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import ActionSheet from 'react-native-actionsheet';
import vision from '@react-native-firebase/ml-vision';
import ImagePicker from 'react-native-image-crop-picker';
import useGlobal from '../../store';
import {
  black,
  secondaryColor,
  primaryColor,
  white,
  buttonColor,
} from '../../config';

const wavingImage = require('../../../assets/waving_gif.gif');

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
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: 20,
    },
    imageStyles: {
      height: 300,
    },
    mainText: {
      fontSize: 28,
    },
    text: {
      padding: 20,
      paddingTop: 0,
      fontFamily: 'Product Sans',
      color: darkMode ? white : black,
    },
    paragraph: {
      fontSize: 20,
    },
    button: {
      height: 50,
      marginTop: 20,
      padding: 25,
      paddingTop: 15,
      paddingBottom: 15,
      fontSize: 18,
      fontFamily: 'Product Sans',
      fontWeight: '600',
      letterSpacing: 0.5,
      textAlign: 'center',
      backgroundColor: buttonColor,
      color: white,
      borderRadius: 5,
    },
  });

  // My Functions
  const onButtonPress = () => {
    actionSheetRef.current.show();
  };

  const onActionSelected = async index => {
    // Opening camera or gallery based on selection.
    if (index === 0) {
      // Camera is selected
      const image = await ImagePicker.openCamera({
        width: 300,
        height: 400,
        cropping: true,
      });
      processImage(image.path);
    } else if (index === 1) {
      // Gallery is selected
      const image = await ImagePicker.openPicker({
        width: 300,
        height: 400,
        cropping: true,
      });
      processImage(image.path);
    }
  };

  const processImage = async image => {
    try {
      // Using the local file, process the image on the cloud image processor
      const {text} = await vision().textRecognizerProcessImage(image);
      navigation.navigate('Note', {
        body: text,
        title: '',
        darkMode,
      });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <View style={styles.container}>
      <Image
        resizeMethod="auto"
        resizeMode="center"
        style={styles.imageStyles}
        source={wavingImage}
      />
      <Text style={[styles.mainText, styles.text]}>Hey there!</Text>
      <Text style={[styles.paragraph, styles.text]}>
        Welcome to my ML experiment. This is a new experimental feature to test
        out image scanning and text recognition.
      </Text>
      <Text style={[styles.paragraph, styles.text]}>
        I would really appreciate any feedback you could send my way.
      </Text>
      <TouchableOpacity onPress={onButtonPress}>
        <Text style={styles.button}>Try it out!</Text>
      </TouchableOpacity>
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
