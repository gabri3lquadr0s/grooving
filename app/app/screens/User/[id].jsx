import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ActivityIndicator, SafeAreaView} from "react-native";
import axios from 'axios';
import { AppContext } from "../../../scripts/AppContext";
import {router, useLocalSearchParams} from "expo-router";
import { Link } from 'expo-router';

const User = () => {
    const { id } = useLocalSearchParams();
    const [user, setUser] = useState(null);
    const {token} = useContext(AppContext);

    const getUser = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/user/${id}`
            )
            res.data.data.createdAt = res.data.data.createdAt.split("T")[0];
            setUser(res.data.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUser();
    }, [])

    if(!user) {
        return (
            <View>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    return (
        <SafeAreaView>
            <View style={styles.info}>
                {
                    user.profileImage !== null ? (
                        <Image source={{ uri: user.profileImage }} style={styles.image} />
                    ) : (
                        <Image source={require('../assets/images/default.jpg')} style={styles.image} />
                    )
                }
                <Text style={styles.username}>{user.username}</Text>
                <Text style={styles.data}>Member since {data.createdAt}</Text>
            </View>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({

})