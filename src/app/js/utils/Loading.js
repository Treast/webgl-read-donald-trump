import ObjectLoader from './ObjectLoader';
import EventBus from './EventBus';
import {TweenMax} from 'gsap';

export default class Loading {
  constructor(element) {
    this.element = element;
    this.elementMaxWidth = 600;
    this.currentLoading = 0;
    this.cacheObjects = {};
    this.objectsToLoad = [
      './assets/Trump.dae',
      './assets/Trump10.dae'
    ];
  }

  init() {
    for(let object of this.objectsToLoad) {
      ObjectLoader.loadCollada(object)
        .then(collada => {
          this.save(object, collada);
          this.currentLoading++;
          this.updateLoading();
        })
    }
  }

  updateLoading() {
    let loading = this.currentLoading / this.objectsToLoad.length * 100;
    let width = loading * this.elementMaxWidth / 100;
    this.element.querySelector('#loader').style.width = width + "px";
    this.element.querySelector('#loader-percent').innerText = parseInt(loading) + "%";

    if(this.currentLoading === this.objectsToLoad.length) {
      EventBus.dispatch('loading:finished')
      this.hideOverlay()
    }
  }

  hideOverlay() {
    TweenMax.to(this.element, 0.4, {
      alpha: 0,
      onComplete: () => {
        this.element.style.display = "none";
      }
    })
  }

  save(name, object) {
    this.cacheObjects[name] = object;
  }

  get(name){
    return this.cacheObjects[name] || null;
  }

  has(name) {
    return !!this.cacheObjects[name];
  }
}