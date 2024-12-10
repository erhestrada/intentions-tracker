import { storeUser } from "./storeUser";

export function getOrCreateUniqueId() {
    let uuid = localStorage.getItem('uniqueId');
    if (!uuid) {
      uuid = generateUUID();
      localStorage.setItem('uniqueId', uuid);
      storeUser(uuid);
    }
    console.log('user id: ', uuid);
    return uuid;
  }

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
