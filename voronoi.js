import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"
import * as incrementalVoronoi from "./incremental-voronoi.js"
import * as adjustedPowerWeightedVoronoi from "./adjusted-power-weighted-voronoi.js"
import * as centroidalVoronoi from "./centroidal-voronoi.js"

export function voronoi(boundPolygon, generators) {
    return incrementalVoronoi.calculate(boundPolygon, generators, d => d/2)
}

export function centroidal(boundPolygon, generators, voronoi, options) {
    return centroidalVoronoi.calculate(boundPolygon, generators, voronoi, options)
}

export function maxAdjustedPowerWeighted(boundPolygon, generators) {
    return adjustedPowerWeightedVoronoi.calculate(boundPolygon, generators, (d, w1, w2) => d / Math.max(w1, w2))
}

export function sumAdjustedPowerWeighted(boundPolygon, generators) {
    return adjustedPowerWeightedVoronoi.calculate(boundPolygon, generators, (d, w1, w2) => d / (w1 + w2))
}
