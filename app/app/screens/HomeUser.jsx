import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList} from "react-native";
import axios from 'axios';
import { AppContext } from "../../scripts/AppContext";
import { router } from "expo-router";
import AlbumView from "../../components/AlbumView";
import SearchView from "../../components/SearchView";

const HomeUser = () => {
    const [homeSelected, setHomeSelected] = useState(true);

    return(
        <View style={styles.container}>
            <View style={styles.header}>
                {homeSelected ? (
                    <View style={styles.containerHeader}>
                        <Pressable style={styles.pressableHeaderSelected} onPress={() => {setHomeSelected(true)}}>
                            <Text style={styles.headerText}>Home</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeader} onPress={() => {setHomeSelected(false)}}>
                            <Text style={styles.headerText}>Search</Text>
                        </Pressable>
                    </View>
                ) : (
                    <View style={styles.containerHeader}>
                        <Pressable style={styles.pressableHeader} onPress={() => {setHomeSelected(true)}}>
                            <Text style={styles.headerText}>Home</Text>
                        </Pressable>
                        <Pressable style={styles.pressableHeaderSelected} onPress={() => {setHomeSelected(false)}}>
                            <Text style={styles.headerText}>Search</Text>
                        </Pressable>
                    </View>
                )}
                <Pressable style={styles.pressableImageHeader}>
                    <Image style={styles.imageHeader} />
                </Pressable>
            </View>
            {
                homeSelected ? (
                    <AlbumView />
                ) : (
                    <SearchView />
                )
            }
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
        height: 120
    },
    containerHeader: {
        flex: 1,
        justifyContent: 'space-evenly',
        alignItems: 'center',
        flexDirection: 'row',
        marginTop: 30,
    },
    pressableHeaderSelected: {
        width: 110,
        height: 45,
        borderRadius: 50,
        backgroundColor: '#3D0075',
        alignItems: 'center',
        justifyContent: 'center'
    },
    pressableHeader: {
        width: 110,
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