import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';


const TakePhotoScreen= () => {
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
//useeffectはコンポーネントがまだレンダリングされていない時に実行される
//最初にユーザに対してカメラ許可を求める
    useEffect(() => {
        const requestPermissions = async () => {
            const { status: cameraStatus } = await ImagePicker.requestCameraPermissionsAsync();
            const { status: mediaLibraryStatus } = await MediaLibrary.requestPermissionsAsync();
//===は値と型が等しい場合にtrueを返す

            setHasCameraPermission(cameraStatus === 'granted');
            setHasMediaLibraryPermission(mediaLibraryStatus === 'granted');
//||はor, &&はand
//!==は値と型が等しくない場合にtrueを返す

            if (cameraStatus !== 'granted' || mediaLibraryStatus !== 'granted') {
                Alert.alert(
                    'Permission Required',
                    'You need to grant camera and media library permissions to use this feature.',
                    [{ text: 'OK', onPress: () => console.log('OK Pressed') }]
                );
            }
        };

        requestPermissions();
    }, []);

    const takePictureAndSave = async () => {
//!はnot,||はor
        if (!hasCameraPermission || !hasMediaLibraryPermission) {
            Alert.alert('Permission Required', 'Camera and media library permissions are needed.');
            return;
        }

        const result = await ImagePicker.launchCameraAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const localUri = result.assets[0].uri;
            await MediaLibrary.saveToLibraryAsync(localUri);
            Alert.alert('Success', 'The picture has been saved to your camera roll.'); //ポップアップ
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.instruction}>メニューの写真を撮ってください</Text>
            <View style={styles.buttonContainer}>
                <Button title="写真を撮る" onPress={()=>takePictureAndSave()} />
                
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F3E2CF',
        alignItems: 'center',
        justifyContent: 'center',
    },
    instruction: {
        fontSize: 18,
        marginBottom: 20,
        textAlign: 'center',
    },
    buttonContainer: {
        width: '80%',
    }
});

export default TakePhotoScreen;