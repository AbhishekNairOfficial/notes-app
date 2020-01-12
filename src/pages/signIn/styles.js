import {StyleSheet, Dimensions, PixelRatio} from 'react-native';
import {signInBackground} from '../../config';
import {elevationShadowStyle} from '../../functions';

const useStyle = () =>
  StyleSheet.create({
    container: {
      height: '100%',
      padding: 20,
      paddingTop: Dimensions.get('screen').height / 5,
      alignItems: 'center',
      justifyContent: 'flex-start',
      backgroundColor: signInBackground,
    },
    googleButton: {
      width: 312,
      height: 48,
      ...elevationShadowStyle(3),
    },
    text: {
      fontSize: PixelRatio.get() > 1.5 ? 28 : 24,
      marginBottom: 10,
      fontFamily: 'Product Sans',
    },
    description: {
      fontSize: PixelRatio.get() > 1.5 ? 18 : 26,
      fontFamily: 'Product Sans',
      textAlign: 'center',
      margin: 15,
    },
    image: {
      ...elevationShadowStyle(3),
      marginBottom: 20,
      width: Dimensions.get('screen').width / 2,
      height: Dimensions.get('screen').width / 2,
    },
    animationStyle: {
      height: 300,
    },
  });

export default useStyle;
