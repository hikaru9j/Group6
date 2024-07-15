import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Camera, CameraView } from 'expo-camera';


const Mycamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const takePicture = async () => {
    if (camera) {
      const photo = await camera.takePictureAsync({ base64: true });
      console.log('写真が撮影されました');

      const body = JSON.stringify({
        requests: [
          {
            image: {
              content: photo.base64,
            },
            features: [
              { type: 'LABEL_DETECTION', maxResults: 10 },
            ],
          },
        ],
      });

      const response = await fetch(
        `https://vision.googleapis.com/v1/images:annotate?key=${GOOGLE_VISION_API}`,
        {
          headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
          },
          method: 'POST',
          body,
        }
      );

      const responseJson = await response.json();
      console.log(responseJson);
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
};

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