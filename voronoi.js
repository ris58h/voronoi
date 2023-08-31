import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"
import * as incrementalVoronoi from "./incremental-voronoi.js"

export function calculate(boundPolygon, generators) {
    return incrementalVoronoi.calculate(boundPolygon, generators, middlePoint)
}

function middlePoint(p1, p2) {
    const x1 = p1.x
    const y1 = p1.y
    const x2 = p2.x
    const y2 = p2.y
    return new Point((x1 + x2) / 2, (y1 + y2) / 2)
}
