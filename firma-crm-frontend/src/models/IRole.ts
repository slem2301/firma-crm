import { IUser } from "./IUser";

export interface IRole {
    id: number;
    role: string;
    users: IUser[];
}
