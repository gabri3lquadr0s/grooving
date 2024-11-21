import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ActivityIndicator, SafeAreaView} from "react-native";
import axios from 'axios';
import { AppContext } from "../../../scripts/AppContext";
import {router, useLocalSearchParams} from "expo-router";
import { Link } from 'expo-router';

const Album = () => {
    const { id } = useLocalSearchParams();
    const [album, setAlbum] = useState(null);
    const {token, setLine} = useContext(AppContext);

    const getAlbum = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/album/${id}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            console.log(res.data.data)
            setAlbum(res.data.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    const playAlbum = async () => {
        try {
            setLine(album.Songs);
            router.push("/screens/Play")
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getAlbum();
    }, []);

    if(!album) {
        return (
            <View>
                <ActivityIndicator size="large" color="#000" />
            </View>
        )
    }

    return(
        <SafeAreaView style={styles.containerAlbumView}>
            <View style={styles.back}>
                <Link href={"/screens/HomeUser"} style={styles.linkBack}>
                    <Image source={require("../../../assets/images/left-arrow.png")} style={styles.imgBack}/>
                </Link>
            </View>
            <Image style={styles.albumImage} source={{uri: album.albumImage}} />
            <Text style={styles.albumName}>{album.name}</Text>
            <View style={styles.moreInfo}>
                <View>
                    <Link href={`/screens/User/${User.id}`}>
                        <Text style={styles.infoArtistName}>{album.User.username}</Text>
                    </Link>
                    <Text style={styles.infoDesc}>{album.createdAt.split("T")[0]} - {album.type.toUpperCase()}</Text>
                    <Text style={styles.infoDesc}>{album.totalTimeSec}</Text>
                </View>
                <View style={styles.controls}>
                    <View style={styles.playButton}>
                        <Pressable onPress={() => {playAlbum()}}>
                            <Image source={require("../../../assets/images/play.png")} style={styles.imgPlay}/>
                        </Pressable>
                    </View>
                </View>
            </View>

            <View style={styles.songsContainer}>
                <FlatList
                    data={album.Songs}
                    contentContainerStyle={styles.flatList}
                    renderItem={({item}) =>
                        <Link href={{pathname: `/screens/Song/${item.id}`, params: item}} passHref style={styles.itemLink}>
                            <View style={styles.item}>
                                <Text style={styles.itemName}>{item.name}</Text>
                                <View style={styles.itemInfo}>
                                    <Text style={styles.infoDescSong}>{item.totalTimeSec}</Text>
                                    <Text style={styles.infoDescSong}>{item.totalPlays}</Text>
                                </View>
                            </View>
                        </Link>
                    }
                    keyExtractor={item => item.id.toString()}
                />
            </View>
        </SafeAreaView>
    )

}

const styles = StyleSheet.create({
    containerAlbumView: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#000',
    },
    albumImage: {
        width: 200,
        height: 200,
    },
    albumName: {
        color: "white",
        fontSize: 25,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 15,
    },
    moreInfo: {
        borderTopColor: '#3D0075',
        borderTopWidth: 5,
        borderBottomColor: '#3D0075',
        borderBottomWidth: 5,
        marginTop: 10,
        width: 300,
        padding: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
    infoDesc: {
        color: "white",
    },
    infoDescSong: {
        color: "white",
        textAlign: 'right',
        marginRight: 15
    },
    infoArtistName: {
        color: "white",
        fontSize: 23
    },
    controls: {

    },
    playButton: {
        borderRadius: 100,
        backgroundColor: '#3D0075',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
    },
    imgPlay: {
      width: 40,
      height: 40,
    },
    songsContainer: {
        marginTop: 30,
        width: 350
    },
    flatList: {
        width: 350
    },
    itemLink: {
        width: 350,
        marginBottom: 20,
    },
    item: {
        borderWidth: 2,
        borderColor: '#3D0075',
        borderRadius: 10,
        flexDirection: "row",
        justifyContent: "space-between",
        height: 60,
        width: 350,
        padding: 10,
    },
    itemName: {
        color: "white",
        textAlign: 'left',
        marginLeft: 15,
        fontSize: 18
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
    imgBack: {
        width: 30,
        height: 30,
    },
})

export default Album;