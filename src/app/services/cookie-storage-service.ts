import { CookieService } from "ngx-cookie-service";
import { User } from "../models/user-model";
import { IStorage } from "./storage-interface";

export class CookieStorageService implements IStorage {

    constructor(
        protected cookie: CookieService
    ) {}

    getUserData(): User {
        const userRaw = this.cookie.get('user');
        if(userRaw === "") {
            return null;
        }

        const userData = JSON.parse(userRaw);
        
        return new User(userData.email, userData.id, userData._token, new Date(userData._tokenExpirationDate));
    }
    saveUserData(user: User): void {
        this.cookie.set('user', JSON.stringify(user));
    }
    removeUserData(): void {
        this.cookie.delete('user');
    }

}