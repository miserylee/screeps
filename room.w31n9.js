const run = require('./run');

const SOURCE_ID_FOR_UPGRADE = '5bbcab449099fc012e633302';
const SOURCE_ID_FOR_HARVEST = '5bbcab449099fc012e633303';
const HYDROGEN_SOURCE_ID = '5bbcb1d040062e4259e93384';
const UPGRADER_BODY_PARTS = [WORK, WORK, WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const HARVESTER_BODY_PARTS = [WORK, CARRY, MOVE];
const BIG_HARVESTER_BODY_PARTS = [WORK, WORK, CARRY, CARRY, MOVE, MOVE];
const BUILDER_BODY_PARTS = [WORK, WORK, CARRY, MOVE, MOVE];

const SPAWN_1_NAME = 'S1';
const DEAD_FLAG_NAME = 'W31N9_Dead_Flag';

module.exports = room => {
  const controller = room.controller;
  const creeps = room.find(FIND_MY_CREEPS);
  const sourceForUpgrade = Game.getObjectById(SOURCE_ID_FOR_UPGRADE);
  const sourceForHarvest = Game.getObjectById(SOURCE_ID_FOR_HARVEST);
  const spawn1 = Game.spawns[SPAWN_1_NAME];
  const deadFlag = Game.flags[DEAD_FLAG_NAME];
  run({
    room,
    creeps,
    controller,
    deadFlag,
    sourceForUpgrade,
    sourceForHarvest,
    sourceForBuild: sourceForHarvest,
    spawn: spawn1,
    harvester: {
      amount: 2,
      body: HARVESTER_BODY_PARTS,
    },
    bigHarvester: {
      amount: 2,
      body: BIG_HARVESTER_BODY_PARTS,
    },
    upgrader: {
      amount: 2,
      body: UPGRADER_BODY_PARTS,
    },
    builder: {
      amount: 2,
      body: BUILDER_BODY_PARTS,
    },
  });
};
