import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"
import * as incrementalVoronoi from "./incremental-voronoi.js"

// The result is different from Power Diagram!
// It's like a power diagram and uses the same distance,
// but radical axis between two generators in the power diagram can be outside a segment between the generators,
// so we adjust the weights so the radical axes always be between the corresponding generators.
// See https://en.wikipedia.org/wiki/Power_diagram
// See https://en.wikipedia.org/wiki/Radical_axis
export function calculate(boundPolygon, generators) {
    const length = generators.length
    if (length == 0) {
        return []
    }
    if (length == 1) {
        return [boundPolygon]
    }

    const adjustedGenerators = adjustWeightsWithRespectToDistances(generators)
    return incrementalVoronoi.calculate(boundPolygon, adjustedGenerators, middlePoint)
}

function middlePoint(g1, g2) {
    const x1 = g1.x
    const y1 = g1.y
    const w1 = g1.weight
    const x2 = g2.x
    const y2 = g2.y
    const w2 = g2.weight

    const d = g1.distanceTo(g2)
    const d1 = (d*d + w1*w1 - w2*w2) / (2*d)

    if (x1 == x2) {
        const x = x1
        const y = y1 < y2 ? y1 + d1 : y1 - d1
        return new Point(x, y)
    }
    if (y1 == y2) {
        const x = x1 < x2 ? x1 + d1 : x1 - d1
        const y = y1
        return new Point(x, y)
    }
    const dx = x2 - x1
    const dy = y2 - y1
    const x = (d1 * dx / d) + x1
    const y = (d1 * dy / d) + y1
    return new Point(x, y)
}

function adjustWeightsWithRespectToDistances(generators) {
    if (generators.length < 2) {
        return generators
    }

    let minK = Number.MAX_VALUE
    for (let i = 0; i < generators.length - 1; i++) {
        for (let j = i + 1; j < generators.length; j++) {
            const dist = generators[i].distanceTo(generators[j])
            const combinedWeight = Math.max(generators[i].weight, generators[j].weight)
            const k = dist / combinedWeight
            minK = Math.min(minK, k)
        }
    }

    return generators.map(generator => new Generator(generator.x, generator.y, generator.weight * minK))
}
