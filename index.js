import {Cell, Line, Point, Polygon, WeightedPoint} from "./core.js"
import * as powerDiagram from "./power-diagram.js"

const boundPolygon = new Polygon([new Point(0, 0), new Point(100, 0), new Point(100, 100), new Point(0, 100)])
const generators = [
    new WeightedPoint(10, 10, 100),
    new WeightedPoint(90, 90, 200),
]
const cells = powerDiagram.calculate(boundPolygon, generators)
console.log(cells)
