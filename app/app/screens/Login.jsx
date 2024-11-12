import React, {useState, useContext} from "react";
import { AppContext } from "../../scripts/AppContext";
import {View, StyleSheet, Text, Image, Pressable, TextInput, Alert } from "react-native";
import axios from 'axios';
import { router } from "expo-router";
import { jwtDecode } from 'jwt-decode'

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const {setToken, setUser} = useContext(AppContext);

    const loginAsync = async () => {
        if(!email || !password) return;
        try {
            const res = await axios.post(
                "http://10.0.2.2:8000/v1/auth", //this route is for android emulator
                {"email":email,"password":password}
            );
            setToken(res.data.token);
            const user = jwtDecode(res.data.token);
            setUser(user);
            if(user.userType === "user") {
                router.push("/screens/HomeUser");
            } else {
                router.push("/screens/HomeArtist");
            }
        }
        catch(e) {
            let err = e.response.data.error;
            if(err === "User not active") {
                Alert.alert("User is not active, please complete subscription!");
                router.push("/screens/Stripe");
            }
            if(err === "Incorrect email or password") {
                Alert.alert("Email or password incorrect, please check.");
            }
            // else {
            //     Alert.alert("Unknown error, please try again later!.");
            // }
        }
    }

    return (
        <View style={styles.container}>
            <View style={styles.containerIn}>
                <Image style={styles.image} source={require('../../assets/images/logo.png')} />
                <Text style={styles.title}>Login into your Grooving account</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={email}
                    placeholder={"Email"}
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => setEmail(text)}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <TextInput
                    style={styles.input}
                    value={password}
                    placeholder={"Password"}
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => setPassword(text)}
                    secureTextEntry={true}
                />
                <Pressable style={styles.button} onPress={loginAsync}>
                    <Text style={styles.buttonText}>Login</Text>
                </Pressable>
            </View>
        {/* </LinearGradient>*/}
        </View>
    );
}

const styles = StyleSheet.create({
    background: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: "#000"
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
        textAlign: 'center',
    },
    form: {
        width: '80%',
        alignItems: 'center',
    },
    input: {
        width: '100%',
        height: 50,
        backgroundColor: '#1E004A',
        borderRadius: 10,
        paddingHorizontal: 15,
        marginVertical: 10,
        color: '#fff',
        fontSize: 16,
    },
    button: {
        backgroundColor: '#3D0075',
        paddingVertical: 15,
        paddingHorizontal: 30,
        borderRadius: 30,
        marginTop: 20,
        width: '100%',
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
});

export default Login;