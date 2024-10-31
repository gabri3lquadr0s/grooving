import {createContext, useState} from "react";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [line, setLine] = useState([]);
    const [songPlaying, setSongPlaying] = useState({});
    const [playing, setPlaying] = useState(false);
    const [user, setUser] = useState("");

    return <AppContext.Provider value={{token, setToken, user, setUser, line, setLine, songPlaying, setSongPlaying, playing, setPlaying}}>
        {children}
    </AppContext.Provider>;
}