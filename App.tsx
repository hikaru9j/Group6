import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TakePhotoScreen from './components/TakePhotoScreen';
import Test from './components/Test';
const App = () => {
  return (
    <View style={styles.container}>
      <TakePhotoScreen />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default App;

