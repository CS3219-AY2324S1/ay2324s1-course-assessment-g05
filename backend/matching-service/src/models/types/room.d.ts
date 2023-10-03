type Room = {
    id: string;
    owner: Partner;
    partner?: Partner;
    preference: Preferences;
    matched?: boolean = false;
    createdOn?: Date = new Date();
};

export default Room;
