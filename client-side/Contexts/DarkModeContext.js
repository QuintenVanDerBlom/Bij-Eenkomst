import React, { createContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const DarkModeContext = createContext();

export const DarkModeProvider = ({ children }) => {
    const [isDarkMode, setIsDarkMode] = useState(false);

    useEffect(() => {
        const loadTheme = async () => {
            try {
                const value = await AsyncStorage.getItem("theme");
                if (value !== null) {
                    setIsDarkMode(JSON.parse(value));
                }
            } catch (e) {
                console.error("Fout bij ophalen thema:", e);
            }
        };
        loadTheme();
    }, []);

    const toggleDarkMode = async () => {
        try {
            const newTheme = !isDarkMode;
            setIsDarkMode(newTheme);
            await AsyncStorage.setItem("theme", JSON.stringify(newTheme));
        } catch (e) {
            console.error("Fout bij opslaan thema:", e);
        }
    };

    return (
        <DarkModeContext.Provider value={{ isDarkMode, toggleDarkMode }}>
            {children}
        </DarkModeContext.Provider>
    );
};
