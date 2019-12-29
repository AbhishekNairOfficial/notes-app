import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import analytics from '@react-native-firebase/analytics';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import useGlobal from '../../store';
import ModalComponent from '../modal';
import {useDarkMode} from '../../functions';
import useStyle from './styles';

const ListItem = memo(props => {
  const [, globalActions] = useGlobal();
  const {id, title, body, navigation} = props;
  const [ref, updateRef] = useState('');
  const darkMode = useDarkMode();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    container,
    titleStyle,
    description,
    deleteContainer,
    deleteButton,
  } = useStyle(darkMode);

  const renderRightActions = () => {
    return (
      <View style={deleteContainer}>
        <Text style={deleteButton}>Delete</Text>
      </View>
    );
  };

  const deletePressed = async () => {
    globalActions.deleteNote(id);
    await analytics().logEvent('deleted_a_note');
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
        renderRightActions={renderRightActions}
      >
        <TouchableOpacity
          activeOpacity={1}
          onPress={() =>
            navigation.navigate('Note', {
              title,
              body,
              id,
              darkMode,
            })
          }
        >
          <View style={container}>
            <Text style={titleStyle}>{title}</Text>
            <Text numberOfLines={2} style={description}>
              {body}
            </Text>
          </View>
        </TouchableOpacity>
      </Swipeable>
    </>
  );
});

export default ListItem;
