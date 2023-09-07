import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"

export function calculate(boundPolygon, generators, voronoi, weightAdjustmentFactorFunction) {
    const length = generators.length
    if (length == 0) {
        return []
    }
    if (length == 1) {
        return [boundPolygon]
    }

    const adjustedGenerators = adjustWeightsWithRespectToDistances(generators, weightAdjustmentFactorFunction)
    return voronoi(boundPolygon, adjustedGenerators)
}

function adjustWeightsWithRespectToDistances(generators, weightAdjustmentFactorFunction) {
    if (generators.length < 2) {
        return generators
    }

    let minK = Number.MAX_VALUE
    for (let i = 0; i < generators.length - 1; i++) {
        for (let j = i + 1; j < generators.length; j++) {
            const g1 = generators[i]
            const g2 = generators[j]
            const k = weightAdjustmentFactorFunction(g1.distanceTo(g2), g1.weight, g2.weight)
            minK = Math.min(minK, k)
        }
    }

    return generators.map(generator => new Generator(generator.x, generator.y, generator.weight * minK))
}
