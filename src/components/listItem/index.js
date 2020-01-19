import React, {memo, useState} from 'react';
import {View, Text, TouchableOpacity} from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';

import analytics from '@react-native-firebase/analytics';

import useGlobal from '../../store';
import ModalComponent from '../modal';
import {useDarkMode} from '../../functions';

import useStyle from './styles';

const ListItem = memo(props => {
  const [, globalActions] = useGlobal();
  const {id, title, body, time, navigation} = props;
  const [ref, updateRef] = useState('');
  const darkMode = useDarkMode();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    container,
    titleStyle,
    description,
    deleteContainer,
    deleteButton,
    dateStyle,
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

  const getTimeString = lastEditedTime => {
    if (!lastEditedTime) {
      return;
    }
    // Time definitions
    const d = new Date();
    const timeAtMidnightToday = d.setHours(0, 0, 0, 0);
    const timeAtMidnightYesterday = d.setDate(
      new Date(timeAtMidnightToday).getDate() - 1,
    );
    const timeOfOneWeekAgo = d.setDate(new Date().getDate() - 7);

    if (lastEditedTime >= timeAtMidnightToday) {
      // Today
      return 'Today';
    }
    if (lastEditedTime >= timeAtMidnightYesterday) {
      // Yesterday
      return 'Yesterday';
    }
    if (lastEditedTime >= timeOfOneWeekAgo) {
      // Within a week
      const arrayOfDays = [
        'Sunday',
        'Monday',
        'Tuesday',
        'Wednesday',
        'Thursday',
        'Friday',
        'Saturday',
      ];

      return arrayOfDays[new Date(lastEditedTime).getDay()];
    }
    // A week or before
    return new Date(lastEditedTime).toLocaleString().split(',')[0];
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
            <View>
              <Text style={titleStyle}>{title}</Text>
              <Text style={[description, dateStyle]}>
                {getTimeString(time)}
              </Text>
            </View>
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
