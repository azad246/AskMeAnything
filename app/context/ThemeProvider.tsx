"use client";
import {createContext,useContext,useEffect,useState} from "react";


interface ThemeContextType{
    mode:string;
    setMode:(mode:string)=>void;
}
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({children}:{children:React.ReactNode}) => {
    const [mode, setMode] = useState('dark');

    const handleThemeChange = () => {
        if (localStorage.theme==='dark' || (!("theme" in localStorage) && window.matchMedia('(prefers-color-scheme:dark)').matches)) {
            setMode('dark');
            document.documentElement.classList.add('dark');
        } else {
            setMode('light');
            document.documentElement.classList.remove('dark');
        }
    };
    
    useEffect(() => {
       handleThemeChange();
    }, [mode]); 

    return (
        <ThemeContext.Provider value={{mode,setMode}}>
            {children}
        </ThemeContext.Provider>
    )
}

export const useTheme=()=>{
    const context=useContext(ThemeContext);
    if(context===undefined){
        throw new Error("UseTheme must be used within a context provider")
    }
    return context;
}