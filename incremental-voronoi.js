import {Generator, Line, Point, Polygon, onOppositeSides} from "./core.js"

export function calculate(boundPolygon, generators, d1Function) {
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
            const g1 = generators[i]
            const g2 = generators[j]
            const d = g1.distanceTo(g2)
            const d1 = d1Function(d, g1.weight, g2.weight)
            const point = middlePoint(g1, g2, d, d1)
            const divider = perpendicular(new Line(g1, g2), point)
            cellBounds[i] = cut(g1, cellBounds[i], divider)
            cellBounds[j] = cut(g2, cellBounds[j], divider)
        }
    }
    return cellBounds
}

function middlePoint(g1, g2, d, d1) {
    const x1 = g1.x
    const y1 = g1.y
    const x2 = g2.x
    const y2 = g2.y

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
