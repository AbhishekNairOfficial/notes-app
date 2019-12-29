import {StyleSheet} from 'react-native';
import {
  white,
  black,
  secondaryColor,
  placeHolderColorDark,
  placeHolderColor,
} from '../../config';

const useStyle = darkMode => {
  const styles = StyleSheet.create({
    container: {
      maxHeight: 120,
      padding: 15,
      paddingRight: 30,
      borderBottomWidth: 2,
      borderColor: darkMode ? placeHolderColorDark : placeHolderColor,
      backgroundColor: darkMode ? black : secondaryColor,
      marginLeft: 5,
      marginRight: 5,
    },
    titleStyle: {
      fontFamily: 'Product Sans',
      fontSize: 24,
      fontWeight: '600',
      marginBottom: 5,
      color: darkMode ? white : black,
    },
    description: {
      fontFamily: 'Product Sans',
      fontSize: 18,
      opacity: 0.8,
      color: darkMode ? white : black,
    },
    deleteContainer: {
      backgroundColor: 'red',
      flex: 1,
      alignItems: 'flex-end',
      justifyContent: 'center',
    },
    deleteButton: {
      fontSize: 20,
      fontFamily: 'Product Sans',
      color: white,
      margin: 10,
    },
  });
  return styles;
};

export default useStyle;
