import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"
import * as incrementalVoronoi from "./incremental-voronoi.js"
import * as weightedVoronoi from "./weighted-voronoi.js"
import * as centroidalVoronoi from "./centroidal-voronoi.js"

export function voronoi(boundPolygon, generators) {
    return incrementalVoronoi.calculate(boundPolygon, generators, middlePoint)
}

function middlePoint(p1, p2) {
    const x1 = p1.x
    const y1 = p1.y
    const x2 = p2.x
    const y2 = p2.y
    return new Point((x1 + x2) / 2, (y1 + y2) / 2)
}

export function centroidal(boundPolygon, generators, voronoi, options) {
    return centroidalVoronoi.calculate(boundPolygon, generators, voronoi, options)
}

export function weightedMax(boundPolygon, generators) {
    return weightedVoronoi.calculate(boundPolygon, generators, (d, w1, w2) => d / Math.max(w1, w2))
}

export function weightedSum(boundPolygon, generators) {
    return weightedVoronoi.calculate(boundPolygon, generators, (d, w1, w2) => d / (w1 + w2))
}
