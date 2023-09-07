import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"
import * as powerWeightedVoronoi from "./power-weighted-voronoi.js"

// The result is different from Power Diagram!
// It's like a power diagram and uses the same distance,
// but radical axis between two generators in the power diagram can be outside a segment between the generators,
// so we adjust the weights so the radical axes always be between the corresponding generators.
// See https://en.wikipedia.org/wiki/Power_diagram
// See https://en.wikipedia.org/wiki/Radical_axis
export function calculate(boundPolygon, generators, weightsAdjustmentFactor) {
    const length = generators.length
    if (length == 0) {
        return []
    }
    if (length == 1) {
        return [boundPolygon]
    }

    const adjustedGenerators = adjustWeightsWithRespectToDistances(generators, weightsAdjustmentFactor)
    return powerWeightedVoronoi.calculate(boundPolygon, adjustedGenerators)
}

function adjustWeightsWithRespectToDistances(generators, weightsAdjustmentFactor) {
    if (generators.length < 2) {
        return generators
    }

    let minK = Number.MAX_VALUE
    for (let i = 0; i < generators.length - 1; i++) {
        for (let j = i + 1; j < generators.length; j++) {
            const g1 = generators[i]
            const g2 = generators[j]
            const k = weightsAdjustmentFactor(g1.distanceTo(g2), g1.weight, g2.weight)
            minK = Math.min(minK, k)
        }
    }

    return generators.map(generator => new Generator(generator.x, generator.y, generator.weight * minK))
}
