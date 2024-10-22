import React from "react";
import {View, StyleSheet, Text, Image, Pressable} from "react-native";
import {LinearGradient} from 'expo-linear-gradient';
import { router } from "expo-router";

const App = () => {
    return(
        <LinearGradient
            colors={['#3D0075', '#2D0060', '#1E004A', '#0F0035', '#000000']}
            style={styles.background}
            locations={[0, 0.25, 0.5, 0.75, 1]}
        >
            <View style={styles.container}>
                <View style={styles.containerIn}>
                    <Image style={styles.image} source={require('../assets/images/logo.png')} />
                    <Text style={styles.title}>Welcome to Grooving</Text>
                    <Text style={styles.subtitle}>The best music app according to no one</Text>
                </View>
                <View style={styles.containerIn}>
                    <Pressable style={styles.button} onPress={() => router.push("/screens/Login")}>
                            <Text style={styles.buttonText}>Login</Text>
                    </Pressable>
                    <Pressable style={styles.button} onPress={() => router.push("/screens/RegisterUser")}>
                            <Text style={styles.buttonText}>Register</Text>
                    </Pressable>
                </View>
                <Text>Do you want to be an artist? Register here.</Text>
            </View>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerIn: {
        marginVertical: 20,
        alignItems: 'center',
    },
    image: {
        width: 300,
        height: 300,
        marginBottom: 20,
    },
    title: {
        color: '#fff',
        fontSize: 32,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    subtitle: {
        color: '#aaa',
        fontSize: 16,
        marginBottom: 30,
    },
    button: {
        backgroundColor: '#3D0075',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginVertical: 10,
        width: 300,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
    },
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default App;