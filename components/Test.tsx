import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import * as FileSystem from 'expo-file-system';

const Test = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null); //カメラの許可状態
  const [camera, setCamera] = useState<Camera | null>(null);　//カメラの参照
  const [capturedImage, setCapturedImage] = useState<string | null>(null); //撮影した写真
  
  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync();
      console.log('写真が撮影されました');
      setCapturedImage(photo.uri);
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
      {capturedImage ? (
        <View style={styles.previewContainer}>
          <Image source={{ uri: capturedImage }} style={styles.preview} />
          <TouchableOpacity
            style={styles.retakeButton}
            onPress={() => setCapturedImage(null)}
          >
            <Text style={styles.buttonText}>撮り直す</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          onCameraReady={() => console.log('カメラ準備完了')}
          ref={(ref) => setCamera(ref)}
           pointerEvents="none"
        >
          <View style={styles.buttonContainer}>
            <TouchableOpacity onPress={takePicture} style={styles.button}>
              <Text style={styles.buttonText}>撮影</Text>
            </TouchableOpacity>
          </View>
        </CameraView>
      )}
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
    position: 'absolute',
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  button: {
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    paddingHorizontal: 20,
    zIndex: 2,
  },
  buttonText: {
    fontSize: 16,
    color: 'black',
  },
  previewContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'black',
  },
  preview: {
    width: '100%',
    height: '80%',
    resizeMode: 'contain',
  },
  retakeButton: {
    position: 'absolute',
    bottom: 20,
    backgroundColor: 'white',
    borderRadius: 30,
    padding: 15,
    paddingHorizontal: 20,
  },
});

export default Test;