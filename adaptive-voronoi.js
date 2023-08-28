import {Generator, Line, Point, Polygon} from "./core.js"

export function calculate(boundPolygon, generators, voronoi, eps = 0.1, maxIterations = 10) {
    const length = generators.length
    const wholeArea = boundPolygon.area()
    const totalWeight = generators.reduce((acc, generator) => acc + generator.weight, 0)
    const desiredNormalizedAreas = generators.map(generator => generator.weight / totalWeight)
    const movingGenerators = generators.map(generator => new Generator(generator.x, generator.y, 1.0))
    const normalizedAreas = []
    let iterationNumber = 0
    let cells
    while (true) {
        iterationNumber++
        if (iterationNumber >= maxIterations) {
            break
        }
        cells = voronoi(boundPolygon, movingGenerators)
        let stable = true
        for (let i = 0; i < length; i++) {
            const cellArea = cells[i].area()
            normalizedAreas[i] = cellArea / wholeArea
            if (Math.abs(normalizedAreas[i] - desiredNormalizedAreas[i]) > eps) {
                stable = false
            }
        }
        if (stable) {
            break
        }
        for (let i = 0; i < length; i++) {
            const centroid = cells[i].centroid()
            const movingGenerator = movingGenerators[i]
            movingGenerator.x = centroid.x
            movingGenerator.y = centroid.y
            movingGenerator.weight = adjustWeight(movingGenerator.weight, normalizedAreas[i], desiredNormalizedAreas[i])
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
