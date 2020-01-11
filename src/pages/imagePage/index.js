import React, {useState, useEffect, useRef, memo, useCallback} from 'react';
import {
  ScrollView,
  Dimensions,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
} from 'react-native';
import crashlytics from '@react-native-firebase/crashlytics';
import analytics from '@react-native-firebase/analytics';
import perf from '@react-native-firebase/perf';
import ActionSheet from 'react-native-actionsheet';
import vision from '@react-native-firebase/ml-vision';
import ImagePicker from 'react-native-image-crop-picker';
import useStyle from './styles';

import {useDarkMode, trackScreenView} from '../../functions';
import {black, secondaryColor, primaryColor} from '../../config';

let wavingImage = null;

const ImagePage = memo(({navigation}) => {
  const darkMode = useDarkMode();
  const [processing, setProcessing] = useState(false);

  // Ref for action sheet
  const actionSheetRef = useRef(null);

  useEffect(() => {
    navigation.setParams({darkMode});
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [darkMode]);

  const {
    contentContainerStyles,
    container,
    imageStyles,
    mainText,
    textStyle,
    paragraph,
    button,
  } = useStyle(darkMode);

  // My Functions
  // #############################

  // Open the action sheet on press of try me button.
  const onButtonPress = () => {
    actionSheetRef.current.show();
  };

  // On selection of an action sheet item
  const onActionSelected = async index => {
    // Opening camera or gallery based on selection.
    const {height, width} = Dimensions.get('window');

    if (index === 0) {
      // Camera is selected
      const image = await ImagePicker.openCamera({
        mediaType: 'photo',
        cropping: true,
        width,
        height,
        avoidEmptySpaceAroundImage: false,
      });

      ProcessImageCallback(image.path);
    } else if (index === 1) {
      // Gallery is selected
      const image = await ImagePicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        width,
        height,
        avoidEmptySpaceAroundImage: false,
      });

      ProcessImageCallback(image.path);
    }
  };

  // The function which takes image path and returns text from it.

  const ProcessImageCallback = useCallback(
    imageSent => {
      const processImage = async image => {
        try {
          // Starting performance and analytics monitoring of the ML event
          const trace = await perf().startTrace('processed_an_image');
          const startTime = new Date().getTime();

          setProcessing(true);
          // Using the local file, process the image on the device itself
          const {text} = await vision().textRecognizerProcessImage(image);
          const endTime = new Date().getTime();
          const timeTakenToProcessImage = endTime - startTime;

          trace.putMetric('time_taken', endTime - startTime);
          await trace.stop();
          await analytics().logEvent('processed_an_image', {
            timeTakenToProcessImage,
          });
          navigation.navigate('Note', {
            body: text,
            title: '',
            darkMode,
          });
          setProcessing(false);
        } catch (error) {
          await crashlytics().recordError(new Error(error));
        }
      };

      processImage(imageSent);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [darkMode],
  );

  if (wavingImage === null) {
    wavingImage = require('../../../assets/waving_gif.gif');
  }

  useEffect(() => {
    trackScreenView('ImagesPage');
  }, []);

  return (
    <ScrollView
      contentContainerStyle={contentContainerStyles}
      style={container}
    >
      <Image
        resizeMethod="auto"
        resizeMode="center"
        style={imageStyles}
        source={wavingImage}
      />
      <Text style={[mainText, textStyle]}>Hey there!</Text>
      <Text style={[paragraph, textStyle]}>
        Welcome to my ML experiment. This is a new experimental feature to test
        out image scanning and text recognition.
      </Text>
      <Text style={[paragraph, textStyle]}>
        I would really appreciate any feedback you could send my way.
      </Text>
      <TouchableOpacity disabled={processing} onPress={onButtonPress}>
        {processing || <Text style={button}>Try it out!</Text>}
        {processing && <ActivityIndicator color={primaryColor} />}
      </TouchableOpacity>
      {/* The action sheet to show up in the bottom */}
      <ActionSheet
        ref={actionSheetRef}
        title="Select Image Source"
        options={['Camera', 'Gallery', 'Cancel']}
        cancelButtonIndex={2}
        onPress={onActionSelected}
      />
    </ScrollView>
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
