module.exports = function Mover(creep) {
  return {
    startMoving(target, range = 1, stroke = '#ffffff') {
      creep.memory.moving = {
        target: target.pos ? target.pos : target,
        stroke,
        range,
      };
      this.keepMove();
    },
    keepMove() {
      const { moving } = creep.memory;
      if (!moving || creep.pos.inRangeTo(moving.target.x, moving.target.y, moving.range)) {
        this.finishMove();
        return OK;
      }
      creep.moveTo(moving.target.x, moving.target.y, { visualizePathStyle: { stroke: moving.stroke } });
      return ERR_NOT_IN_RANGE;
    },
    finishMove() {
      creep.memory.moving = undefined;
    },
  };
};
