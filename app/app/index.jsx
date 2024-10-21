import React, {useState, useRef, useEffect} from "react";
import {View, StyleSheet, Text, Image, Pressable} from "react-native";
import { router } from "expo-router";

const App = () => {
    return(
        <View style={styles.container}>
            <View style={styles.containerIn}>
                {/*<Image style={styles.image} source={require('./assets/logo.png')} />*/}
                <Text style={styles.title}>Welcome to Grooving</Text>
                <Text style={styles.subtitle}>The best music app according to no one</Text>
            </View>
            <View style={styles.containerIn}>
                <Pressable style={styles.button} onPress={() => router.push("/screens/Login")}>
                        <Text>Sign in</Text>
                </Pressable>
                <Pressable style={styles.button} onPress={() => router.push("/screens/RegisterUser")}>
                        <Text>Sign up</Text>
                </Pressable>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {

    },
    image: {

    },
    title: {

    },
    subtitle: {

    },
    button: {

    },
    containerIn: {

    }
})

export default App;