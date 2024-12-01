import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, TextInput, Alert, Platform, Button} from "react-native";
import axios from 'axios';
import {Link, router, useLocalSearchParams} from "expo-router";
import {AppContext} from "../../scripts/AppContext";
import { Audio } from 'expo-av';

const Play = () => {
    const {token, line, setLine, songPlaying, setSongPlaying, playing, setPlaying} = useContext(AppContext);
    const [img, setImg] = useState(null);
    const [info, setInfo] = useState(null);

    const retrieveSong = async (action="play") => {
        try {
            if(action === "skip") {
                setLine(line.slice(1));
            }
            if (songPlaying && action === "play") {
                await songPlaying.playAsync();
                setPlaying(true);
                return;
            }
            let new_song = line[0];
            setInfo(new_song);
            if(!new_song) {
                router.push("/app/screens/HomeUser");
            }
            const {sound: newSound} = await Audio.Sound.createAsync({
                uri: new_song.link
            });
            setSongPlaying(newSound);
            await newSound.playAsync();
            setPlaying(true);

            const get_albumimg = await axios.get(`http://10.0.2.2:8000/v1/album/${new_song.AlbumId}`,
                {headers : { Authorization: `Bearer ${token}` }}
            );

            setImg(get_albumimg.data.data.albumImage);
            newSound.setOnPlaybackStatusUpdate((status) => {
                if(status.didJustFinish) {
                    setPlaying(false);
                }
            });
        }
        catch(e) {
            console.log(e)
        }
    }

    const pauseAudio = async () => {
        if (songPlaying) {
            await songPlaying.pauseAsync();
            setPlaying(false);
        }
    };

    useEffect(() => {
        return () => {
            if (songPlaying) {
                songPlaying.unloadAsync();
            }
        };
    }, [songPlaying]);

    return(
        <View style={styles.container}>
            <View style={styles.back}>
                <Link href={"/screens/HomeUser"} style={styles.linkBack}>
                    <Image source={require("../../assets/images/left-arrow.png")} style={styles.imgBack}/>
                </Link>
            </View>
            <View style={styles.container}>
                {
                    img ? (
                        <View style={styles.imgView}>
                            <Image style={styles.albumImage} source={{uri: img}} />
                            <Text style={styles.songName}>{info.name}</Text>
                        </View>
                    ) : (
                        <View style={styles.imgView}>
                            <Image style={styles.albumImage} source={require('../../assets/images/album.png')} />
                            <Text style={styles.songName}>Musica</Text>
                        </View>
                    )
                }
                <View style={styles.containerPlayer}>
                    <Pressable onPress={async () => {
                        await pauseAudio();
                        await retrieveSong("skip")
                    }} style={styles.playButton}>
                        <Image source={require("../../assets/images/skip2.png")} style={styles.imgPlay}/>
                    </Pressable>
                    <Pressable onPress={playing ? pauseAudio : retrieveSong} style={styles.playButton}>
                        {
                            playing ? (
                                <Image source={require("../../assets/images/pause.png")} style={styles.imgPlay}/>
                            ) : (
                                <Image source={require("../../assets/images/play.png")} style={styles.imgPlay}/>
                            )
                        }
                    </Pressable>
                    <Pressable onPress={async () => {
                        await pauseAudio();
                        await retrieveSong("skip")
                    }} style={styles.playButton}>
                        <Image source={require("../../assets/images/skip.png")} style={styles.imgPlay}/>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: '#000',
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
    albumImage: {
        width: 200,
        height: 200,
    },
    playButton: {
        borderRadius: 100,
        backgroundColor: '#3D0075',
        width: 60,
        height: 60,
        alignItems: 'center',
        justifyContent: 'center',
        marginLeft: 10,
        marginRight: 10,
    },
    imgPlay: {
        width: 40,
        height: 40,
    },
    containerPlayer: {
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
    songName: {
        fontSize: 20,
        color: "#fff"
    },
    imgView: {
        flex: 1,
        alignItems: "center",
    }
})

export default Play;