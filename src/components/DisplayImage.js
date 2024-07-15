import React, { useState, useEffect } from "react";
import {
    View,
    Image,
    Text,
    ScrollView,
    TouchableOpacity,
    StyleSheet,
} from "react-native";
import { storage } from "../../firebaseConfig";
import { ref, listAll, getDownloadURL } from "firebase/storage";
import RotatingLoader from "../commonComponents/RotatingLoader";
import { Header } from "../commonComponents/Header";
const DisplayImagesComponent = ({ }) => {
    const [images, setImages] = useState([]);
    const [loader, setLoader] = useState(false);

    useEffect(() => {
        const fetchImages = async () => {
            setLoader(true);
            const imagesRef = ref(storage, "images/");
            const imageList = await listAll(imagesRef);
            const imageUrls = await Promise.all(
                imageList.items.map((itemRef) => getDownloadURL(itemRef))
            );
            setImages(imageUrls);
            setLoader(false);
        };

        fetchImages();
    }, []);
    {
    }
    return (
        <View style={styles.container}>
            <Header title={"Image Stock"} />
            <Text style={styles.welcomeText}>Welcome to your own gallery!</Text>

            <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
                {loader ? (
                    <View
                        style={[
                            styles.imageLoader,
                            { height: 150, width: 150, margin: 10 },
                        ]}
                    >
                        <RotatingLoader />
                    </View>
                ) : (
                    <View
                        style={{ flexDirection: "row", flexWrap: "wrap", width: "100%" }}
                    >
                        {images.length > 0 ? (
                            images.map((url, index) => (
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
                                        key={index}
                                        source={{ uri: url }}
                                        style={{
                                            height: 155,
                                            width: "100%",
                                            borderRadius: 10,
                                        }}
                                    />
                                </View>
                            ))
                        ) : (
                            <TouchableOpacity style={styles.addContainer}>
                                <Image
                                    source={{
                                        uri: "https://png.pngtree.com/png-vector/20220616/ourmid/pngtree-blue-plus-concept-icon-on-white-background-png-image_5097450.png",
                                    }}
                                    style={styles.addIcon}
                                />
                            </TouchableOpacity>
                        )}
                    </View>
                )}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,

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
        fontSize: 18,
        color: "#00256e",
        fontWeight: "600",
        marginLeft: 10,
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

export default DisplayImagesComponent;
