import React, { ReactElement } from "react"
import {

    StyleSheet,
    View,
    Text
} from "react-native"


export function Header({ title }) {


    return (
        <View style={styles.wrapper}>
            <Text style={styles.title}>{title}</Text>
        </View>
    )
}


const styles = StyleSheet.create({
    wrapper: {
        marginBottom: 15,
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#0095ff",
        width: "100%",
        justifyContent: "center",
        elevation: 5,
    },
    title: {
        paddingVertical: 10,
        textAlign: "center",
        alignSelf: "center",
        color: '#FFFFFF',
        fontSize: 24,
    },

})