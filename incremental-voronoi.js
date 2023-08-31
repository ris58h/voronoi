import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"

export function calculate(boundPolygon, generators, middlePointFunction) {
    const length = generators.length
    if (length == 0) {
        return []
    }
    if (length == 1) {
        return [boundPolygon]
    }

    const cellBounds = Array(length).fill(boundPolygon)
    for (let i = 0; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            const middlePoint = middlePointFunction(generators[i], generators[j])
            const divider = perpendicular(new Line(generators[i], generators[j]), middlePoint)
            cellBounds[i] = cut(generators[i], cellBounds[i], divider)
            cellBounds[j] = cut(generators[j], cellBounds[j], divider)
        }
    }
    return cellBounds
}

function perpendicular(line, point) {
    const x1 = line.begin.x
    const y1 = line.begin.y
    const x2 = line.end.x
    const y2 = line.end.y
    const x3 = point.x
    const y3 = point.y
    
    if (x1 == x2) {
        return new Line(point, new Point(x3 + 1, y3))
    }
    if (y1 == y2) {
        return new Line(point, new Point(x3, y3 + 1))
    }
    const dx = x2 - x1
    const dy = y2 - y1
    const m = -(dx/dy)
    const x4 = x2
    const y4 = y3 + (m*(x2 - x3))
    return new Line(new Point(x3, y3), new Point(x4, y4))
}

function cut(generator, polygon, line) {
    const newVertices = []
    polygon.forEachFacet((begin, end) => {
        if (!onOppositeSides(generator, begin, line)) {
            newVertices.push(begin)
        }
        const facet = new Line(begin, end)
        const intersectionPoint = facet.intersection(line, true)
        if (intersectionPoint != null) {
            newVertices.push(intersectionPoint)
        }
    })
    return new Polygon(newVertices)
}
