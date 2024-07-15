import React, { useState, useRef, useEffect } from "react";
import {
    View,
    Image,
    TouchableOpacity,
    StyleSheet,
    Text,
    Alert,
    PermissionsAndroid,
    ToastAndroid,
    ScrollView,
    ActivityIndicator,
    // Platform,
} from "react-native";
import {
    Camera,
    useCameraFormat,
    useCameraDevice,
    useCameraPermission,
} from "react-native-vision-camera";

import { Header } from "../commonComponents/Header";
import { storage } from "../../firebaseConfig";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import * as ImagePicker from "expo-image-picker";

const CameraComponent = ({ }) => {
    const [openCamera, setOpenCamera] = useState(false);
    const cameraRef = useRef(null);
    const [photoList, setPhotoList] = useState([]);
    const { hasPermission } = useCameraPermission();
    const [isUploading, setIsUploading] = useState(false);
    const requestCameraPermission = async () => {
        requestAndroidCameraPermission();
    };

    const takePicture = async () => {
        setOpenCamera(true);

        if (!hasPermission) {
            const permissionGranted = await requestCameraPermission();
          
            if (permissionGranted !== "granted") {
                Alert.alert("Camera permission is required to take a picture.");
                return;
            }
        } else {
            if (cameraRef.current) {
                try {
                    const photo = await cameraRef.current.takePhoto();
                    console.log("Photo taken:", photo.path);
                    setPhotoList([...photoList, photo.path]);
                    setOpenCamera(false);
                } catch (error) {
                    console.error(error);
                    Alert.alert("Error taking photo:", error.message);
                }
            }
        }
    };

    const device = useCameraDevice("back", {
        physicalDevices: [
            "ultra-wide-angle-camera",
            "wide-angle-camera",
            "telephoto-camera",
        ],
    });
    const format = useCameraFormat(device, [
        { photoResolution: { width: 1280, height: 720 } },
    ]);

    const requestAndroidCameraPermission = async () => {
        try {
            await PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.CAMERA, {
                title: "<your title here>",
                message: "<your message here>",
                buttonNegative: "Deny",
                buttonPositive: "Allow",
            });
        } catch (err) {
            console.warn(err);
        }
    };

    const getPermission = async () => {
        await Camera.requestCameraPermission();
        await Camera.requestMicrophonePermission();
    };
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1,
        });

        if (!result.cancelled) {
            console.log(result.assets[0].uri, "res");
            setPhotoList([...photoList, result?.assets[0]?.uri]);
        }
    };

    const UploadImages = async () => {
        setIsUploading(true);
        try {
            const response = await fetch(photoList[0]);
            const blob = await response.blob();
            const storageRef = ref(storage, `images/${Date.now()}`);

            const uploadTask = uploadBytesResumable(storageRef, blob);

            uploadTask.on(
                "state_changed",
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    ToastAndroid.show("Successfully Uploaded!", ToastAndroid.SHORT);

                },
                (error) => {

                    Alert.alert("Error uploading image:", error.message);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        console.log("File available at", downloadURL);
                        setUploadedUrl(downloadURL);

                    });
                }
            );
        } catch (err) {
            console.log(err)
        }
        finally {
            setIsUploading(false);
        }
    };
    useEffect(() => {
        getPermission();
    }, []);

    return (
        <>
            <Header title={"Image Stock"} />
            <View style={styles.container}>
                {device && openCamera && (
                    <Camera
                        style={styles.camera}
                        device={device}
                        isActive={true}
                        format={format}
                        photo={true}
                        ref={cameraRef}
                    />
                )}
                <View style={styles.titleContainer}>
                    <Text style={styles.welcomeText}>Welcome Back!</Text>
                    <Text>Upload Images by click on Add Icon or Take New Pictures!</Text>
                </View>
                {!openCamera && (
                    <ScrollView contentContainerStyle={{ paddingBottom: 100 }}>
                        <View
                            style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}
                        >
                            {photoList?.length && !openCamera
                                ? photoList.map((item) => (
                                    <View
                                        style={{
                                            alignItems: "center",
                                            width: "44%",
                                            height: 155,
                                            marginHorizontal: "3%",
                                            display: "flex",
                                            marginVertical: 15,
                                            borderRadius: 10,
                                            backgroundColor: "#f9f9f9",
                                            shadowColor: "#000",
                                            shadowOffset: { width: 0, height: 2 },
                                            shadowOpacity: 0.25,
                                            shadowRadius: 3.84,
                                            elevation: 5,
                                        }}
                                    >
                                        <Image
                                            source={{ uri: `file://${item}` }}
                                            style={{
                                                height: 155,
                                                width: "100%",
                                                borderRadius: 10,
                                            }}
                                        />
                                    </View>
                                ))
                                : null}
                            <TouchableOpacity style={styles.addContainer} onPress={pickImage}>
                                <Image
                                    source={{
                                        uri: "https://png.pngtree.com/png-vector/20220616/ourmid/pngtree-blue-plus-concept-icon-on-white-background-png-image_5097450.png",
                                    }}
                                    style={styles.addIcon}
                                />
                            </TouchableOpacity>
                        </View>
                    </ScrollView>
                )}
                <View style={styles.footer}>
                    {isUploading ? (
                        <ActivityIndicator size="large" color={"#1644ce"} />
                    ) : (
                        <>
                            <TouchableOpacity
                                onPress={takePicture}
                                style={styles.imageButton}
                            >
                                <Text style={styles.buttonText}>Take Picture</Text>
                            </TouchableOpacity>
                            {!openCamera ? (
                                <TouchableOpacity
                                    onPress={UploadImages}
                                    disabled={photoList.length == 0 ? true : false}
                                    style={styles.imageButton}
                                >
                                    <Text style={styles.buttonText}>Upload Images</Text>
                                </TouchableOpacity>
                            ) : null}
                        </>
                    )}
                </View>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // alignItems: "center",
        width: "100%",
    },
    addContainer: {
        height: 150,
        width: 150,
        borderWidth: 1,
        borderColor: "#ddd",
        margin: 20,
    },
    camera: {
        width: "100%",
        height: 600,
    },
    addIcon: {
        height: 150,
        width: 150,
    },
    welcomeText: {
        fontSize: 24,
        color: "#00256e",
        fontWeight: "600",
    },
    imageButton: {
        marginHorizontal: 5,
        justifyContent: "center",
        backgroundColor: "#0095ff",
        borderRadius: 5,
    },
    buttonText: {
        fontSize: 14,
        paddingHorizontal: 32,
        paddingVertical: 8,
        color: "#ffffff",
    },
    titleContainer: {
        marginHorizontal: 10,
    },
    footer: {
        flexDirection: "row",
        position: "absolute",
        bottom: 0,
        backgroundColor: "white",
        padding: 20,
        borderTopColor: "#eee",
        borderTopWidth: 1,
        elevation: 5,
        justifyContent: "center",
        width: "100%",
        zIndex: 2,
    },
});

export default CameraComponent;
