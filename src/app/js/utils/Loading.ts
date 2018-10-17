import ObjectLoader from './ObjectLoader';
import EventBus from './EventBus';
import { TweenMax } from 'gsap';

export default class Loading {
  private readonly element: HTMLElement;
  private readonly elementMaxWidth: number;
  private currentLoading: number;
  public cacheObjects: any;
  private readonly objectsToLoad: string[];

  constructor(element: HTMLElement) {
    this.element = element;
    this.elementMaxWidth = 284;
    this.currentLoading = 0;
    this.cacheObjects = {};
    this.objectsToLoad = [
      './assets/Trump.dae',
      './assets/Trump10.dae',
    ];
    this.onClick();
  }

  onClick() {
    document.querySelector('#begin-experiment').addEventListener('click', (e) => {
      e.preventDefault();
      TweenMax.to(document.querySelector('#context'), 0.4, {
        alpha: 0,
        onComplete: () => {
          EventBus.dispatch('loading:disappear');
        },
      });
    });
  }

  init() {
    for (const object of this.objectsToLoad) {
      ObjectLoader.loadCollada(object)
        .then((collada: any) => {
          this.save(object, collada);
          this.currentLoading += 1;
          this.updateLoading();
        });
    }
  }

  updateLoading() {
    const loading = this.currentLoading / this.objectsToLoad.length * 100;
    const width = loading * this.elementMaxWidth / 100;
    (<HTMLElement>this.element.querySelector('#loader')).style.width = `${width}px`;
    (<HTMLElement>this.element.querySelector('#loader-percent')).innerText = `${loading.toFixed(0)}%`;

    if (this.currentLoading === this.objectsToLoad.length) {
      EventBus.dispatch('loading:finished');
      this.hideOverlay();
    }
  }

  hideOverlay() {
    TweenMax.to(this.element, 0.4, {
      alpha: 0,
      onComplete: () => {
        this.element.style.display = 'none';
        this.animateContext();
      },
    });
  }

  animateContext() {
    TweenMax.to(document.querySelector('#context .texts'), 2, {
      alpha: 1,
      marginTop: 5,
    });
  }

  save(name: string, object: any) {
    this.cacheObjects[name] = object;
  }

  get(name: string): any {
    return this.cacheObjects[name] || null;
  }

  has(name: string): boolean {
    return !!this.cacheObjects[name];
  }
}
