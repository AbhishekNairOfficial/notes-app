import {StyleSheet} from 'react-native';
import {secondaryColor, black} from '../../config';

const useStyle = darkMode =>
  StyleSheet.create({
    title: {
      fontWeight: '600',
      color: darkMode ? black : secondaryColor,
      fontSize: 28,
      fontFamily: 'Product Sans',
    },
  });

export default useStyle;
