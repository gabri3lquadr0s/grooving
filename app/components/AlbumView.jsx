import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList} from "react-native";
import {AppContext} from "../scripts/AppContext";
import axios from "axios";

const Item = (title, img, artist) => {
    console.log(title, img, artist)

    return(
        <View style={styles.containerAlbum}>
            <Text>{title}</Text>
        </View>
    )
}

const AlbumView = (props) => {
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
            setTrending(res.data);
        }
        catch(e) {
            console.log(e);
        }
    }

    const getLastHeardByUser = () => {

    }

    const getNewAlbums = () => {

    }

    useEffect(() => {
        getTrendingAlbums();
        getLastHeardByUser();
        getNewAlbums();
    }, [])

    return (
        <View style={styles.containerAlbumView}>
            <View style={styles.collection}>
                <Text style={styles.collectionText}>Get right back to listening</Text>
                <FlatList data={trending}
                          renderItem={({item}) => (
                            <Item name={item.name} type={item.type.toUpperCase()} artist={item.User.username} img={item.albumImage} />
                          )}
                          keyExtractor={item => item.id.toString()}
                          style={styles.collectionList} />
            </View>
            {/*<View style={styles.collection}>*/}
            {/*    <Text style={styles.collectionText}>Trending right now</Text>*/}
            {/*    <FlatList data={trending} renderItem={Item} style={styles.collectionList} />*/}
            {/*</View>            */}
            {/*<View style={styles.collection}>*/}
            {/*    <Text style={styles.collectionText}>Get right back to listening</Text>*/}
            {/*    <FlatList data={} renderItem={} style={styles.collectionList} />*/}
            {/*</View>*/}
        </View>
    )
}

const styles = StyleSheet.create({

})

export default AlbumView;