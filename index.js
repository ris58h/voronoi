import {Cell, Generator, Line, Point, Polygon} from "./core.js"
import * as powerDiagram from "./power-diagram.js"

const boundPolygon = new Polygon([new Point(0, 0), new Point(100, 0), new Point(100, 100), new Point(0, 100)])
const weightedPoints = [
    new Generator(10, 10, 100),
    new Generator(90, 90, 100),
]
const cells = powerDiagram.calculate(boundPolygon, weightedPoints)
console.log(cells)
