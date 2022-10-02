import { ColliderDesc, RigidBodyDesc, World } from '@dimforge/rapier3d-compat';
import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from 'three';
import { noise3 } from '../lib';

const TERRAIN_SIZE = 16;
const TERRAIN_STRIDE = TERRAIN_SIZE + 1;

export class TerrainShape {
  private heightMap = new Float32Array(TERRAIN_STRIDE ** 2);
  private positionBuffer = new Float32BufferAttribute(TERRAIN_STRIDE ** 2 * 18, 3);
  private geometry = new BufferGeometry();
  private material = new MeshStandardMaterial({ color: new Color(0x448833) });
  private mesh = new Mesh(this.geometry, this.material);

  constructor(private origin: Vector3) {
    this.mesh.position.copy(origin);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();
    this.mesh.receiveShadow = true;

    for (let y = 0; y < TERRAIN_STRIDE; y++) {
      for (let x = 0; x < TERRAIN_STRIDE; x++) {
        const index = hmIndex(x, y);
        let h = 0;

        // Cheesy multi-octave noise.
        for (let octave = 1; octave < 4; octave++) {
          const scale = 2 ** octave / 16;
          const xo = (x + origin.x) * scale;
          const yo = (y + origin.z) * scale;
          const xi = Math.floor(xo);
          const yi = Math.floor(yo);
          const xf = xo - xi;
          const yf = yo - yi;
          const h00 = noise3(xi, yi, octave);
          const h01 = noise3(xi, yi + 1, octave);
          const h10 = noise3(xi + 1, yi, octave);
          const h11 = noise3(xi + 1, yi + 1, octave);
          const h0 = h00 * (1 - xf) + h10 * xf;
          const h1 = h01 * (1 - xf) + h11 * xf;
          h += h0 * (1 - yf) + h1 * yf;
        }

        h = Math.max(h * 1.5 - 1.8, 0);
        this.heightMap[index] = h;
      }
    }

    this.genMesh();
  }

  public dispose() {
    this.geometry.dispose();
    this.material.dispose();
    this.mesh.parent?.remove(this.mesh);
  }

  public addToScene(parent: Object3D) {
    parent.add(this.mesh);
  }

  private genMesh() {
    const position: number[] = [];
    const indices: number[] = [];

    const pushVertex = (x: number, y: number) => {
      position.push(x, this.heightMap[hmIndex(x, y)], y);
    };

    // For this demo, we want terrain contours to be clearly visible, so generate
    // separate triangles.
    for (let y = 0; y < TERRAIN_SIZE; y++) {
      for (let x = 0; x < TERRAIN_SIZE; x++) {
        const index = position.length / 3;
        pushVertex(x, y);
        pushVertex(x, y + 1);
        pushVertex(x + 1, y);
        pushVertex(x + 1, y);
        pushVertex(x, y + 1);
        pushVertex(x + 1, y + 1);
        indices.push(index, index + 1, index + 2);
        indices.push(index + 3, index + 4, index + 5);
      }
    }

    this.positionBuffer.copyArray(position);
    this.positionBuffer.needsUpdate = true;
    this.geometry.setAttribute('position', this.positionBuffer);
    this.geometry.setIndex(indices);
    this.geometry.computeVertexNormals();
  }

  public addPhysics(world: World) {
    const rbDesc = RigidBodyDesc.newStatic().setTranslation(
      this.origin.x + TERRAIN_SIZE * 0.5,
      this.origin.y,
      this.origin.z + TERRAIN_SIZE * 0.5
    );
    const terrainBody = world.createRigidBody(rbDesc);
    const clDesc = ColliderDesc.heightfield(
      TERRAIN_SIZE,
      TERRAIN_SIZE,
      this.heightMap,
      new Vector3(TERRAIN_SIZE, 1, TERRAIN_SIZE)
    );
    world.createCollider(clDesc, terrainBody);
  }
}

const hmIndex = (x: number, y: number) => x * TERRAIN_STRIDE + y;
