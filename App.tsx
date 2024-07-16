import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import TakePhotoScreen from './components/TakePhotoScreen';
import Gpt_ocr from './components/Gpt_ocr';
const App = () => {
  return (
    <View style={styles.container}>
      <Gpt_ocr />
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

