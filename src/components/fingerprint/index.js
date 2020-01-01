import React, {useState, useEffect} from 'react';
import {Alert, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

import TouchID from 'react-native-touch-id';

// export default class FingerPrint extends Component<{}> {
const FingerPrint = () => {
  const [biometryType, setBiometryType] = useState(null);

  useEffect(() => {
    TouchID.isSupported().then(type => {
      setBiometryType(type);
    });
  }, []);

  const authenticate = () => {
    return TouchID.authenticate()
      .then(success => {
        console.log(success);
        Alert.alert('Authenticated Successfully');
      })
      .catch(error => {
        console.log(error);
        Alert.alert(error.message);
      });
  };

  const clickHandler = () => {
    TouchID.isSupported()
      .then(authenticate)
      .catch(() => {
        Alert.alert('TouchID not supported');
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.btn}
        onPress={clickHandler}
        underlayColor="#0380BE"
        // activeOpacity={1}
      >
        <Text style={styles.text}>{`Authenticate with ${biometryType}`}</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  btn: {
    borderRadius: 3,
    // marginTop: 200,
    paddingTop: 15,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
    backgroundColor: '#0391D7',
  },
  text: {
    color: '#fff',
    fontWeight: '600',
  },
});

export default FingerPrint;
