import {Generator, Line, Point, Polygon} from "./core.js"

export function calculate(boundPolygon, generators) {
    const length = generators.length
    if (length == 0) {
        return []
    }

    if (length == 1) {
        return [boundPolygon]
    }

    generators = normalizedGeneratorsWithRespectToDistances(generators)
    const cellBounds = Array(length).fill(boundPolygon)
    for (let i = 0; i < length - 1; i++) {
        for (let j = i + 1; j < length; j++) {
            const divider = divisionLine(generators[i], generators[j])
            cellBounds[i] = cut(generators[i], cellBounds[i], divider)
            cellBounds[j] = cut(generators[j], cellBounds[j], divider)
        }
    }
    return cellBounds
}

function divisionLine(g_i, g_j) {
    const x_i = g_i.x
    const y_i = g_i.y
    const w_i = g_i.weight
    const x_j = g_j.x
    const y_j = g_j.y
    const w_j = g_j.weight

    const dx = x_i - x_j
    const dy = y_i - y_j
    const bb = ((x_i * x_i - x_j * x_j) + (y_i * y_i - y_j * y_j) - (w_i * w_i - w_j * w_j)) / 2
    function f_x(y) {
        const k = -(dy / dx)
        const b = bb / dx
        const x = k * y + b
        return x
    }
    function f_y(x) {
        const k = -(dx / dy)
        const b = bb / dy
        const y = k * x + b
        return y
    }

    let x1
    let y1
    let x2
    let y2
    if (y_i == y_j) {
        y1 = 0
        x1 = f_x(y1)
        y2 = 1
        x2 = f_x(y2)
    } else {
        x1 = 0
        y1 = f_y(x1)
        x2 = 1
        y2 = f_y(x2)
    }

    return new Line(new Point(x1, y1), new Point(x2, y2))
}

function intersectionOfFacetAndLine(facet, line) {
    const intersectionPoint = intersection(facet, line)
    if (intersectionPoint == null) {
        return null
    }
    const intX = intersectionPoint.x
    const intY = intersectionPoint.y
    const onFacetX = (Math.min(facet.begin.x, facet.end.x) <= intX) && (intX <= Math.max(facet.begin.x, facet.end.x))
    const onFacetY = (Math.min(facet.begin.y, facet.end.y) <= intY) && (intY <= Math.max(facet.begin.y, facet.end.y))
    if (onFacetX && onFacetY) {
        return new Point(intX, intY)
    }
    return null
}

function intersection(l1, l2) {
    const denom = ((l2.end.y - l2.begin.y) * (l1.end.x - l1.begin.x)) -
            ((l2.end.x - l2.begin.x) * (l1.end.y - l1.begin.y))

    const numea = ((l2.end.x - l2.begin.x) * (l1.begin.y - l2.begin.y)) -
            ((l2.end.y - l2.begin.y) * (l1.begin.x - l2.begin.x))

    const numeb = ((l1.end.x - l1.begin.x) * (l1.begin.y - l2.begin.y)) -
            ((l1.end.y - l1.begin.y) * (l1.begin.x - l2.begin.x))

    if (denom == 0.0) {
        //TODO
        if (numea == 0.0 && numeb == 0.0) {
            return null
        }
        return null
    }

    const ua = numea / denom
    const ub = numeb / denom//TODO not used?

    const intX = l1.begin.x + ua * (l1.end.x - l1.begin.x)
    const intY = l1.begin.y + ua * (l1.end.y - l1.begin.y)

    return new Point(intX, intY)
}

function cut(generator, polygon, line) {
    const newVertices = []
    polygon.forEachFacet((begin, end) => {
        if (!onOppositeSides(generator, begin, line)) {
            newVertices.push(begin)
        }
        const facet = new Line(begin, end)
        const intersectionPoint = intersectionOfFacetAndLine(facet, line)
        if (intersectionPoint != null) {
            newVertices.push(intersectionPoint)
        }
    })
    return new Polygon(newVertices)
}

function onOppositeSides(p1, p2, l) {
    const ax = p1.x
    const ay = p1.y
    const bx = p2.x
    const by = p2.y
    const x1 = l.begin.x
    const y1 = l.begin.y
    const x2 = l.end.x
    const y2 = l.end.y
    return ((y1 - y2) * (ax - x1) + (x2 - x1) * (ay - y1)) * ((y1 - y2) * (bx - x1) + (x2 - x1) * (by - y1)) < 0
}

function normalizedGeneratorsWithRespectToDistances(generators) {
    if (generators.length < 2) {
        return generators
    }

    let minK = Number.MAX_VALUE
    for (let i = 0; i < generators.length - 1; i++) {
        for (let j = i + 1; j < generators.length; j++) {
            const dist = generators[i].distanceTo(generators[j])
            const ws = generators[i].weight + generators[j].weight
            const k = dist / ws
            minK = Math.min(minK, k)
        }
    }

    return generators.map(generator => new Generator(generator.x, generator.y, generator.weight * minK))
}
