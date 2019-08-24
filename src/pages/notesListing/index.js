import React from 'react';
import {ScrollView, StatusBar} from 'react-native';
import useGlobal from '../../store';
import ListItem from '../../components/listItem';

const NotesListing = props => {
  const [globalState] = useGlobal();
  const {navigation} = props;

  // Changing the Statusbar text to light content on iOS
  StatusBar.setBarStyle('light-content', true);

  return (
    <ScrollView>
      {globalState.list.map((note, key) => {
        return (
          <ListItem
            key={key}
            id={note.id}
            title={note.title}
            body={note.body}
            navigation={navigation}
          />
        );
      })}
    </ScrollView>
  );
};

export default NotesListing;
