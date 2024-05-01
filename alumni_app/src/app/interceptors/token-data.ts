import { JwtPayload } from 'jwt-decode';

export interface TokenData extends JwtPayload {
    exp: number;
    role: string[];
}