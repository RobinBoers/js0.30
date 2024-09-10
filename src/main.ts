import { Engine } from "noa-engine";
import { setupSkybox } from "./engine/sky";
import { registerBlocks } from "./engine/blocks";

const RENDER_DISTANCE = 100;

const noa = new Engine({
  debug: true,
  showFPS: true,
  chunkSize: 64,
  chunkAddDistance: RENDER_DISTANCE,
  chunkRemoveDistance: RENDER_DISTANCE,
});

setupSkybox(noa);
registerBlocks(noa);

const AIR = 0;
const GRASS = 1;
const STONE = 2;
const DIRT = 3;

function getVoxel(x: number, y: number, z: number) {
  const height = 2 * Math.sin(x / 10) + 3 * Math.cos(z / 20) + 30;

  switch (true) {
    case y < 10:
      return STONE;
    case y < 20:
      return DIRT;
    case y < height:
      return GRASS;
    default:
      return AIR;
  }
}

// `id`       an unique string id for the chunk
// `data`     an `ndarray` of voxel ID data
//            (see https://github.com/scijs/ndarray)
// `x, y, z`  world coords of the corner of the chunk

noa.world.on("worldDataNeeded", function (id, data, x, y, z) {
  for (let i = 0; i < data.shape[0]; i++) {
    for (let j = 0; j < data.shape[1]; j++) {
      for (let k = 0; k < data.shape[2]; k++) {
        data.set(i, j, k, getVoxel(x + i, y + j, z + k));
      }
    }
  }

  noa.world.setChunkData(id, data);
});

// Place grass with left click.
noa.inputs.down.on("fire", function () {
  if (noa.targetedBlock) {
    var pos = noa.targetedBlock.adjacent;
    noa.setBlock(GRASS, pos[0], pos[1], pos[2]);
  }
});

// Break block with right click.
noa.inputs.down.on("alt-fire", function () {
  if (noa.targetedBlock) {
    var pos = noa.targetedBlock.position;
    noa.setBlock(0, pos[0], pos[1], pos[2]);
  }
});
