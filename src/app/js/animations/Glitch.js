import { Matrix4 } from 'three'

export class Glitch {

    static COLORS = [
        [255, 0, 0],
        [0, 255, 0],
        [0, 0, 255]
    ]

    static NUMBER_OF_CLONES = 3

    static MAX_DIST_CLONES_TO_CENTER = 15

    static DURATION_ANIMATION = 500

    static DURATION_FREQUENCY = 5

    constructor (objectFrom, objectTo = null) {
        this.objectFrom = objectFrom
        this.objectTo = objectTo
        this.objectFromClones = this.getClonesObject(this.objectFrom)
    }

    getObjectWithMaterials (obj, objects = []) {
        if (obj.children) obj.children.forEach(c => objects = [...this.getObjectWithMaterials(c, objects)])
        if (obj.material) objects.push(obj)
        return objects
    }

    setObject (object, color) {
        const objectsChildrens = this.getObjectWithMaterials(object)
        objectsChildrens.forEach((object, i) => {
            if (Array.isArray(object.material)) {
                object.material = object.material.map(material => {
                    const newMaterial = material.clone()
                    newMaterial.color.setRGB(...color)
                    newMaterial.transparent = true
                    newMaterial.opacity = 0.7
                    return newMaterial
                })
            } else {
                const newMaterial = object.material.clone()
                newMaterial.color.setRGB(...color)
                newMaterial.transparent = true
                newMaterial.opacity = 0.7
                object.material = newMaterial
            }
        })
    }

    execute () {
        this.setSteps(
            () => this.executeStart(),
            () => this.skewClone(this.objectFromClones, 0.3),
            () => this.skewClone(this.objectFromClones, -0.3),
            () => this.executeFinish()
        )
    }

    setSteps (...args) {
        args.forEach((step, i) => {
            let timeRatio = (i + 1) / args.length
            if (i === 0) timeRatio = 0
            else if (i === args.length) timeRatio = 1
            setTimeout(() => step(), Glitch.DURATION_ANIMATION * timeRatio)
        })
    }

    executeStart () {
        this.objectFrom.visible = false
        this.interval = setInterval(() => this.moveClones(this.objectFromClones), Glitch.DURATION_FREQUENCY)
    }

    executeFinish () {
        this.objectFrom.visible = true
        this.removeClones(this.objectFromClones)
        clearInterval(this.interval)
    }

    getClonesObject (obj) {
        const clones = []
        for (let i = 0; i < Glitch.NUMBER_OF_CLONES; i++) {
            const objClone = obj.clone()
            obj.parent.add(objClone)
            objClone.matrixWorldNeedsUpdate = true
            clones.push({ obj: objClone, initialPosition: obj.position })
            this.setObject(objClone, Glitch.COLORS[i % Glitch.COLORS.length])
        }
        return clones
    }

    moveClones (clones) {
        clones.forEach(clone => {
            clone.obj.position.set(clone.initialPosition.x, clone.initialPosition.y, clone.initialPosition.z)
            clone.obj.position.x += (Math.random() > 0.5 ? -Math.random() : Math.random()) * Glitch.MAX_DIST_CLONES_TO_CENTER
            clone.obj.position.y += (Math.random() > 0.5 ? -Math.random() : Math.random()) * Glitch.MAX_DIST_CLONES_TO_CENTER
            clone.obj.position.z += (Math.random() > 0.5 ? -Math.random() : Math.random()) * Glitch.MAX_DIST_CLONES_TO_CENTER
        })
    }

    skewClone (clones, skewValue) {
        const Syx = 0,
            Szx = 0,
            Sxy = 0,
            Szy = skewValue,
            Sxz = 0,
            Syz = 0
        const matrix = new Matrix4()
        matrix.set(
            1, Syx, Szx, 0,
            Sxy, 1, Szy, 0,
            Sxz, Syz, 1, 0,
            0, 0, 0, 1
        )
        clones.forEach(c => c.obj.applyMatrix(matrix))
    }

    removeClones (clones) {
        clones.forEach(c => c.obj.parent.remove(c.obj))
    }

}