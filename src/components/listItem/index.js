import React, {memo, useState, useEffect} from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  // Modal,
  // SafeAreaView,
} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import useGlobal from '../../store';
import ModalComponent from '../modal';
import {white, black} from '../../config';

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
      maxHeight: 120,
      padding: 15,
      paddingLeft: 20,
      paddingRight: 30,
      borderWidth: 2,
      borderColor: darkMode ? '#111' : '#ccc',
      backgroundColor: darkMode ? black : white,
    },
    title: {
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

  const deletePressed = () => {
    globalActions.deleteNote(id);
  };
  const cancelPressed = () => {
    setModalVisible(false);
  };

  return (
    <>
      <ModalComponent
        darkMode={darkMode}
        leftButton="Delete"
        leftAction={deletePressed}
        rightAction={cancelPressed}
        visible={modalVisible}
      />
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
            <Text numberOfLines={2} style={styles.description}>
              {body}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </>
  );
});

export default ListItem;
