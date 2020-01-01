import {StyleSheet} from 'react-native';
import {
  black,
  secondaryColor,
  white,
  placeHolderColor,
  placeHolderColorDark,
} from '../../config';

const useStyles = darkMode =>
  StyleSheet.create({
    safeAreaView: {
      backgroundColor: darkMode ? black : secondaryColor,
    },
    container: {
      height: '100%',
      padding: 20,
      alignItems: 'center',
    },
    paragraphText: {
      fontSize: 18,
      width: '100%',
    },
    settingsItemStyle: {
      flexDirection: 'row',
      paddingVertical: 10,
      width: '100%',
      justifyContent: 'space-between',
      alignItems: 'center',
    },
    hr: {
      height: 2,
      marginTop: 20,
      marginBottom: 20,
      width: '100%',
      backgroundColor: darkMode ? placeHolderColorDark : placeHolderColor,
    },
    textStyle: {
      color: darkMode ? white : black,
      fontFamily: 'Product Sans',
    },
    toggleText: {
      fontSize: 18,
    },
    logoutContainer: {
      width: '100%',
      marginTop: 'auto',
      alignItems: 'center',
      justifyContent: 'center',
    },
    logoutButton: {
      padding: 15,
      paddingLeft: 25,
      paddingRight: 25,
      color: darkMode ? black : white,
      backgroundColor: 'red',
      fontSize: 24,
    },
  });

export default useStyles;
