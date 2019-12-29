import {StyleSheet} from 'react-native';
import {secondaryColor} from '../../config';

const useStyles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      padding: 30,
      backgroundColor: secondaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Product Sans',
    },
  });

export default useStyles;
