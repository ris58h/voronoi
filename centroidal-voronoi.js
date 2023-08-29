import {Generator, Line, Point, Polygon} from "./core.js"

export function calculate(boundPolygon, generators, voronoi, options) {
    const eps = options?.eps ?? 0.1
    const maxIterations = options?.maxIterations ?? 1000
    const length = generators.length
    const movingGenerators = generators.map(generator => new Generator(generator.x, generator.y, generator.weight))
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
            const centroid = cells[i].centroid()
            const movingGenerator = movingGenerators[i]
            if (centroid.distanceTo(movingGenerator) > eps) {
                stable = false
            }
            movingGenerator.x = centroid.x
            movingGenerator.y = centroid.y
        }
        if (stable) {
            break
        }
    }
    return cells
}
