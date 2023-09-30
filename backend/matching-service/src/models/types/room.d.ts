type Room = {
    id: string;
    owner: User;
    preference: Preferences;
    matched?: boolean = false;
    createdOn?: Date = new Date();
};

export default Room;
