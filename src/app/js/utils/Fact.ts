import { Euler, Object3D, Quaternion, Sprite, SpriteMaterial, TextureLoader, Vector3 } from 'three';
import EventBus from './EventBus';

export default class Fact {
  private readonly buttonObject: Object3D;
  private readonly infosObject: Object3D;
  private title: string;
  private date: string;
  private content: string;
  private url: string;
  private fact: Sprite = null;
  private factInfos: Sprite = null;

  constructor(date: string, title: string, content: string, url: string, buttonObject: Object3D, infosObject: Object3D) {
    this.date = date;
    this.title = title;
    this.content = content;
    this.url = url;
    this.buttonObject = buttonObject;
    this.infosObject = infosObject;

    this.build();
  }

  build() {
    this.buildFact();
    this.buildFactInfos();
  }

  buildFact() {
    const texture = new TextureLoader().load('./assets/Plus.png');
    const factMaterial = new SpriteMaterial({ map: texture, color: 0xffffff });
    this.fact = new Sprite(factMaterial);
    this.fact.scale.set(100, 100, 100);
    this.fact.position.copy(this.buttonObject.position);
    this.fact.quaternion.copy(this.buttonObject.quaternion);
    this.fact.userData.isInteractive = true;
    this.fact.userData.type = 'Fact-Plus';
    this.fact.name = 'Fact-Plus';
  }

  buildFactInfos() {
    const texture = new TextureLoader().load('./assets/Fait.png');
    const factMaterial = new SpriteMaterial({ map: texture, color: 0xffffff });
    this.factInfos = new Sprite(factMaterial);
    this.factInfos.scale.set(150, 200, 100);
    this.factInfos.position.copy(this.infosObject.position);
    this.factInfos.quaternion.copy(this.infosObject.quaternion);
    this.factInfos.visible = false;
    this.factInfos.name = 'Fact-Infos';
  }

  getFactSprite() {
    return this.fact;
  }

  getFactInfosSprite() {
    return this.factInfos;
  }

  static onFactClick() {
    EventBus.listen('raycast:click', (e: CustomEvent) => {
      console.log(e.detail.object.userData.type);
      if ((<Object3D>e.detail.object).userData.type === 'Fact-Plus') {
        e.detail.object.visible = false;
        e.detail.object.parent.getObjectByName('Fact-Infos').visible = true;
      }
    });
  }

}
