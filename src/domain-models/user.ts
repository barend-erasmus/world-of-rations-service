export class User {
    constructor(public username: string, public lastLoginTimestamp: number) {

    }

    public isValid(): boolean {

        if (!this.username) {
            return false;
        }

        if (!this.lastLoginTimestamp) {
            return false;
        }

        return true;
    }
}
