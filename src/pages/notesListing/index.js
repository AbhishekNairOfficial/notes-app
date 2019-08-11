import React from 'react';
import { View, Text, Button } from 'react-native';
import useGlobal from '../../store';

const NotesListing = props => {
  const [globalState] = useGlobal();
  const { navigation } = props;

  return (
    <View>
      <Text>{'List Length is ' + globalState.list.length}</Text>
      <Button
        onPress={() => navigation.navigate('Note')}
        title="Click me to go to notes page"
      />
      {globalState.list.map((note, key) => {
        return <Text key={key}>{note.title}</Text>;
      })}
    </View>
  );
};

export default NotesListing;
