import {createContext, useState} from "react";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [token, setToken] = useState("");
    const [line, setLine] = useState([]);
    const [user, setUser] = useState("");

    return <AppContext.Provider value={{token, setToken, user, setUser}}>
        {children}
    </AppContext.Provider>;
}