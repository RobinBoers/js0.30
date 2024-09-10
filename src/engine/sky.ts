import * as BABYLON from "@babylonjs/core";
import type { Engine } from "noa-engine";

export let Clouds: BABYLON.Mesh;

export function setupSkybox(noa: Engine) {
  const scene = noa.rendering.getScene();
  const opts = {
    height: 2e3,
    width: 2e3,
  };

  Clouds = BABYLON.MeshBuilder.CreatePlane("clouds", opts, scene);

  const material = new BABYLON.StandardMaterial("cloud", scene);
  const texture = new BABYLON.Texture(
    "./assets/textures/clouds.png",
    scene,
    true,
    true,
    BABYLON.Texture.NEAREST_SAMPLINGMODE
  );

  scene.fogEnabled = true;
  scene.fogColor = new BABYLON.Color3(0.9, 0.95, 1);
  scene.clearColor = BABYLON.Color4.FromColor3(scene.fogColor);
  scene.fogMode = BABYLON.Scene.FOGMODE_EXP2;
  scene.fogDensity = 0.002;
  scene.fogStart = 0;
  scene.fogEnd = 1e3;

  texture.vScale = 0.75;
  texture.uScale = 0.75;

  material.diffuseTexture = texture;
  material.opacityTexture = texture;
  material.diffuseTexture.anisotropicFilteringLevel = 8;
  material.emissiveColor = new BABYLON.Color3(1, 1, 1);
  material.backFaceCulling = false;
  material.disableLighting = true;

  Clouds.rotation.x = -Math.PI / 2;
  Clouds.material = material;

  noa.rendering.addMeshToScene(Clouds, false);
  Clouds.setPositionWithLocalVector(new BABYLON.Vector3(0, 68, 0));
}
