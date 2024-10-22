import {createContext, useState} from "react";

export const AppContext = createContext();
export const AppProvider = ({ children }) => {
    const [token, setToken] = useState("")

    return <AppContext.Provider value={{token, setToken}}>
        {children}
    </AppContext.Provider>;
}