import { jwtDecode, JwtPayload } from 'jwt-decode';
import { TokenData } from "./token-data";

export enum LocalStorageKeys {
    TOKEN = 'token'
}

export const getToken = (key: string) => {
    const result = localStorage.getItem(key);
    return !!result && result;
};

export const getTokenjwt = (key: string) => {
    return localStorage.getItem(key);
};

export const getTokenTimeOut = (token: string) => {
    const decodedToken: TokenData = jwtDecode<TokenData>(token);
    const currentTime: number = Math.floor(Date.now() / 1000);

    return decodedToken.exp < currentTime;
};

export const clearLocalStorage = () => {
    localStorage.clear();
    sessionStorage.clear();
};

export const getRole = (token: string) => {
    const decodedToken: TokenData = jwtDecode<TokenData>(token);
    return decodedToken.role[0];
}

export const isLoggedInKey = (rol: string) => {
    const user = localStorage.getItem(rol);
    if (user) {
        return true;
    }
    return false;
}

export const EXPORT_DATE_NOW = new Date().toLocaleDateString();

