import { useLayoutEffect, useRef } from 'react';
import { Object3D, BoxGeometry, MeshLambertMaterial, InstancedMesh } from 'three';
import { useControls } from 'leva';
import { SimplexNoise } from 'three/examples/jsm/Addons.js';

import { blockData } from './blockHelpers';

const cubeObject = new Object3D()
const cubeGeometry = new BoxGeometry(1, 1, 1)
const cubeMaterial = new MeshLambertMaterial({ color: "#00d000" })

const World = () => {
  const blocksDataArray: blockData[][][] = [];

  const { worldHeight, worldWidth, scale, offset, magnitude } = useControls({
    worldHeight: {
      value: 16,
      min: 8,
      max: 64,
      step: 1
    },
    worldWidth: {
      value: 32,
      min: 8,
      max: 128,
      step: 1
    },
    magnitude: {
      value: 0.5,
      min: 0,
      max: 1,
      step: 0.01
    },
    offset: {
      value: 0.2,
      min: 0,
      max: 1,
      step: 0.01
    },
    scale: {
      value: 30,
      min: 0,
      max: 100,
      step: 1
    }
  })

  // const blockHelper = new BlockMethods(worldHeight, worldWidth, blocksDataArray);

  const instancedMeshRef = useRef<InstancedMesh>(null!);
  useLayoutEffect(() => {
    initTerrain();
    generateTerrain();
    generateMeshes();
  }, [worldWidth, worldHeight, scale, magnitude, offset]);

  return (
    <group>
      <instancedMesh ref={instancedMeshRef} args={[cubeGeometry, cubeMaterial, worldWidth * worldWidth * worldHeight]} />
    </group>
  )

  function getBlock(x: number, y: number, z: number): blockData | null {
    if (checkInBounds(x, y, z)) {
      return blocksDataArray[x][y][z];
    } else {
      return null;
    }
  }

  function checkInBounds(x: number, y: number, z: number): boolean {
    if (x >= 0 && x < worldWidth &&
      y >= 0 && y < worldHeight &&
      z >= 0 && z < worldWidth) {
      return true;
    } else {
      return false;
    }
  }

  function setBlockId(x: number, y: number, z: number, id: number): void {
    if (checkInBounds(x, y, z)) {
      blocksDataArray[x][y][z].blockId = id;
    }
  }

  function setInstanceId(x: number, y: number, z: number, instanceId: number): void {
    if (checkInBounds(x, y, z)) {
      blocksDataArray[x][y][z].blockInstanceId = instanceId;
    }
  }

  function initTerrain(): void {
    for (let x = 0; x < worldWidth; x++) {
      let slice = [];
      for (let y = 0; y < worldHeight; y++) {
        let row = [];
        for (let z = 0; z < worldWidth; z++) {
          row.push({
            blockId: 0,
            blockInstanceId: null,
          })
        }
        slice.push(row)
      }
      blocksDataArray.push(slice);
    }
  }

  function generateTerrain() {
    const simplex = new SimplexNoise();
    for (let x = 0; x < worldWidth; x++) {
      for (let z = 0; z < worldWidth; z++) {

        const value = simplex.noise(
          x / scale,
          z / scale
        );

        const scaledNoise = offset + magnitude * value;

        let height = Math.floor(worldHeight * scaledNoise);
        height = Math.max(0, Math.min(height, worldHeight - 1))

        for (let y = 0; y <= height; y++) {
          setBlockId(x, y, z, 1);
        }
      }
    }
  }

  function generateMeshes() {
    let count = 0;
    const orbitControlsOffset = worldWidth / 2;
    for (let x = 0; x < worldWidth; x++) {
      for (let y = 0; y < worldHeight; y++) {
        for (let z = 0; z < worldWidth; z++) {
          const blockId = getBlock(x, y, z)?.blockId;
          const blockInstanceId = count;

          if (blockId !== 0) {
            cubeObject.position.set((x - orbitControlsOffset) + 0.5, y + 0.5, (z - orbitControlsOffset) + 0.5);
            cubeObject.updateMatrix();
            instancedMeshRef.current.setMatrixAt(blockInstanceId, cubeObject.matrix);
            setInstanceId(x, y, z, blockInstanceId);
            count++;
          }
        }
      }
    }
    instancedMeshRef.current.instanceMatrix.needsUpdate = true;
  }
}

export default World