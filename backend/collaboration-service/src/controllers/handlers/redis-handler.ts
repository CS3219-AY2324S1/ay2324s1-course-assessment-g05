import { redis } from '../../models/db';

async function getEditorContent(roomId: string) {
    return await redis.get(`${roomId}_content`);
}
  
async function getRoomDetails(roomId: string) {
    return await redis.get(`${roomId}_roomDetails`);
}
  
function setRoomDetails(roomId: string, endSession: Date, partnerId: string) {
    redis.set(`${roomId}_roomDetails`, JSON.stringify({
        endSession: endSession,
        partnerId: partnerId
    }));
}
  
function setCodeChange(roomId: string, content: string) {
    redis.set(`${roomId}_content`, content);
}

function delCodeChange(roomId: string) {
    redis.del(`${roomId}_content`);
}

function delRoomDetails(roomId: string) {
    redis.del(`${roomId}_roomDetails`);
}

export const RedisHandler = {
    getEditorContent,
    getRoomDetails,
    setRoomDetails,
    setCodeChange,
    delCodeChange,
    delRoomDetails
}