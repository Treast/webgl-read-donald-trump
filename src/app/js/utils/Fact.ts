import { Euler, Quaternion, Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';

export default class Fact {
  private readonly position: Vector3;
  private readonly rotation: Quaternion;
  private title: string;
  private date: string;
  private content: string;
  private url: string;
  private fact: Sprite = null;

  constructor(date: string, title: string, content: string, url: string, position: Vector3, rotation: Quaternion) {
    this.date = date;
    this.title = title;
    this.content = content;
    this.url = url;
    this.position = position;
    this.rotation = rotation;

    this.build();
  }

  build() {
    const texture = new TextureLoader().load('./assets/Plus.png');
    const factMaterial = new SpriteMaterial({ map: texture, color: 0xffffff });
    this.fact = new Sprite(factMaterial);
    this.fact.scale.set(100, 100, 100);
    this.fact.position.copy(this.position);
    this.fact.quaternion.copy(this.rotation);
    this.fact.userData.isInteractive = true;
  }

  getSprite() {
    return this.fact;
  }

}
