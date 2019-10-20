import React, {useState, useEffect} from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {primaryColor, white, black} from '../../config';

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
      shadowOffset: {width: 5, height: 15},
      backgroundColor: primaryColor,
      shadowColor: darkMode ? null : '#ccc',
      shadowOpacity: 1.0,
      borderRadius: 10,
      padding: 20,
      position: 'absolute',
      top: 300,
      width: '90%',
      marginLeft: '5%',
    },
    modalText: {
      textAlign: 'center',
      fontFamily: 'Product Sans',
      fontSize: 19,
      color: !darkMode ? white : black,
    },
    modalButtonHolder: {
      marginTop: 10,
      flexDirection: 'row',
      width: '100%',
      justifyContent: 'space-around',
    },
    modalButton: {
      color: !darkMode ? white : black,
      height: 50,
      padding: 20,
      paddingBottom: 0,
      fontSize: 24,
    },
  });

  return (
    <Modal animationType="slide" transparent visible={modalVisible}>
      <SafeAreaView>
        <View style={styles.modalContainer}>
          <Text style={styles.modalText}>{text}</Text>
          <View style={styles.modalButtonHolder}>
            <TouchableOpacity onPress={leftAction}>
              <Text style={styles.modalButton}>{leftButton}</Text>
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
