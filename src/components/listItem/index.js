import React, {memo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  SafeAreaView,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import useGlobal from '../../store';
import {white, black, primaryColor} from '../../config';

const renderLeftActions = styles => {
  return (
    <View style={styles.deleteContainer}>
      <Text style={styles.deleteButton}>Delete</Text>
    </View>
  );
};

const ListItem = memo(props => {
  const [globalState, globalActions] = useGlobal();
  const {id, title, body, navigation} = props;
  const [ref, updateRef] = useState('');
  const [darkMode, setDarkMode] = useState(globalState.darkMode);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    setDarkMode(globalState.darkMode);
  }, [globalState]);

  const styles = StyleSheet.create({
    container: {
      width: '100%',
      height: 80,
      padding: 15,
      borderWidth: 1,
      borderColor: darkMode ? '#111' : '#ccc',
      backgroundColor: darkMode ? black : white,
    },
    title: {
      fontFamily: 'Product Sans',
      fontSize: 20,
      color: darkMode ? white : black,
    },
    description: {
      fontFamily: 'Product Sans',
      fontSize: 16,
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

  const deletePressed = () => {
    globalActions.deleteNote(id);
  };
  const cancelPressed = () => {
    setModalVisible(false);
  };

  return (
    <>
      {/* The delete modal window */}
      <Modal animationType="slide" transparent visible={modalVisible}>
        <SafeAreaView>
          <View style={styles.modalContainer}>
            <Text style={styles.modalText}>
              Are you sure you want to delete this note?
            </Text>
            <View style={styles.modalButtonHolder}>
              <TouchableOpacity onPress={deletePressed}>
                <Text style={styles.modalButton}>Delete</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={cancelPressed}>
                <Text style={styles.modalButton}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </SafeAreaView>
      </Modal>
      {/* The list Item Component */}
      <Swipeable
        ref={updatedRef => {
          updateRef(updatedRef);
        }}
        onSwipeableRightOpen={() => {
          setModalVisible(true);
          ref.close();
        }}
        renderRightActions={() => renderLeftActions(styles)}
      >
        <TouchableOpacity
          onPress={() =>
            navigation.navigate('Note', {
              title,
              body,
              id,
            })
          }
        >
          <View style={styles.container}>
            <Text style={styles.title}>{title}</Text>
            <Text style={styles.description}>{body}</Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </>
  );
});

export default ListItem;
