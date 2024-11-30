import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, TextInput} from "react-native";
import axios from "axios";
import {Link} from "expo-router";

const SearchView = (props) => {
    const [filter, setFilter] = useState("");
    const [albums, setAlbums] = useState([]);
    const [artists, setArtists] = useState([]);

    const getInfo = async () => {
        try {
            if(filter) {
                const response_albums = await axios.get(`http://10.0.2.2:8000/v1/album?name=${filter}&type=all`);
                const response_artists = await axios.get(`http://10.0.2.2:8000/v1/user?username=${filter}`);
                setArtists(response_artists.data.data);
                setAlbums(response_albums.data.data);
            } else {
                setArtists([]);
                setAlbums([])
            }
        }
        catch(e) {
            console.log(e);
        }
    }

    useEffect(() => {
        getInfo();
    }, [filter])


    return (
        <View style={styles.container}>
            <View style={styles.searchbarContainer}>
                <TextInput
                    style={styles.input}
                    value={filter}
                    placeholder={"Search"}
                    placeholderTextColor="#aaa"
                    onChangeText={(text) => setFilter(text)}
                />
            </View>
            {
                albums.length > 0 ? (
                    <View>
                        <Text>Albums</Text>
                        <FlatList data={albums}
                                  contentContainerStyle={styles.flatList}
                                  numColumns={2}
                                  renderItem={({item}) =>
                                      <Link href={{pathname: `/screens/Album/${item.id}`}} passHref style={styles.imgLinks}>
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
                )   : (
                    <View></View>
                )
            }
            {
                artists.length > 0 ? (
                    <View>
                        <Text>Artists</Text>
                        <FlatList data={artists}
                                  contentContainerStyle={styles.flatList}
                                  numColumns={2}
                                  renderItem={({item}) =>
                                      <Link href={{pathname: `/screens/User/${item.id}`}} passHref style={styles.imgLinks}>
                                          <View style={styles.item}>
                                              <Image source={{uri: item.profileImage}} style={styles.albumImage} />
                                              <Text style={styles.albumName}>{item.username}</Text>
                                          </View>
                                      </Link>
                                  }
                                  keyExtractor={item => item.id.toString()}
                        />
                    </View>
                ) : (
                    <View></View>
                )
            }
        </View>
    )
}

const styles = StyleSheet.create({
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
    container: {
        flex: 1,
        justifyContent: 'space-between',
        alignItems: 'center',
        backgroundColor: "#000"
    },
    searchbarContainer: {
        width: '90%',
        marginTop: 20,
    },
    albumImage: {
        width: 150,
        height: 150,
    },
    flatList: {
        alignItems: "center",
    },
    albumName: {
        color: 'white',
        fontSize: 15,
        textAlign: 'left',
    },
    artistName: {
        color: 'white',
    },
    item: {
        padding: 20,
        borderRadius: 20,
    },
    imgLinks: {
        width: 150,
        height: 200,
    }
})

export default SearchView;