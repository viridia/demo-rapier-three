import {
  BufferGeometry,
  Color,
  Float32BufferAttribute,
  Mesh,
  MeshStandardMaterial,
  Object3D,
  Vector3,
} from 'three';

const TERRAIN_SIZE = 16;
const TERRAIN_STRIDE = TERRAIN_SIZE + 1;

export class TerrainShape {
  private heightMap = new Float32Array(TERRAIN_STRIDE ** 2);
  private positionBuffer = new Float32BufferAttribute(TERRAIN_STRIDE ** 2 * 3, 3);
  private geometry = new BufferGeometry();
  private material = new MeshStandardMaterial({ color: new Color(0x448833) });
  private mesh = new Mesh(this.geometry, this.material);

  constructor(private origin: Vector3) {
    this.mesh.position.copy(origin);
    this.mesh.matrixAutoUpdate = false;
    this.mesh.updateMatrix();

    this.heightMap[2] = 1;

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

    for (let y = 0; y < TERRAIN_STRIDE; y++) {
      for (let x = 0; x < TERRAIN_STRIDE; x++) {
        position.push(x, this.heightMap[hmIndex(x, y)], y);
      }
    }

    for (let y = 0; y < TERRAIN_SIZE; y++) {
      for (let x = 0; x < TERRAIN_SIZE; x++) {
        const index = hmIndex(x, y);
        indices.push(index, index + TERRAIN_STRIDE, index + 1);
      }
    }

    this.positionBuffer.copyArray(position);
    this.positionBuffer.needsUpdate = true;
    this.geometry.setAttribute('position', this.positionBuffer);
    this.geometry.setIndex(indices);
  }
}

const hmIndex = (x: number, y: number) => y * TERRAIN_STRIDE + x;
