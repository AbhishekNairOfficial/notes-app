import {StyleSheet} from 'react-native';

import {primaryColor} from '../../config';

const useStyles = () =>
  StyleSheet.create({
    container: {
      width: '100%',
      height: '100%',
      padding: 30,
      backgroundColor: primaryColor,
      alignItems: 'center',
      justifyContent: 'center',
    },
    text: {
      fontSize: 24,
      lineHeight: 28,
      fontWeight: 'bold',
      textAlign: 'center',
      fontFamily: 'Product Sans',
    },
    animationStyle: {
      height: 200,
      marginVertical: 20,
    },
  });

export default useStyles;
