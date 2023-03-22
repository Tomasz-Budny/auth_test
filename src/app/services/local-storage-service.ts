import { User } from "../models/user-model";
import { IStorage } from "./storage-interface";

export class LocalStorageService implements IStorage {

    getUserData(): User {
        const userData = JSON.parse(localStorage.getItem('userData'));
        if (!userData) {
            return null;
        }
        return new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    }

    saveUserData(user: User): void {
        localStorage.setItem('userData', JSON.stringify(user));
    }
    removeUserData(): void {
        localStorage.removeItem('userData');
    }

}