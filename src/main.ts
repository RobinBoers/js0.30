import { Engine } from "noa-engine";
import { setupSkybox } from "./engine/sky";

const RENDER_DISTANCE = 100;

const noa = new Engine({
  debug: true,
  showFPS: true,
  chunkSize: 64,
  chunkAddDistance: RENDER_DISTANCE,
  chunkRemoveDistance: RENDER_DISTANCE,
});

const brownish = [0.45, 0.36, 0.22];
const greenish = [0.1, 0.8, 0.2];

noa.registry.registerMaterial("dirt", { color: brownish });
noa.registry.registerMaterial("grass", { color: greenish });

const AIR = 0;
const DIRT = noa.registry.registerBlock(1, { material: "dirt" });
const GRASS = noa.registry.registerBlock(2, { material: "grass" });

function getVoxel(x: number, y: number, z: number) {
  const height = 2 * Math.sin(x / 10) + 3 * Math.cos(z / 20) + 30;

  switch (true) {
    case y < -3:
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

setupSkybox(noa);

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

// Zoom using camera.
noa.on("tick", function (_) {
  var scroll = noa.inputs.pointerState.scrolly;
  if (scroll !== 0) {
    noa.camera.zoomDistance += scroll > 0 ? 1 : -1;
    if (noa.camera.zoomDistance < 0) noa.camera.zoomDistance = 0;
    if (noa.camera.zoomDistance > 10) noa.camera.zoomDistance = 10;
  }
});
