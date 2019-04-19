const Mover = require('./creep.mover');

module.exports = function Harvester(creep, source) {
  if (creep.memory.isHarvesting) {
    if (creep.carry.energy === creep.carryCapacity) {
      creep.memory.isHarvesting = false;
    }
  } else {
    if (creep.carry.energy === 0) {
      creep.memory.isHarvesting = true;
      creep.memory.target = undefined;
    }
  }

  function aimTarget() {
    if (!creep.memory.target) {
      const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
          return [
            STRUCTURE_EXTENSION,
            STRUCTURE_SPAWN,
            STRUCTURE_TOWER,
          ].includes(structure.structureType) && structure.energy < structure.energyCapacity;
        },
      });
      if (target) {
        creep.memory.target = target.id;
      }
    }
    if (creep.memory.target) {
      const target = Game.getObjectById(creep.memory.target);
      if (!target) {
        creep.memory.target = undefined;
        aimTarget();
        return;
      }
      switch (creep.transfer(target, RESOURCE_ENERGY)) {
        case ERR_NOT_IN_RANGE:
          Mover(creep).startMoving(target, 1, '#00ff00');
          break;
        case ERR_FULL:
          creep.memory.target = undefined;
          aimTarget();
          break;
      }
    }
  }

  if (creep.memory.isHarvesting) {
    if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
      Mover(creep).startMoving(source, 1, '#ff00ff');
    }
  } else {
    aimTarget();
  }
};
