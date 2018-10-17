import Cloth from '../lib/cloth/models/cloth';
import {
  Material,
  Mesh,
  ParametricGeometry,
  ShaderMaterial,
  TextureLoader,
  Texture,
  MeshLambertMaterial,
  DoubleSide, Vector3, Quaternion,
} from 'three';

interface IUniforms {
  texture: ITexture;
}
interface ITexture {
  value: Texture;
}

export default class Flag {
  private cloth: Cloth;
  private geometry: ParametricGeometry;
  private material: Material;
  private clothTexture: Texture;
  private uniforms: IUniforms;
  public mesh: Mesh;
  private position: Vector3;
  private rotation: Vector3;
  private scale: Vector3;
  private windForce: number;

  public static OFFSETX: number = -71.64;
  public static OFFSETY: number = 1.593;
  public static OFFSETZ: number = 132.933;

  constructor(position: Vector3, rotation: Vector3, scale: Vector3, windForce: number) {
    this.windForce = windForce;
    this.position = position;
    this.rotation = rotation;
    this.scale = scale;
    this.cloth = new Cloth();
    this.createGeometry();
    this.loadTexture();
    this.createMaterial();
    this.createMesh();
  }

  simulate(time: number) {
    this.cloth.simulate(time, this.geometry);
  }

  createGeometry() {
    this.geometry = new ParametricGeometry(
      this.cloth.clothFunction,
      this.cloth.w,
      this.cloth.h,
    );
    // @ts-ignore
    this.geometry.dynamic = true;
  }

  loadTexture() {
    const loader = new TextureLoader();
    this.clothTexture = loader.load('./assets/american_flag2.png');
    this.clothTexture.anisotropy = 16;
    this.uniforms = { texture: { value: this.clothTexture } };
  }

  createMaterial() {
    this.material = new MeshLambertMaterial({
      map: this.clothTexture,
      side: DoubleSide,
      alphaTest: 0.5,
    });
  }

  createMesh() {
    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.copy(this.position);
    this.mesh.rotation.setFromVector3(this.rotation);
    this.mesh.scale.copy(this.scale);
    this.mesh.castShadow = true;

    // @ts-ignore
    this.mesh.customDepthMaterial = new ShaderMaterial({
      uniforms: this.uniforms,
      side: DoubleSide,
    });
  }

  update() {
    for (let i = 0; i < this.cloth.particles.length; i += 1) {
      this.geometry.vertices[i]
        .copy(this.cloth.particles[i].position);
    }

    this.geometry.computeFaceNormals();
    this.geometry.computeVertexNormals();

    this.geometry.normalsNeedUpdate = true;
    this.geometry.verticesNeedUpdate = true;
  }
}
