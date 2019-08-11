import React from 'react';
import { View, Text, Button } from 'react-native';
import useGlobal from '../../store';

const NotesPage = props => {
  const [globalState, globalActions] = useGlobal();
  const randomNote = {
    title: 'Random Note',
    body: 'Lol',
    id: '123123',
  };
  return (
    <View>
      <Text>I am Notes page</Text>
      <Button
        title="Click me to add a note"
        onPress={() => {
          globalActions.addNote(randomNote);
        }}
      />
    </View>
  );
};

export default NotesPage;
