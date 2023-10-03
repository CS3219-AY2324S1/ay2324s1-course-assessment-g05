import Preferences from "../../models/types/preferences";
import Room from "../../models/types/room";
import Complexity from "../enums/Complexity";
import Language from "../enums/Language";
import Topic from "../enums/Topic";
import { binaryToHex, encodeEnum } from "./encoder";
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
        let room = this.rooms.find(r =>
            r.preference.id == encoded &&
            !r.matched &&
            r.owner['id'] !== user.id)

        if (room) {
            room.matched = true;
            room.partner = user;
            matched(room);
        } else {
            preferences.id = encoded;
            const roomId = `${encoded}-${user.id}`

            // Ensure no duplicate room created under the same socket id
            let room = this.getRoomById(roomId);

            if (!room) {
                const newRoom: Room = {
                    id: roomId,
                    owner: user,
                    preference: preferences,
                }

                room = newRoom;
                this.rooms.push(room);
            }

            roomCreated(room);
        }

    }

    getRoomById(id: string) {
        return this.rooms.find(x => x.id === id);
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
    
    chooseRandomItem(list: string[]): string | null {
        if (list.length === 0) {
            return null;
        }

        const randomIndex = Math.floor(Math.random() * list.length);
        return list[randomIndex];
    }

    private encodePreferences(preference: Preferences): string {
        return binaryToHex(
            encodeEnum(Language, preference.languages),
            encodeEnum(Complexity, preference.difficulties),
            encodeEnum(Topic, preference.topics));
    }

}