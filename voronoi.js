import incrementalVoronoi from "./incremental-voronoi.js"
import adjustedWeightedVoronoi from "./adjusted-weighted-voronoi.js"
import centroidalVoronoi from "./centroidal-voronoi.js"

export function voronoi(boundPolygon, generators) {
    return incrementalVoronoi(boundPolygon, generators, d => d/2)
}

export function powerWeighted(boundPolygon, generators) {
    return incrementalVoronoi(boundPolygon, generators, (d, w1, w2) => (d*d + w1*w1 - w2*w2) / (2*d))
}

export function centroidal(boundPolygon, generators, voronoi, options) {
    return centroidalVoronoi(boundPolygon, generators, voronoi, options)
}

export function maxAdjustedPowerWeighted(boundPolygon, generators) {
    return adjustedWeightedVoronoi(boundPolygon, generators, powerWeighted, (d, w1, w2) => d / Math.max(w1, w2))
}

export function sumAdjustedPowerWeighted(boundPolygon, generators) {
    return adjustedWeightedVoronoi(boundPolygon, generators, powerWeighted, (d, w1, w2) => d / (w1 + w2))
}
