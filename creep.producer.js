module.exports = {
  produce(spawn, parts, role) {
    const name = `${spawn.name}-${role}-${Game.time}`;
    return spawn.spawnCreep(parts, name, { memory: { role } });
  },
};
