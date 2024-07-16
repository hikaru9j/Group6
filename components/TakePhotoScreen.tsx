import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, Alert, SafeAreaView } from 'react-native';
import * as MediaLibrary from 'expo-media-library';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import axios from 'axios';

const API_KEY="";

const TakePhotoScreen= () => {
    const [hasCameraPermission, setHasCameraPermission] = useState(false);
    const [hasMediaLibraryPermission, setHasMediaLibraryPermission] = useState(false);
    const [extractedText, setExtractedText] = useState('');

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
            quality: 1,
            base64: true,
        });

        if (!result.canceled && result.assets && result.assets.length > 0) {
            const localUri = result.assets[0].uri;
            const base64Image=result.assets[0].base64;

            //カメラロールに保存
            await MediaLibrary.saveToLibraryAsync(localUri);
            console.log("Base64 Image (first 50 chars):", base64Image?.substring(0, 50));
            //VisionAPIに送信
            try{
                const apiResult = await sendToVisionAPI(base64Image);
                console.log("Vision API Result:", apiResult);
                setExtractedText(apiResult.text || "テキストが検出されませんでした。");

            }catch(error){
                console.error("Error sending to Vision API:", error);
                Alert.alert('Error', 'Failed to send to Vision API.');
            }

            Alert.alert('Success', 'The picture has been saved to your camera roll.'); //ポップアップ
        }
    };

   

    const sendToVisionAPI = async (base64Image: string) => {
     
        try{
            const response = await axios.post(
                `https://vision.googleapis.com/v1/images:annotate?key=${API_KEY}`,
                {
                    requests: [
                        {
                            image: {
                                content: base64Image,
                            },
                            features: [
                                {
                                    type: 'TEXT_DETECTION',
                                },
                            ],
                        },
                    ],
                },
                { timeout: 30000 } 
            );
            return { text: response.data.responses[0].fullTextAnnotation.text };
        }catch(error){
            console.error("Error sending to Vision API:", error);
            throw error;
        }}

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.instruction}>メニューの写真を撮ってください</Text>
            <View style={styles.buttonContainer}>
                <Button title="写真を撮る" onPress={()=>takePictureAndSave()} />
                
            </View>
            {extractedText ? (
                <View style={styles.resultContainer}>
                    <Text style={styles.resultTitle}>抽出されたテキスト</Text>
                    <Text style={styles.resultText}>{extractedText}</Text>
                    </View>
            ) : null}
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
    },resultContainer: {
        marginTop: 20,
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 5,
        width: '80%',
    },
    resultTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    resultText: {
        fontSize: 14,
    }

});

export default TakePhotoScreen;