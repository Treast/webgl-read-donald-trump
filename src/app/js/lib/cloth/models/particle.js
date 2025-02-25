import { Vector3 } from 'three';

export default class Particle {

  constructor(x, y, z, mass, drag, clothFunction) {
    this.position = new THREE.Vector3();
    this.previous = new THREE.Vector3();
    this.original = new THREE.Vector3();
    this.a = new Vector3(0, 0, 0);
    this.mass = mass;
    this.invMass = 1 / mass;
    this.drag = drag;
    this.tmp = new Vector3();
    this.tmp2 = new Vector3();
    clothFunction(x, y, this.position);
    clothFunction(x, y, this.previous);
    clothFunction(x, y, this.original);
  }

  addForce(force) {
    this.tmp2.copy(force).multiplyScalar(this.invMass);
    this.a.add(this.tmp2);
  }

  integrate(timesq) {
    const newPos = this.tmp.subVectors(this.position, this.previous);
    newPos.multiplyScalar(this.drag).add(this.position);
    newPos.add(this.a.multiplyScalar(timesq));

    this.tmp = this.previous;
    this.previous = this.position;
    this.position = newPos;

    this.a.set(0, 0, 0);
  }

}
