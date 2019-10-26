import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {
  white,
  black,
  placeHolderColorDark,
  secondaryColor,
  buttonColor,
} from '../../config';

const ModalComponent = ({
  leftAction,
  leftButton,
  rightAction,
  rightButton = 'Cancel',
  visible,
  darkMode,
  text = 'Are you sure you want to delete this note?',
}) => {
  const [modalVisible, setModalVisible] = useState(visible);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  const styles = StyleSheet.create({
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

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <SafeAreaView>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{text}</Text>
          <View style={styles.modalButtonHolder}>
            <TouchableOpacity onPress={leftAction}>
              <Text style={[styles.modalButton, styles.primary]}>
                {leftButton}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={rightAction}>
              <Text style={styles.modalButton}>{rightButton}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>
    </Modal>
  );
};

export default React.memo(ModalComponent);
