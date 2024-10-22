import React, {useState, useRef, useEffect} from "react";
import {View, StyleSheet, Text, Image, Pressable, TextInput, Alert } from "react-native";
import axios from 'axios';
import { router } from "expo-router";

const RegisterUser = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [profilePic, setProfilePic] = useState("");

    const registerUser = async () => {
        if(!email || !password || !username) return;
        try {
            const res = await axios.post(
                "http://10.0.2.2:8000/v1/user", //this route is for android emulator
                {"email":email,"password":password}
            );
        }
        catch(e) {

        }
    }

    return(
        <View>
            <Text>

            </Text>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default RegisterUser;