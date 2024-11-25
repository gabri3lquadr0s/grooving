import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, ScrollView} from "react-native";
import { Link } from 'expo-router';
import {AppContext} from "../scripts/AppContext";
import axios from "axios";

const AlbumView = () => {
    const [page, setPage] = useState(1);
    const [type, setType] = useState("lp");
    const {token} = useContext(AppContext);
    const [trending, setTrending] = useState([]);
    const [lastHeard, setLastHeard] = useState([]);
    const [newAlbums, setNewAlbums] = useState([]);

    const getTrendingAlbums = async () => {
        try {
            const res = await axios.get(
                `http://10.0.2.2:8000/v1/album?page=${page}&type=${type}`,
                {headers: {Authorization: `Bearer ${token}`}}
            );
            return res.data.data;
        }
        catch(e) {
            console.log(e);
        }
    }

    const getLastHeardByUser = async () => {

    }

    const getNewAlbums = async () => {

    }

    useEffect(() => {
        getTrendingAlbums().then(r => setTrending(r));
        getLastHeardByUser();
        getNewAlbums();
    }, [])


    return (
        <View style={styles.containerAlbumView}>
            <ScrollView>
                <View style={styles.collection}>
                    <Text style={styles.collectionText}>Trending right now</Text>
                    <FlatList data={trending}
                              horizontal={true}
                              contentContainerStyle={styles.flatList}
                              renderItem={({item}) =>
                                  <Link href={{pathname: `/screens/Album/${item.id}`}} passHref>
                                      <View style={styles.item}>
                                          <Image source={{uri: item.albumImage}} style={styles.albumImage} />
                                          <Text style={styles.albumName}>{item.name}</Text>
                                          <Text style={styles.artistName}>{item.User.username}</Text>
                                      </View>
                                  </Link>
                              }
                              keyExtractor={item => item.id.toString()}
                    />
                </View>
                <View style={styles.collection}>
                    <Text style={styles.collectionText}>Get right back to listening</Text>
                    {/*<FlatList data={trending} renderItem={Item} style={styles.collectionList} />*/}
                </View>
                <View style={styles.collection}>
                    <Text style={styles.collectionText}>Things you might like</Text>
                    {/*<FlatList data={} renderItem={} style={styles.collectionList} />*/}
                </View>
                <View style={styles.collection}>
                    <Text style={styles.collectionText}>Explore some genres</Text>
                    {/*<FlatList data={} renderItem={} style={styles.collectionList} />*/}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    albumImage: {
        width: 150,
        height: 150,
    },
    flatList: {
        alignItems: "center"
    },
    item: {
        padding: 20,
        borderRadius: 20,
    },
    containerAlbumView: {
        flex: 1,
        backgroundColor: '#000',
    },
    albumName: {
        color: 'white',
        fontSize: 15,
        textAlign: 'left',
    },
    artistName: {
        color: 'white',
    },
    collectionText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center',
        fontWeight: 'bold',
        marginTop: 20,
    }
})

export default AlbumView;