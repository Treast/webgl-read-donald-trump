import { Matrix4, Mesh, MeshPhongMaterial } from 'three';
import Timeout = NodeJS.Timeout;

interface ClonePosition {
  x: number;
  y: number;
  z: number;
}

interface Clone {
  obj: Mesh;
  initialPosition: ClonePosition;
}

export class Glitch {

  static COLORS = [
    [255, 0, 0],
    [0, 255, 0],
    [0, 0, 255],
  ];
  static NUMBER_OF_CLONES = 3;
  static MAX_DIST_CLONES_TO_CENTER = 15;
  static DURATION_ANIMATION = 500;
  static DURATION_FREQUENCY = 5;
  private readonly objectFrom: Mesh;
  private readonly objectTo: Mesh;
  private readonly objectFromClones: Clone[];
  private interval: Timeout;

  constructor (objectFrom: Mesh, objectTo: Mesh = null) {
    this.objectFrom = objectFrom;
    this.objectTo = objectTo;
    this.objectFromClones = this.getClonesObject(this.objectFrom);
  }

  getObjectWithMaterials (obj: Mesh, objects: Mesh[] = []) {
    let objs = objects;
    if (obj.children) {
      obj.children.forEach((c: Mesh) =>  {
        objs = [...this.getObjectWithMaterials(c, objects)];
      });
    }
    if (obj.material) {
      objects.push(obj);
    }
    return objs;
  }

  setObject(object: Mesh, color: number[]) {
    const objectsChildrens = this.getObjectWithMaterials(object);
    objectsChildrens.forEach((object) => {
      if (Array.isArray(object.material)) {
        object.material = object.material.map((material: MeshPhongMaterial) => {
          const newMaterial = material.clone();
          newMaterial.color.setRGB(color[0], color[1], color[2]);
          newMaterial.transparent = true;
          newMaterial.opacity = 0.7;
          return newMaterial;
        });
      } else {
        const newMaterial = object.material.clone() as MeshPhongMaterial;
        newMaterial.color.setRGB(color[0], color[1], color[2]);
        newMaterial.transparent = true;
        newMaterial.opacity = 0.7;
        object.material = newMaterial;
      }
    });
  }

  execute () {
    this.setSteps(
      () => this.executeStart(),
      () => this.skewClone(this.objectFromClones, 0.3),
      () => this.skewClone(this.objectFromClones, -0.3),
      () => this.executeFinish(),
    );
  }

  setSteps (...args: any[]) {
    args.forEach((step, i) => {
      let timeRatio = (i + 1) / args.length;
      if (i === 0) timeRatio = 0;
      else if (i === args.length) timeRatio = 1;
      setTimeout(() => step(), Glitch.DURATION_ANIMATION * timeRatio);
    });
  }

  executeStart () {
    this.objectFrom.visible = false;
    this.interval = setInterval(() => this.moveClones(this.objectFromClones), Glitch.DURATION_FREQUENCY);
  }

  executeFinish () {
    this.objectFrom.visible = true;
    this.removeClones(this.objectFromClones);
    clearInterval(this.interval);
  }

  getClonesObject(obj: Mesh) {
    const clones = [];
    for (let i = 0; i < Glitch.NUMBER_OF_CLONES; i += 1) {
      const objClone = obj.clone();
      obj.parent.add(objClone);
      objClone.matrixWorldNeedsUpdate = true;
      clones.push({ obj: objClone, initialPosition: obj.position });
      this.setObject(objClone, Glitch.COLORS[i % Glitch.COLORS.length]);
    }
    return clones;
  }

  moveClones(clones: Clone[]) {
    clones.forEach((clone: Clone) => {
      clone.obj.position.set(clone.initialPosition.x, clone.initialPosition.y, clone.initialPosition.z);
      clone.obj.position.x += (Math.random() > 0.5 ? -Math.random() : Math.random()) * Glitch.MAX_DIST_CLONES_TO_CENTER;
      clone.obj.position.y += (Math.random() > 0.5 ? -Math.random() : Math.random()) * Glitch.MAX_DIST_CLONES_TO_CENTER;
      clone.obj.position.z += (Math.random() > 0.5 ? -Math.random() : Math.random()) * Glitch.MAX_DIST_CLONES_TO_CENTER;
    });
  }

  skewClone (clones: Clone[], skewValue: number) {
    const syx = 0;
    const szx = 0;
    const sxy = 0;
    const szy = skewValue;
    const sxz = 0;
    const syz = 0;
    const matrix = new Matrix4();
    matrix.set(
      1, syx, szx, 0,
      sxy, 1, szy, 0,
      sxz, syz, 1, 0,
      0, 0, 0, 1,
    );
    clones.forEach((c: Clone) => c.obj.applyMatrix(matrix));
  }

  removeClones(clones: Clone[]) {
    clones.forEach((c: Clone) => c.obj.parent.remove(c.obj));
  }

}
