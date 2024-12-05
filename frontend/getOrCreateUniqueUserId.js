export function getOrCreateUniqueId() {
    let id = localStorage.getItem('uniqueId');
    if (!id) {
      id = generateUUID();
      localStorage.setItem('uniqueId', id);
    }
    console.log('user id: ', id);
    return id;
  }

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        var r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}
