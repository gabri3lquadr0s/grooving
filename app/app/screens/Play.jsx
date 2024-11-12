import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, TextInput, Alert, Platform} from "react-native";
import axios from 'axios';
import {Link, router, useLocalSearchParams} from "expo-router";
import {AppContext} from "../../scripts/AppContext";
import { Audio } from 'expo-av';

const Play = () => {
    const {token, line, setLine, songPlaying, setSongPlaying} = useContext(AppContext);
    const [playing, setPlaying] = useState({});
    const [pause, setPause] = useState(false);
    const sound = React.useRef(new Audio.Sound());


    // const retrieveSong = async () => {
    //     try {
    //         const toPlay = line[0];
    //         setPlaying(toPlay);
    //         const  sound = await Audio.Sound.createAsync({uri: toPlay.link});
    //         await sound.playAsync();
    //     }
    //     catch(e) {
    //         console.log(e)
    //     }
    // }
    //
    // useEffect(() => {
    //     retrieveSong();
    // }, []);

    return(
        <View>
            <View style={styles.back}>
                <Link href={"/screens/HomeUser"} style={styles.linkBack}>
                    <Image source={require("../../assets/images/left-arrow.png")} style={styles.imgBack}/>
                </Link>
            </View>
        </View>
    )
}

export default Play;