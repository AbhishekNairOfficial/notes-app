import React from 'react';
import { View, Text, Button } from 'react-native';

const NotesListing = props => {
  const { navigation } = props;
  return (
    <View>
      <Text>I am Listing page</Text>
      <Button
        onPress={() => navigation.navigate('Note')}
        title="Click me to go to notes page"
      />
    </View>
  );
};

export default NotesListing;
