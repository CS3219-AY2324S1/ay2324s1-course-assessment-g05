import Preferences from "../../models/types/preferences";
import Room from "../../models/types/room";
import Complexity from "../enums/Complexity";
import Language from "../enums/Language";
import Topic from "../enums/Topic";
import { binaryToHex, encodeEnum } from "./enumUtils";
import Partner from "../../models/types/partner";

export default class RoomManager {
    private static instance: RoomManager;
    private rooms: Room[] = [];

    public static getInstance(): RoomManager {
        if (!RoomManager.instance) {
            RoomManager.instance = new RoomManager();
        }
        return RoomManager.instance;
    }

    findMatchElseCreateRoom(
        user: Partner,
        preferences: Preferences,
        matched: (room: Room) => void,
        roomCreated: (room: Room) => void,
    ) {
        let encoded = this.encodePreferences(preferences)
        let room = this.rooms.find(r => r.preference.id == encoded && !r.matched)

        if (room) {
            room.matched = true;
            matched(room);
        } else {
            preferences.id = encoded;
            const room: Room = {
                id: `${encoded}-${user.id}`,
                owner: user,
                preference: preferences,
            }

            this.rooms.push(room);
            roomCreated(room);
        }

    }

    closeRoom(id: string) {
        try {
            this.rooms = this.rooms.filter(x => x.id !== id)
        } catch (error) {
            console.log("[closeRoom] Invalid room id.");
        }
    }

    count() {
        return this.rooms.length;
    }

    list() {
        return this.rooms;
    }

    private encodePreferences(preference: Preferences): string {
        return binaryToHex(
            encodeEnum(Language, preference.languages),
            encodeEnum(Complexity, preference.difficulties),
            encodeEnum(Topic, preference.topics));
    }
}