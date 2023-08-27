import {Line, Point, Polygon, WeightedPoint} from "./core.js"

export function calculate(boundPolygon, generators, voronoi, eps = 0.1, maxIterations = 10) {
    const length = generators.length
    const wholeArea = boundPolygon.area()
    const desiredNormalizedAreas = []
    let sum = 0
    for (let i = 0; i < length; i++) {
        sum += generators[i].weight
    }
    for (let i = 0; i < length; i++) {
        desiredNormalizedAreas[i] = generators[i].weight / sum
    }
    const adaptedGenerators = generators.map(generator => {
        return new WeightedPoint(generator.x, generator.y, 1.0)
    })
    const normalizedAreas = []
    let stable
    let iterationNumber = 0
    let cells
    do {
        iterationNumber++
        cells = voronoi(boundPolygon, adaptedGenerators)
        stable = true
        for (let i = 0; i < length; i++) {
            const cellArea = cells[i].area()
            normalizedAreas[i] = cellArea / wholeArea
            if (Math.abs(normalizedAreas[i] - desiredNormalizedAreas[i]) > eps) {
                stable = false
            }
        }
        if (!stable && iterationNumber < maxIterations) {
            for (let i = 0; i < length; i++) {
                adaptedGenerators[i].weight = adjustWeight(adaptedGenerators[i].weight, normalizedAreas[i], desiredNormalizedAreas[i])
                const centroid = cells[i].centroid()
                adaptedGenerators[i].x = centroid.x
                adaptedGenerators[i].y = centroid.y
            }
        }
    } while (!stable && iterationNumber < maxIterations)
    return cells
}

function adjustWeight(weight, normalizedArea, desiredNormalizedArea) {
    let w = weight * (desiredNormalizedArea / normalizedArea)
    if (w < 1) {
        w = 1
    }
    return w
}
