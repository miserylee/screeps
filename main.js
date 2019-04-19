const r_w31n9 = require('./room.w31n9');

module.exports.loop = () => {
  for (const [roomName, room] of Object.entries(Game.rooms)) {
    if (roomName === 'W31N9') {
      r_w31n9(room);
    }
  }
};
