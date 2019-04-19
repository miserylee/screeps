const Mover = require('./creep.mover');

module.exports = function Upgrader(creep, source, controller) {
  if (creep.memory.isHarvesting) {
    if (creep.carry.energy === creep.carryCapacity) {
      creep.memory.isHarvesting = false;
    }
  } else {
    if (creep.carry.energy === 0) {
      creep.memory.isHarvesting = true;
    }
  }

  if (creep.memory.isHarvesting) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      Mover(creep).startMoving(source, 1, '#ff00ff');
    }
  } else {
    if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
      Mover(creep).startMoving(controller, 5, '#00ff00');
    }
  }
};
