import React, {useState, useEffect} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Modal from 'react-native-modal';
import {placeHolderColorDark} from '../../config';
import useStyle from './styles';

const ModalComponent = props => {
  const {
    leftAction,
    leftButton,
    rightAction,
    rightButton = 'Cancel',
    visible,
    darkMode,
    text = 'Are you sure you want to delete this note?',
  } = props;
  const [modalVisible, setModalVisible] = useState(visible);
  const {
    modalContainer,
    modalText,
    modalButtonHolder,
    modalButton,
    primary,
  } = useStyle(darkMode);

  useEffect(() => {
    setModalVisible(visible);
  }, [visible]);

  return (
    <Modal
      animationIn="zoomInUp"
      animationInTiming={1000}
      animationOutTiming={1000}
      backdropColor={placeHolderColorDark}
      backdropOpacity={0.95}
      hideModalContentWhileAnimating
      useNativeDriver
      animationOut="zoomOutUp"
      transparent
      isVisible={modalVisible}
    >
      {/* <SafeAreaView> */}
      <View style={modalContainer}>
        <Text style={modalText}>{text}</Text>
        <View style={modalButtonHolder}>
          <TouchableOpacity onPress={leftAction}>
            <Text style={[modalButton, primary]}>{leftButton}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={rightAction}>
            <Text style={modalButton}>{rightButton}</Text>
          </TouchableOpacity>
        </View>
      </View>
      {/* </SafeAreaView> */}
    </Modal>
  );
};

export default React.memo(ModalComponent);
