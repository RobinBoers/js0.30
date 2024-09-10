import type { Engine } from "noa-engine";

export const Inventory = [...Array(65).keys()];
export const Hotbar = [...Array(10).keys()];

export const Blocks = {
  grass: ["dirt_side", "dirt_side", "grass", "dirt", "dirt_side", "dirt_side"],
  stone: "stone",
  dirt: "dirt",
  wood: "planks",
  red_flower: "red_flower",
  yellow_flower: "yellow_flower",
  water: "water",
  bush: "sapling",
  rock: "cobblestone",
  bedrock: "bedrock",
  sand: "sand",
  gravel: "gravel",
  tree: ["log_side", "log_side", "log_top", "log_top", "log_side", "log_side"],
  leaves: "leaves_opaque",
  red_mushroom: "red_mushroom",
  brown_mushroom: "brown_mushroom",
  lava: "lava",
  rock_gold: "gold_ore",
  rock_brone: "iron_ore",
  rock_coal: "coal_ore",
  bricks: "bricks",
  sponge: "sponge",
  glass: "glass",
  red_cloth: "color0",
  orange_cloth: "color1",
  yellow_cloth: "color2",
  chartreuse_cloth: "color3",
  green_cloth: "color4",
  spring_green_cloth: "color5",
  cyan_cloth: "color6",
  capri_cloth: "color7",
  ultramarine_cloth: "color8",
  violet_cloth: "color9",
  purple_cloth: "color10",
  magenta_cloth: "color11",
  rose_cloth: "color12",
  dark_gray_cloth: "color13",
  light_gray_cloth: "color14",
  white_cloth: "color15",
};

export function registerBlocks(noa: Engine) {
  Object.entries(Blocks).forEach(([_name, textures], index) => {
    registerMaterials(noa, wrap(textures));
    noa.registry.registerBlock(index + 1, { material: textures });
  });
}

function registerMaterials(noa: Engine, textures: string[]) {
  textures.forEach((texture) => {
    noa.registry.registerMaterial(texture, {
      textureURL: `./assets/textures/blocks/${texture}.png`,
    });
  });
}

function wrap<T>(value: T | T[]): T[] {
  return Array.isArray(value) ? value : [value];
}
