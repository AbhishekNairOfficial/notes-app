import React from 'react';
import {ScrollView} from 'react-native';
import useGlobal from '../../store';
import ListItem from '../../components/listItem';

const NotesListing = props => {
  const [globalState] = useGlobal();
  const {navigation} = props;

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
