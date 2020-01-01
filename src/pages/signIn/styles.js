import {StyleSheet, Dimensions} from 'react-native';
import {signInBackground} from '../../config';

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
    },
    text: {
      fontSize: 28,
      marginBottom: 10,
      fontFamily: 'Product Sans',
    },
    description: {
      fontSize: 18,
      fontFamily: 'Product Sans',
      margin: 15,
    },
    image: {
      width: Dimensions.get('screen').width / 2,
      height: Dimensions.get('screen').width / 2,
    },
  });

export default useStyle;
