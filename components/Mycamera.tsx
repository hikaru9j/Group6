import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera,CameraView } from 'expo-camera';
import FileSystem from "expo-file-system";

const Mycamera = () => {
  // カメラの許可状態を管理するstate
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  // カメラの参照を管理するstate
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    // コンポーネントがマウントされたときにカメラの許可を要求
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  // 写真を撮影する関数
  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({ base64: true });
      console.log('写真が撮影されました');
      // ここで撮影した写真を使用して何かを行うことができます
      //写真をGoogle Cloud Vision APIに送信して、画像認識を行う
      
    }
  };

  if (hasPermission === null) {
    return <View />;
  }
  if (hasPermission === false) {
    return <Text>カメラへのアクセスが許可されていません</Text>;
  }

  return (
    <View style={styles.container}>
      <CameraView
        style={styles.camera}
        onCameraReady={() => console.log('カメラ準備完了')}
        // setCamera関数を使ってcameraステートを更新
        ref={(ref) => setCamera(ref)}
         pointerEvents="none"
      >
        <View style={styles.buttonContainer}>
          <TouchableOpacity onPress={takePicture} style={styles.button}>
            <Text style={styles.buttonText}>撮影</Text>
          </TouchableOpacity>
        </View>
      </CameraView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  camera: {
    flex: 1,
  },
  buttonContainer: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',
    justifyContent: 'center',
    margin: 20,
  },
  button: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    paddingHorizontal: 20,
    zIndex: 1,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
});


export default Mycamera;