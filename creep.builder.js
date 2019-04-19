const Mover = require('./creep.mover');

module.exports = function Builder(creep, source) {
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
      if (creep.memory.isHarvesting) {
        const target = creep.pos.findClosestByPath(FIND_STRUCTURES, {
          filter: structure => {
            return [
              STRUCTURE_EXTENSION,
            ].includes(structure.structureType) && structure.energy > 10;
          },
        });
        if (target) {
          creep.memory.target = target.id;
        } else {
          creep.memory.target = source.id;
        }
      } else {
        const target = creep.pos.findClosestByPath(FIND_MY_CONSTRUCTION_SITES);
        if (target) {
          creep.memory.target = target.id;
        }
      }
    }
    if (creep.memory.target) {
      let target = Game.getObjectById(creep.memory.target);
      if (!target) {
        creep.memory.target = undefined;
        aimTarget();
        return;
      }
      if (creep.memory.isHarvesting) {
        const result = (target instanceof Source) ?
          creep.harvest(target) :
          creep.withdraw(target, RESOURCE_ENERGY);
        switch (result) {
          case ERR_NOT_IN_RANGE:
            Mover(creep).startMoving(target, 1, '#ff00ff');
            break;
          case ERR_NOT_ENOUGH_RESOURCES:
            creep.memory.target = undefined;
            aimTarget();
            break;
        }
      } else {
        switch (creep.build(target)) {
          case ERR_NOT_IN_RANGE:
            Mover(creep).startMoving(target, 3, '#00ff00');
            break;
          case ERR_INVALID_TARGET:
            creep.memory.target = undefined;
            aimTarget();
            break;
        }
      }
    } else if (creep.carry.energy > 0) {
      creep.memory.isHarvesting = false;
    }
  }

  aimTarget();
};
