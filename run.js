const Mover = require('./creep.mover');
const Upgrader = require('./creep.upgrader');
const Harvester = require('./creep.harvester');
const Builder = require('./creep.builder');
const producer = require('./creep.producer');

module.exports = ({
  room,
  creeps,
  controller,
  deadFlag,
  sourceForUpgrade,
  sourceForHarvest,
  sourceForBuild,
  spawn,
  harvester,
  bigHarvester,
  upgrader,
  builder,
}) => {
  const lowEnergyInRoom = room.energyAvailable <= 600;

  room.visual.text(
    `E:${room.energyAvailable}`,
    26,
    15,
    { align: 'left', opacity: 0.8 },
  );

  const youngCreeps = {
    upgrader: 0,
    harvester: 0,
    bigHarvester: 0,
    builder: 0,
  };
  creeps.forEach(creep => {
    const {
      role,
      isOld,
      isDying,
      moving,
    } = creep.memory;
    const energy = creep.carry.energy;

    if (isDying) {
      return;
    }

    if (creep.ticksToLive === 1) {
      Reflect.deleteProperty(Memory.creeps, creep.name);
    } else if (creep.ticksToLive > 100) {
      youngCreeps[role] += 1;
    } else {
      creep.memory.isOld = true;
    }

    if (moving) {
      if (Mover(creep).keepMove() !== OK) {
        return;
      }
      if (isOld && energy === 0) {
        creep.memory.isDying = true;
        return;
      }
    }

    if (isOld) {
      if (energy > 0) {
        switch (creep.transfer(spawn, RESOURCE_ENERGY)) {
          case ERR_NOT_IN_RANGE:
            Mover(creep).startMoving(spawn, 1, '#00ff00');
            break;
          case ERR_FULL: {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
              Mover(creep).startMoving(controller, 1, '#00ff00');
            }
          }
        }
      } else {
        const deadFlagCount = deadFlag.memory.count || 0;
        const deadFlagPos = deadFlag.pos;
        const deltaX = Math.floor(deadFlagCount / 5) + 1;
        const deltaY = deadFlagCount % 5;
        Mover(creep).startMoving({
          x: deadFlagPos.x + deltaX,
          y: deadFlagPos.y + deltaY,
        }, 1, '#ff0000');
        if (deadFlagCount >= 10) {
          deadFlag.memory.count = 0;
        } else {
          deadFlag.memory.count = deadFlagCount + 1;
        }
      }
      return;
    }

    switch (role) {
      case 'upgrader':
        Upgrader(creep, sourceForUpgrade, controller);
        break;
      case 'harvester':
      case 'bigHarvester':
        Harvester(creep, sourceForHarvest);
        break;
      case 'builder':
        if (lowEnergyInRoom && creep.carry.energy === 0) {
          break;
        }
        Builder(creep, sourceForBuild);
        break;
    }
  });

  function produceCreeps() {
    if (!spawn.isActive() || spawn.spawning) {
      return;
    }
    if (youngCreeps.harvester < harvester.amount) {
      if (producer.produce(spawn, harvester.body, 'harvester') === OK) {
        return;
      }
    } else if (youngCreeps.bigHarvester < bigHarvester.amount) {
      if (producer.produce(spawn, bigHarvester.body, 'bigHarvester') === OK) {
        return;
      }
    } else if (youngCreeps.upgrader < upgrader.amount) {
      if (producer.produce(spawn, upgrader.body, 'upgrader') === OK) {
        return;
      }
    } else if (youngCreeps.builder < builder.amount) {
      if (producer.produce(spawn, builder.body, 'builder') === OK) {
        return;
      }
    }
  }

  produceCreeps();
};

