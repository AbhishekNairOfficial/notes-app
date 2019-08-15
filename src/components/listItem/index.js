import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

const ListItem = props => {
  const {id, title, body, navigation} = props;
  return (
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
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    height: 80,
    padding: 15,
    borderWidth: 1,
    borderColor: '#ccc',
  },
  title: {
    fontFamily: 'Product Sans',
    fontSize: 20,
  },
  description: {
    fontFamily: 'Product Sans',
    fontSize: 18,
  },
});

export default ListItem;
