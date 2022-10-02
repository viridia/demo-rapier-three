import {
  CoefficientCombineRule,
  ColliderDesc,
  RigidBody,
  RigidBodyDesc,
  World,
} from '@dimforge/rapier3d-compat';
import {
  Clock,
  Color,
  DirectionalLight,
  HemisphereLight,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  PerspectiveCamera,
  Scene,
  SphereGeometry,
  sRGBEncoding,
  Vector3,
  WebGLRenderer,
} from 'three';
import { EventBus, ResourcePool } from './lib';
import { getRapier } from './physics/rapier';
import { TerrainShape } from './terrain/TerrainShape';

const cameraOffset = new Vector3();

/** Contains the three.js renderer and handles to important resources. */
export class Engine {
  public readonly scene = new Scene();
  public readonly camera: PerspectiveCamera;
  public readonly renderer: WebGLRenderer;
  public readonly pool = new ResourcePool();
  public readonly viewPosition = new Vector3();
  public viewAngle = 0;
  public readonly update = new EventBus<[Engine, number]>();

  private mount: HTMLElement | undefined;
  private frameId: number | null = null;
  private clock = new Clock();
  private sunlight: DirectionalLight;
  private terrain: TerrainShape[] = [];
  private physicsWorld?: World;
  private sphere: Mesh;
  private sphereBody?: RigidBody;

  constructor() {
    console.log('construct');
    this.animate = this.animate.bind(this);
    this.camera = new PerspectiveCamera(40, 1, 0.1, 100);
    this.sunlight = this.createSunlight();
    this.createAmbientLight();
    this.renderer = this.createRenderer();

    const geometry = new SphereGeometry(1, 32, 16);
    const material = new MeshStandardMaterial({ color: 0xffff00 });
    this.sphere = new Mesh(geometry, material);
    this.sphere.castShadow = true;
    this.scene.add(this.sphere);

    // Generate some terrain patches.
    for (let y = -32; y < 32; y += 16) {
      for (let x = -32; x < 32; x += 16) {
        const terrain = new TerrainShape(new Vector3(x, 0, y));
        terrain.addToScene(this.scene);
        this.terrain.push(terrain);
        this.pool.add(terrain);
      }
    }

    cameraOffset.setFromSphericalCoords(20, MathUtils.degToRad(75), this.viewAngle);
    this.camera.position.copy(this.viewPosition).add(cameraOffset);
    this.camera.lookAt(this.viewPosition);
    this.camera.updateMatrixWorld();
  }

  /** Shut down the renderer and release all resources. */
  public dispose() {
    console.log('dispose');
    this.pool.dispose();
  }

  /** Attach the renderer to the DOM. */
  public async attach(mount: HTMLElement) {
    this.mount = mount;
    window.addEventListener('resize', this.onWindowResize.bind(this));
    mount.appendChild(this.renderer.domElement);
    this.onWindowResize();

    // Make sure physics WASM bundle is initialized before starting rendering loop.
    // Physics objects cannot be created until after physics engine is initialized.
    await getRapier();

    // Create physics for terrain
    const gravity = new Vector3(0.0, -9.81, 0.0);
    this.physicsWorld = new World(gravity);
    this.terrain.forEach(terr => terr.addPhysics(this.physicsWorld!));

    // Create rigid body for the sphere.
    const rbDesc = RigidBodyDesc.newDynamic()
      .setTranslation(6, 4, 0)
      .setLinearDamping(0.1)
      // .restrictRotations(false, true, false) // Y-axis only
      .setCcdEnabled(true);
    this.sphereBody = this.physicsWorld.createRigidBody(rbDesc);

    const clDesc = ColliderDesc.ball(1)
      .setFriction(0.1)
      .setFrictionCombineRule(CoefficientCombineRule.Max)
      // .setTranslation(0, 0, 0)
      .setRestitution(0.6)
      .setRestitutionCombineRule(CoefficientCombineRule.Max);
    // .setCollisionGroups(CollisionMask.ActorMask | CollisionMask.TouchActor);
    this.physicsWorld.createCollider(clDesc, this.sphereBody.handle);

    if (!this.frameId) {
      this.clock.start();
      this.frameId = requestAnimationFrame(this.animate);
    }
  }

  /** Detach the renderer from the DOM. */
  public detach() {
    if (this.frameId) {
      cancelAnimationFrame(this.frameId);
      this.frameId = null;
    }
    window.removeEventListener('resize', this.onWindowResize);
    this.mount?.removeChild(this.renderer.domElement);
  }

  /** Update the positions of any moving objects. */
  public updateScene(deltaTime: number) {
    // Run callbacks.
    this.update.publish(this, deltaTime);

    // Run physics
    this.physicsWorld?.step();
    const t = this.sphereBody!.translation();
    this.sphere.position.set(t.x, t.y, t.z);
  }

  /** Return the elapsed running time. */
  public get time(): number {
    return this.clock.elapsedTime;
  }

  private animate() {
    const deltaTime = Math.min(this.clock.getDelta(), 0.1);
    this.updateScene(deltaTime);
    this.render();
    this.frameId = window.requestAnimationFrame(this.animate);
  }

  /** Render the scene. */
  public render() {
    this.adjustLightPosition();
    this.renderer.render(this.scene, this.camera);
  }

  /** Handle window resize event. */
  private onWindowResize() {
    if (this.mount) {
      const width = this.mount.clientWidth;
      const height = this.mount.clientHeight;
      this.camera.aspect = width / height;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.renderer.render(this.scene, this.camera);
    }
  }

  private createRenderer() {
    const renderer = new WebGLRenderer({ antialias: true });
    renderer.shadowMap.enabled = true;
    renderer.autoClear = true;
    renderer.autoClearColor = true;
    renderer.autoClearDepth = true;
    renderer.autoClearStencil = false;
    renderer.gammaFactor = 2.2;
    renderer.outputEncoding = sRGBEncoding;
    return renderer;
  }

  private createSunlight() {
    const sunlight = new DirectionalLight(new Color('#ffffff').convertSRGBToLinear(), 0.4);
    sunlight.castShadow = true;
    sunlight.shadow.mapSize.width = 1024;
    sunlight.shadow.mapSize.height = 1024;
    sunlight.shadow.camera.near = 1;
    sunlight.shadow.camera.far = 32;
    sunlight.shadow.camera.left = -15;
    sunlight.shadow.camera.right = 15;
    sunlight.shadow.camera.top = 15;
    sunlight.shadow.camera.bottom = -15;
    this.scene.add(sunlight);
    this.scene.add(sunlight.target);
    return sunlight;
  }

  public createAmbientLight() {
    const light = new HemisphereLight(
      new Color(0xb1e1ff).multiplyScalar(0.2).convertSRGBToLinear(),
      new Color(0xb97a20).multiplyScalar(0.2).convertSRGBToLinear(),
      0.6
    );
    this.scene.add(light);
    return light;
  }

  private adjustLightPosition() {
    // Adjust shadow map bounds
    const lightPos = this.sunlight.target.position;
    lightPos.copy(this.viewPosition);

    // Quantizing the light's location reduces the amount of shadow jitter.
    lightPos.x = Math.round(lightPos.x);
    lightPos.z = Math.round(lightPos.z);
    this.sunlight.position.set(lightPos.x + 6, lightPos.y + 8, lightPos.z + 4);
  }
}
