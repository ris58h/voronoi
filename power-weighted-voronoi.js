import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"
import * as incrementalVoronoi from "./incremental-voronoi.js"

export function calculate(boundPolygon, generators) {
    return incrementalVoronoi.calculate(boundPolygon, generators, (d, w1, w2) => (d*d + w1*w1 - w2*w2) / (2*d))
}
