import React, {useState, useRef, useEffect, useContext} from "react";
import {View, StyleSheet, Text, Image, Pressable, FlatList, TextInput} from "react-native";

const SearchView = (props) => {
    const [filter, setFilter] = useState(0);
    const [data, setData] = useState([]);

    const getInfo = async () => {
        try {

        }
        catch(e) {

        }
    }

    return (
        <View>
            <View>
                <TextInput />
                {/*picker para filtro*/}
            </View>
        </View>
    )
}

const styles = StyleSheet.create({

})

export default SearchView;