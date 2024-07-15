
import React, { useEffect, useRef } from "react"
import { View, StyleSheet, Animated, Easing } from "react-native"

const RotatingLoader = () => {
    const rotateAnim = useRef(new Animated.Value(0)).current

    useEffect(() => {
        Animated.loop(
            Animated.timing(rotateAnim, {
                toValue: 1,
                duration: 1000,
                easing: Easing.linear,
                useNativeDriver: true,
            }),
        ).start()
    }, [rotateAnim])

    const rotateInterpolate = rotateAnim.interpolate({
        inputRange: [0, 1],
        outputRange: ["0deg", "180deg"],
    })

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.loader, { transform: [{ rotate: rotateInterpolate }] }]}>
                <View style={styles.innerCircle} />
            </Animated.View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f9f9f9",
        borderRadius: 10,
        padding: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    loader: {
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 5,
        // borderColor: "transparent",
        borderTopColor: "#0d6efd",
        borderRightColor: "#1644ce",
        borderBottomColor: "#0d6efd",
        borderLeftColor: "#1644ce",
        justifyContent: "center",
        alignItems: "center",
    },
    innerCircle: {
        width: 30,
        height: 30,
        borderRadius: 15,
        backgroundColor: "#f9f9f9",
    },
})

export default RotatingLoader
