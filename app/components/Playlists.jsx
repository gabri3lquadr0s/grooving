import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ScrollView} from "react-native";
import axios from 'axios';
import { AppContext } from "../scripts/AppContext";
import {Link, router} from "expo-router";
import AlbumView from "./AlbumView";
import SearchView from "./SearchView";

const Playlists = () => {
    const {user, token} = useContext(AppContext);
    const [playlists, setPlaylists] = useState([]);

    const getUserPlaylists = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/playlist?user=${user.id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            )
            setPlaylists(res.data.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getUserPlaylists();
    }, []);

    return(
        <View style={styles.container}>
            <View style={styles.headerplaylist}>
                <Text style={styles.username}>Your playlists</Text>
                <View style={styles.playButton}>
                    <Image source={require("../assets/images/plus.png")} style={styles.imgPlay}/>
                </View>
            </View>
            {
                playlists[0] === undefined ? (
                    <View>
                        <Text style={styles.email}>You don't have any playlists yet</Text>
                    </View>
                ) : (
                        <FlatList
                            data={playlists}
                            numColumns={2}
                            renderItem={({item}) =>
                                <Link href={{pathname: `/screens/Playlist/${item.id}`}} passHref>
                                    <View style={styles.item}>
                                        <Image source={{uri: item.playlistImage}} style={styles.albumImage} />
                                        <Text style={styles.albumName}>{item.name}</Text>
                                    </View>
                                </Link>
                            }
                        />
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#000",
    },
    item: {
        padding: 20,
        borderRadius: 20,
    },
    albumName: {
        color: 'white',
        fontSize: 15,
        textAlign: 'left',
    },
    playlistList: {
        alignItems: 'center',
    },
    albumImage: {
        width: 150,
        height: 150,
    },
    username: {
        color: 'white',
        fontStyle: 'bold',
        fontSize: 25,
        marginBottom: 25,
        marginTop: 25,
    },
    playButton: {
        borderRadius: 100,
        backgroundColor: '#3D0075',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 5,
    },
    imgPlay: {
        width: 40,
        height: 40,
    },
    headerplaylist: {
        alignItems: 'center',
    }
})

export default Playlists;