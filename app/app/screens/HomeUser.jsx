import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList} from "react-native";
import axios from 'axios';
import { AppContext } from "../../scripts/AppContext";
import { router } from "expo-router";
import AlbumView from "../../components/AlbumView";
import SearchView from "../../components/SearchView";
import MyPage from "../../components/MyPage";
import Playlists from "../../components/Playlists";

const HomeUser = () => {
    const [pageSelected, setPageSelected] = useState(0);

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                {pageSelected === 0 &&
                    <View style={styles.containerHeader}>
                        <Pressable style={styles.pressableHeaderSelected} onPress={() => {setPageSelected(0)}}>
                            <Text style={styles.headerText}>Home</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(1)}}>
                            <Text style={styles.headerText}>Search</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(2)}}>
                            <Text style={styles.headerText}>Playlists</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(3)}}>
                            <Text style={styles.headerText}>You</Text>
                        </Pressable>
                    </View>
                }
                {pageSelected === 1 &&
                    <View style={styles.containerHeader}>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(0)}}>
                            <Text style={styles.headerText}>Home</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeaderSelected} onPress={() => {setPageSelected(1)}}>
                            <Text style={styles.headerText}>Search</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(2)}}>
                            <Text style={styles.headerText}>Playlists</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(3)}}>
                            <Text style={styles.headerText}>You</Text>
                        </Pressable>
                    </View>
                }
                {pageSelected === 2 &&
                    <View style={styles.containerHeader}>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(0)}}>
                            <Text style={styles.headerText}>Home</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(1)}}>
                            <Text style={styles.headerText}>Search</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeaderSelected} onPress={() => {setPageSelected(2)}}>
                            <Text style={styles.headerText}>Playlists</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(3)}}>
                            <Text style={styles.headerText}>You</Text>
                        </Pressable>
                    </View>
                }
                {pageSelected === 3 &&
                    <View style={styles.containerHeader}>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(0)}}>
                            <Text style={styles.headerText}>Home</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(1)}}>
                            <Text style={styles.headerText}>Search</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setPageSelected(2)}}>
                            <Text style={styles.headerText}>Playlists</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeaderSelected} onPress={() => {setPageSelected(3)}}>
                            <Text style={styles.headerText}>You</Text>
                        </Pressable>
                    </View>
                }
                <Pressable style={styles.pressableImageHeader}>
                    <Image style={styles.imageHeader} />
                </Pressable>
            </View>
            {pageSelected === 0 && <AlbumView />}
            {pageSelected === 1 && <SearchView />}
            {pageSelected === 2 && <Playlists />}
            {pageSelected === 3 && <MyPage />}
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // justifyContent: 'center',
        // alignItems: 'center',
    },
    header: {
        width: "100%",
        flexDirection: "row",
        alignItems: "center",
        justifyContent: 'space-evenly',
        backgroundColor: '#000',
        height: 120,
        borderBottomWidth: 5,
        borderColor: '#3D0075',
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 30,
    },
    pressableHeaderSelected: {
        width: 80,
        height: 45,
        borderRadius: 50,
        backgroundColor: '#3D0075',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pressableHeader: {
        width: 80,
        height: 45,
        borderRadius: 50,
        backgroundColor: '#0f0f0f',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pressableImageHeader: {

    },
    imageHeader: {

    },
    headerText: {
        color: '#fff',
        fontSize: 18
    }
})

export default HomeUser;