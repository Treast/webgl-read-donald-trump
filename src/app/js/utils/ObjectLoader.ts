import THREE from './Bundle';

export default class ObjectLoader {
  static loadObject(url: string) {
    return new Promise((resolve: (object: any) => void, reject: () => void) => {
      const loader = new THREE.OBJLoader();
      loader.load(url, (object: THREE.Object3D) => {
        resolve(object);
      });
    });
  }

  static loadMaterial(url: string) {
    return new Promise((resolve: (object: any) => void, reject: () => void) => {
      const loader = new THREE.MTLLoader();
      loader.load(url, (material: THREE.MaterialCreator) => {
        resolve(material);
      });
    });
  }

  static loadGLTF(url: string) {
    return new Promise((resolve: (object: any) => void, reject: () => void) => {
      // @ts-ignore
      const loader = new THREE.GLTFLoader();
      loader.load(url, (gltf: any) => {
        resolve(gltf);
      });
    });
  }

  static loadFBX(url: string) {
    return new Promise((resolve: (object: any) => void, reject: () => void) => {
      const loader = new THREE.FBXLoader();
      loader.load(url, (fbx: THREE.Object3D) => {
        resolve(fbx);
      });
    });
  }

  static loadCollada(url: string) {
    return new Promise((resolve: (object: any) => void, reject: () => void) => {
      const loader = new THREE.ColladaLoader();
      loader.load(url, (collada: THREE.ColladaModel) => {
        resolve(collada);
      });
    });
  }

  static loadObjectWithMaterial(objectUrl: string, materialUrl: string) {
    return new Promise((resolve: (object: any) => void, reject: () => void) => {
      const objectLoader = new THREE.OBJLoader();
      const materialLoader = new THREE.MTLLoader();

      materialLoader.load(materialUrl, (materials: THREE.MaterialCreator) => {
        materials.preload();
        objectLoader.setMaterials(materials);
        objectLoader.load(objectUrl, (object: THREE.Object3D) => {
          resolve(object);
        });
      });
    });
  }
}
