import {Line, Point, Polygon, WeightedPoint} from "./core.js"

export function calculate(boundPolygon, generators, voronoi, eps = 0.1, maxIterations = 10) {
    const length = generators.length
    const wholeArea = boundPolygon.area()
    const totalWeight = generators.reduce((acc, generator) => acc + generator.weight, 0)
    const desiredNormalizedAreas = generators.map(generator => generator.weight / totalWeight)
    const adaptedGenerators = generators.map(generator => new WeightedPoint(generator.x, generator.y, 1.0))
    const normalizedAreas = []
    let stable
    let iterationNumber = 0
    let cells
    while (true) {
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
        if (stable || iterationNumber >= maxIterations) {
            break
        }
        for (let i = 0; i < length; i++) {
            adaptedGenerators[i].weight = adjustWeight(adaptedGenerators[i].weight, normalizedAreas[i], desiredNormalizedAreas[i])
            const centroid = cells[i].centroid()
            adaptedGenerators[i].x = centroid.x
            adaptedGenerators[i].y = centroid.y
        }
    }
    return cells
}

function adjustWeight(weight, normalizedArea, desiredNormalizedArea) {
    let w = weight * (desiredNormalizedArea / normalizedArea)
    if (w < 1) {
        w = 1
    }
    return w
}
