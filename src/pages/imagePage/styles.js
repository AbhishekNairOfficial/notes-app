import {StyleSheet} from 'react-native';
import {black, white, secondaryColor, buttonColor} from '../../config';

const useStyle = darkMode =>
  StyleSheet.create({
    contentContainerStyles: {
      alignItems: 'center',
      justifyContent: 'flex-start',
    },
    container: {
      height: '100%',
      backgroundColor: darkMode ? black : secondaryColor,
      padding: 20,
    },
    imageStyles: {
      height: 300,
      maxWidth: '60%',
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
      marginBottom: 50,
    },
  });

export default useStyle;
