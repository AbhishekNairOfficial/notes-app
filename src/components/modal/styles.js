import {StyleSheet} from 'react-native';

import {
  white,
  black,
  placeHolderColorDark,
  secondaryColor,
  buttonColor,
} from '../../config';

const useStyle = darkMode =>
  StyleSheet.create({
    modalContainer: {
      alignItems: 'center',
      backgroundColor: darkMode ? black : white,
      shadowOpacity: 0.5,
      shadowRadius: 5,
      shadowColor: darkMode ? placeHolderColorDark : black,
      shadowOffset: {
        height: 1,
        width: 1,
      },
      borderRadius: 10,
      paddingTop: 20,
      position: 'absolute',
      top: 300,
      width: '90%',
      marginLeft: '5%',
    },
    modalText: {
      textAlign: 'center',
      fontFamily: 'Product Sans',
      fontSize: 19,
      padding: 20,
      color: darkMode ? white : black,
    },
    modalButtonHolder: {
      flexDirection: 'row',
      width: '100%',
      padding: 10,
      backgroundColor: secondaryColor,
      justifyContent: 'flex-end',
      alignItems: 'center',
      borderBottomLeftRadius: 10,
      borderBottomRightRadius: 10,
    },
    modalButton: {
      color: placeHolderColorDark,
      height: 50,
      padding: 25,
      paddingTop: 15,
      paddingBottom: 15,
      fontSize: 18,
      fontFamily: 'Product Sans',
      fontWeight: '600',
      letterSpacing: 0.5,
      textAlign: 'center',
    },
    primary: {
      backgroundColor: buttonColor,
      color: white,
      borderRadius: 5,
    },
  });

export default useStyle;
