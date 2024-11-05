import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ScrollView} from "react-native";
import axios from 'axios';
import { AppContext } from "../../scripts/AppContext";
import {Link, router} from "expo-router";
import AlbumView from "../../components/AlbumView";
import SearchView from "../../components/SearchView";

const MyPage = () => {
    const {user, token} = useContext(AppContext);
    const [data, setData] = useState({});


    const getUserInfo = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/user/${user.id}`
            )
            res.data.data.createdAt = res.data.data.createdAt.split("T")[0];
            setData(res.data.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUserInfo();
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.info}>
                {
                    data.profileImage !== null ? (
                        <Image source={{ uri: data.profileImage }} style={styles.image} />
                    ) : (
                        <Image source={require('../../assets/images/default.jpg')} style={styles.image} />
                    )
                }
                <Text style={styles.username}>{data.username}</Text>
                <Text style={styles.email}>{data.email}</Text>
                <Text style={styles.data}>Member since {data.createdAt}</Text>
                <Pressable style={styles.pressableEdit}>
                    <Text style={styles.pressableText}>Edit account</Text>
                </Pressable>
            </View>

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
        justifyContent: 'center'
    },
    pressableText: {
        color: '#fff',
        fontSize: 18
    },
})

export default MyPage;