import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ActivityIndicator, SafeAreaView} from "react-native";
import axios from 'axios';
import { AppContext } from "../../../scripts/AppContext";
import {router, useLocalSearchParams} from "expo-router";
import { Link } from 'expo-router';

const User = () => {
    const { id } = useLocalSearchParams();
    const [user, setUser] = useState(null);
    const [albums, setAlbums] = useState([]);
    const {token} = useContext(AppContext);

    const getUser = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/user/${id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            res.data.data.createdAt = res.data.data.createdAt.split("T")[0];
            setUser(res.data.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    const getAlbumsFromArtist = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/album?page=0&type=all&artist=${id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            setAlbums(res.data.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUser();
        getAlbumsFromArtist();
    }, [])

    if(!user) {
        return (
            <View>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.back}>
                <Link href={"/screens/HomeUser"} style={styles.linkBack}>
                    <Image source={require("../../../assets/images/left-arrow.png")} style={styles.imgBack}/>
                </Link>
            </View>
            <View style={styles.info}>
                {
                    user.profileImage !== null ? (
                        <Image source={{ uri: data.profileImage }} style={styles.image} />
                    ) : (
                        <Image source={require('../../../assets/images/default.jpg')} style={styles.image} />
                    )
                }
                <View style={styles.moreInfo}>
                    <Text style={styles.username}>{user.username}</Text>
                    <Text style={styles.data}>Member since {user.createdAt}</Text>
                </View>
            </View>
            <FlatList data={albums}
                      numColumns={2}
                      contentContainerStyle={styles.flatList}
                      renderItem={({item}) =>
                          <Link href={{pathname: `/screens/Album/${item.id}`}} passHref>
                              <View style={styles.item}>
                                  <Image source={{uri: item.albumImage}} style={styles.albumImage} />
                                  <Text style={styles.albumName}>{item.name}</Text>
                              </View>
                          </Link>
                      }
                      keyExtractor={item => item.id.toString()}
            />
        </SafeAreaView>
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
    data: {
        color: 'white',
        fontStyle: 'bold',
        fontSize: 15,
        marginBottom: 30
    },
    back: {
        height: 60,
        marginTop: 30,
        alignItems: 'flex-start',
        width: '90%',
    },
    linkBack: {
        width: 30,
        height: 50,
    },
    flatList: {
        alignItems: "center"
    },
    albumImage: {
        width: 150,
        height: 150,
    },
    albumName: {
        color: 'white',
        fontSize: 15,
        textAlign: 'left',
    },
    item: {
        padding: 20,
        borderRadius: 20,
    },
    moreInfo: {
        borderBottomColor: '#3D0075',
        borderBottomWidth: 5,
        width: 300,
        flexDirection: "column",
        justifyContent: "space-between",
        alignItems: "center"
    },
})

export default User;