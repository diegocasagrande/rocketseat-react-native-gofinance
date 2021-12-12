import React, { createContext, ReactNode, useContext } from "react";
import * as AuthSession from 'expo-auth-session';

const { CLIENT_ID } = process.env;
const { REDIRECT_URI } = process.env;


interface user {
    id: string;
    name: string;
    email: string;
    photo?: string;

}


interface IAuthConstextData {
    user: user;
    signInWithGoogle(): Promise<void>;
}

interface AuthProviderProps {
    children: ReactNode;
}

interface AuthorizationResponse {
    params: {
        access_token: string;
    },
    type: string;
}



export const AuthContext = createContext({} as IAuthConstextData);


function AuthProvider({children}: AuthProviderProps) {

    const [user, setUser] = React.useState<user>({} as user);

    async function signInWithGoogle() {
        try {

            console.log(
                REDIRECT_URI,
                CLIENT_ID
            );
            
            const SCOPES = encodeURI("profile email");
            const RESPONSE_TYPE = "token";
            const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}&scope=${SCOPES}&response_type=${RESPONSE_TYPE}`;
    
            const {type, params } = await AuthSession.startAsync({ authUrl }) as AuthorizationResponse;
            
            if (type === 'success') {
                // console.log(params.access_token);
                const response = await fetch(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${params.access_token}`);
                const userInfo = await response.json();
                console.log(userInfo);
                setUser({
                    id: userInfo.id,
                    name: userInfo.given_name,
                    email: userInfo.email,
                    photo: userInfo.picture
                })
            } else {
                console.log('error');
            }
            
        } catch (error) {
            throw error;
        }
    
    }    

    return (
        <AuthContext.Provider value={{
            user,
            signInWithGoogle,
        }}>
            {children}
        </AuthContext.Provider>
    );
}



function useAuth() {
    const data = useContext(AuthContext);
    return data;
}

export { AuthProvider, useAuth };