import React, {useState, useRef, useEffect} from "react";
import {View, StyleSheet, Text, Image, Pressable, TextInput, Alert, Platform} from "react-native";
import axios from 'axios';
import { router } from "expo-router";
import * as ImagePicker from "expo-image-picker";

const RegisterUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPass, setConfirmPass] = useState("");
    const [profilePic, setProfilePic] = useState(null);

    const registerUser = async () => {
        if(!email || !password || !username || !confirmPass) return;

        if(confirmPass !== password) {
            return Alert.alert("Passwords don't match");
        }
        if(password.length < 8) {
            return Alert.alert("Password not long enough");
        }

        let formData = new FormData();
        formData.append('username', username);
        formData.append('email', email);
        formData.append('password', password);
        if (profilePic) {
            formData.append('profilePic', {
                uri: Platform.OS === 'android' ? profilePic.uri : profilePic.uri.replace('file://', ''),
                type: profilePic.mimeType,
                name: profilePic.fileName,
            });
        }

        try {
            const res = await axios.post(
                    "http://10.0.2.2:8000/v1/user", //this route is for android emulator
                formData,
                { headers: { "Content-Type": "multipart/form-data" } }
            );
            Alert.alert("User created successfully.");
            router.push("/Stripe");
        }
        catch(e) {
            console.log(e);
            Alert.alert("Error when creating user, please try again!");
        }
    }

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setProfilePic(result.assets[0]);
        }
    };

    return(
        <View style={styles.container}>
            <View style={styles.containerIn}>
                <Image style={styles.image} source={require('../../assets/images/logo.png')} />
                <Text style={styles.title}>Create your Grooving account</Text>
            </View>
            <View style={styles.form}>
                <TextInput
                    style={styles.input}
                    value={username}
                    placeholder={"Username"}
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => setUsername(text)}
                    autoCapitalize="none"
                />
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
                <TextInput
                    style={styles.input}
                    value={confirmPass}
                    placeholder={"Confirm Password"}
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => setConfirmPass(text)}
                    secureTextEntry={true}
                />
                {profilePic !== null ? (
                        <Pressable onPress={pickImage} style={styles.buttonImg}>
                            <Image source={{ uri: profilePic.uri }} style={styles.image} />
                        </Pressable>
                    )
                : (
                        <Pressable onPress={pickImage} style={styles.buttonImg}>
                            <Image source={require('../../assets/images/default.jpg')} style={styles.image} />
                        </Pressable>
                    )}
                <Pressable style={styles.button} onPress={registerUser}>
                    <Text style={styles.buttonText}>Create account</Text>
                </Pressable>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
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
        width: 150,
        height: 150,
        marginBottom: 0,
        borderRadius: 300,
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
    buttonImg: {
        width: 150,
        height: 150,
        marginBottom: 20,
        borderRadius: 300,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: '600',
    },
})

export default RegisterUser;