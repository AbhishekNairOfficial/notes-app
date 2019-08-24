import React, {useState} from 'react';
import {View, Alert, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import Swipeable from 'react-native-gesture-handler/Swipeable';
import useGlobal from '../../store';

const renderLeftActions = () => {
  return (
    <View style={styles.deleteContainer}>
      <Text style={styles.deleteButton}>Delete</Text>
    </View>
  );
};

const ListItem = props => {
  const [, globalActions] = useGlobal();
  const {id, title, body, navigation} = props;
  const [ref, updateRef] = useState('');

  return (
    <Swipeable
      ref={updatedRef => {
        updateRef(updatedRef);
      }}
      onSwipeableRightOpen={() => {
        Alert.alert(
          'Are you sure?',
          '',
          [
            {
              text: 'Delete',
              onPress: () => {
                globalActions.deleteNote(id);
              },
              style: 'destructive',
            },
            {
              text: 'Cancel',
              onPress: () => {},
              style: 'cancel',
            },
          ],
          {cancelable: false},
        );
        ref.close();
      }}
      renderRightActions={() => renderLeftActions()}
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
          <Text>{body}</Text>
        </View>
      </TouchableOpacity>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
    backgroundColor: '#fff',
  },
  title: {
    fontFamily: 'Product Sans',
    fontSize: 20,
  },
  description: {
    fontFamily: 'Product Sans',
    fontSize: 18,
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
    color: '#fff',
    margin: 10,
  },
});

export default ListItem;
