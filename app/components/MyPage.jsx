import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ScrollView, TextInput, Alert, Platform} from "react-native";
import axios from 'axios';
import { AppContext } from "../scripts/AppContext";
import {Link, router} from "expo-router";
import AlbumView from "./AlbumView";
import SearchView from "./SearchView";
import * as ImagePicker from "expo-image-picker";

const MyPage = () => {
    const {user, token} = useContext(AppContext);
    const [data, setData] = useState({});
    const [edit, setEdit] = useState(false);
    const [newImg, setNewImg] = useState(null);
    const [newUsername, setNewUsername] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmNewPass, setConfirmNewPass] = useState("");


    const getUserInfo = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/user/${user.id}`
            )
            res.data.data.createdAt = res.data.data.createdAt.split("T")[0];
            setData(res.data.data);
            setNewImg({"uri": res.data.data.profileImage});
        }
        catch(e) {
            console.log(e);
        }
    }

    const updateUserInfo = async () => {
        let formData = new FormData();
        if(newUsername) formData.append("username", newUsername);
        if(newPassword) {
            if(newPassword.length < 8) return Alert.alert("Password not long enough");
            if(newPassword !== confirmNewPass) return Alert.alert("Passwords don't match");
            formData.append("password", newPassword);
        }
        if(newImg !== data.profileImage) {
            formData.append('profilePic', {
                uri: Platform.OS === 'android' ? newImg.uri : newImg.uri.replace('file://', ''),
                type: newImg.mimeType,
                name: newImg.fileName,
            });
        }
        try {
            const res = await axios.patch(
                `http://10.0.2.2:8000/v1/user/${user.id}`,
                formData,
                {headers: {Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data"}}
            )
            Alert.alert("User updated successfully.");
            await getUserInfo();
            setEdit(false);
        }
        catch(e) {
            console.log(e);
            Alert.alert("Error when updating user, please try again!");
        }
    }

    const cancelUpdate = async () => {
        setNewUsername("");
        setConfirmNewPass("");
        setNewPassword("");
        setNewImg({"uri": data.profileImage});
        setEdit(false);
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });
        if (!result.canceled) {
            setNewImg(result.assets[0]);
        }
    };

    return(
        <View style={styles.container}>
            {
                !edit ? (
                    <View style={styles.info}>
                        {
                            data.profileImage !== null ? (
                                <Image source={{ uri: data.profileImage }} style={styles.image} />
                            ) : (
                                <Image source={require('../assets/images/default.jpg')} style={styles.image} />
                            )
                        }
                        <Text style={styles.username}>{data.username}</Text>
                        <Text style={styles.email}>{data.email}</Text>
                        <Text style={styles.data}>Member since {data.createdAt}</Text>
                        <Pressable style={styles.pressableEdit} onPress={() => {setEdit(true)}}>
                            <Text style={styles.pressableText}>Edit account</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.info}>
                        {
                            newImg !== null ? (
                                <Pressable onPress={pickImage} style={styles.buttonImg}>
                                    <Image source={{ uri: newImg.uri }} style={styles.image2} />
                                </Pressable>
                            ) : (
                                <Pressable onPress={pickImage} style={styles.buttonImg}>
                                    <Image source={require('../assets/images/default.jpg')} style={styles.image2} />
                                </Pressable>
                            )
                        }
                        <TextInput
                            style={styles.input}
                            value={newUsername}
                            placeholder={"New Username"}
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => setNewUsername(text)}
                            autoCapitalize="none"
                        />
                        <TextInput
                            style={styles.input}
                            value={newPassword}
                            placeholder={"Password"}
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => setNewPassword(text)}
                            secureTextEntry={true}
                        />
                        <TextInput
                            style={styles.input}
                            value={confirmNewPass}
                            placeholder={"Confirm Password"}
                            placeholderTextColor="#aaa"
                            onChangeText={(text) => setConfirmNewPass(text)}
                            secureTextEntry={true}
                        />
                        <View>
                            <Pressable style={styles.pressableEdit} onPress={() => {cancelUpdate()}}>
                                <Text style={styles.pressableText}>Cancel</Text>
                            </Pressable>
                            <Pressable style={styles.pressableEdit} onPress={() => {updateUserInfo()}}>
                                <Text style={styles.pressableText}>Save changes</Text>
                            </Pressable>
                        </View>
                    </View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    image: {
        width: 150,
        height: 150,
        marginTop: 50,
        marginBottom: 50,
        borderRadius: 300,
    },
    image2: {
        width: 150,
        height: 150,
        marginBottom: 0,
        borderRadius: 300,
    },
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#000"
    },
    info: {
        width: '80%',
        alignItems: 'center',
    },
    username: {
        color: 'white',
        fontStyle: 'bold',
        fontSize: 25,
        marginBottom: 10
    },
    email: {
        color: 'white',
        fontStyle: 'bold',
        fontSize: 18,
        marginBottom: 10
    },
    data: {
        color: 'white',
        fontStyle: 'bold',
        fontSize: 15,
        marginBottom: 30
    },
    pressableEdit: {
        width: 150,
        height: 45,
        borderRadius: 50,
        backgroundColor: '#3D0075',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },
    pressableText: {
        color: '#fff',
        fontSize: 18
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
    buttonImg: {
        width: 150,
        height: 150,
        marginBottom: 50,
        borderRadius: 300,
        alignItems: 'center',
        paddingVertical: 15,
        paddingHorizontal: 30,
        marginTop: 35
    },
})

export default MyPage;