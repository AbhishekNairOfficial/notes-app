import {StyleSheet} from 'react-native';
import {black, placeHolderColor, secondaryColor} from '../../config';

const useStyle = darkMode =>
  StyleSheet.create({
    flex: {
      flex: 1,
    },
    safeAreaView: {
      flex: 1,
      position: 'relative',
      backgroundColor: darkMode ? black : secondaryColor,
    },
    container: {
      padding: 15,
      backgroundColor: darkMode ? black : secondaryColor,
      height: '100%',
    },
    scrollView: {
      paddingBottom: 20,
      justifyContent: 'space-between',
    },
    titleStyle: {
      fontFamily: 'Product Sans',
      fontSize: 28,
      paddingBottom: 15,
      marginBottom: 10,
      borderBottomColor: placeHolderColor,
      borderBottomWidth: 1,
      color: darkMode ? placeHolderColor : black,
    },
    bodyStyle: {
      fontFamily: 'Product Sans',
      fontSize: 20,
      height: '100%',
      color: darkMode ? placeHolderColor : black,
    },
    saveHolder: {
      margin: 15,
      flexDirection: 'row',
    },
    saveText: {
      marginLeft: 5,
      color: darkMode ? black : secondaryColor,
    },
    shareIconStyle: {
      width: 30,
      height: 30,
    },
    shareHolder: {
      padding: 15,
      alignItems: 'center',
    },
  });

export default useStyle;
