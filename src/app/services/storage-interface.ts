import { User } from "../models/user-model";

export interface IStorage {
    getUserData(): User;
    saveUserData(user: User): void;
    removeUserData(): void;

}