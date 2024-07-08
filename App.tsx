import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Mycamera from "./components/Mycamera";// MyCamera コンポーネントをインポート
import Test from "./components/Test";// MyCamera コンポーネントをインポート

const App = () => {
  return (
    <View style={styles.container}>
      <Test />
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

