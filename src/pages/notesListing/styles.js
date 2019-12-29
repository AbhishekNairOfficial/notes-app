import {StyleSheet, Dimensions} from 'react-native';
import {black, white, placeHolderColorDark, buttonColor} from '../../config';

const {height, width} = Dimensions.get('screen');

const useStyle = darkMode =>
  StyleSheet.create({
    safeAreaView: {
      flex: 1,
      position: 'relative',
      backgroundColor: darkMode ? black : null,
    },
    scrollViewStyle: {
      backgroundColor: darkMode ? black : null,
    },
    emptyContainer: {
      justifyContent: 'flex-start',
      backgroundColor: darkMode ? black : white,
      opacity: darkMode ? 1 : 9.5,
      alignItems: 'center',
      flex: 1,
      height,
      width,
    },
    emptyText: {
      fontSize: 22,
      color: darkMode ? white : black,
    },
    image: {
      height: 50,
      width: 50,
    },

    buttonHolder: {
      height: 56,
      width: 56,
      backgroundColor: buttonColor,
      borderRadius: 40,
      alignItems: 'center',
      justifyContent: 'center',
      position: 'absolute',
      zIndex: 2,
      bottom: 20,
      left: width - 76,
      shadowOpacity: 0.75,
      shadowRadius: 5,
      shadowColor: darkMode ? placeHolderColorDark : black,
      shadowOffset: {
        height: 1,
        width: 1,
      },
    },
    icon: {
      height: 40,
      width: 40,
    },
    contentContainerStyle: {
      paddingBottom: 20,
      justifyContent: 'space-between',
    },
    logoutIconStyle: {
      height: 30,
      width: 30,
      marginRight: 10,
    },
    emptyIconStyle: {
      height: 52,
      width: 52,
    },
    addButtonStyle: {
      height: 36,
      width: 36,
    },
    loaderContainerStyle: {
      padding: 10,
      height: 100,
    },
  });

export default useStyle;
