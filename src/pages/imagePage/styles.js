import {StyleSheet} from 'react-native';
import {black, white, buttonColor} from '../../config';

const useStyle = darkMode =>
  StyleSheet.create({
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
    textStyle: {
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

export default useStyle;
