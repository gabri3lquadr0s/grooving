import React, {useState, useRef, useEffect} from "react";
import {View, StyleSheet, Text, Image, Pressable, TextInput} from "react-native";

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    return(
        <View>
            <View>
                {/*<Image style={styles.image} source={require('./assets/logo.png')} />*/}
                <Text>Grooving</Text>
            </View>
            <View>
                <TextInput style={styles.input} value={email} placeholder={"Email"} onChangeText={(text) => setEmail(text)}></TextInput>
                <TextInput style={styles.input} value={email} placeholder={"Password"} onChangeText={(text) => setPassword(text)}></TextInput>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default Login;