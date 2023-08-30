export class Point {
    constructor(x, y) {
        this.x = x
        this.y = y
    }

    distanceTo(point) {
        const dx = point.x - this.x
        const dy = point.y - this.y
        return Math.sqrt((dx * dx) + (dy * dy))
    }
}

export class Generator extends Point {
    constructor(x, y, weight) {
        super(x, y)
        this.weight = weight
    }
}

export class Line {
    constructor(begin, end) {
        this.begin = begin
        this.end = end
    }

    // Returns an intersection point with the other line. The intersectioon point can be out of the line bounds.
    intersection(other, strictOnThis = false, strictOnOther = false) {
        const x1 = this.begin.x
        const y1 = this.begin.y
        const x2 = this.end.x
        const y2 = this.end.y
        const x3 = other.begin.x
        const y3 = other.begin.y
        const x4 = other.end.x
        const y4 = other.end.y
    
        const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))
        if (denom == 0.0) {
            return null
        }
        const numea = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))
        const ua = numea / denom
    
        var x = x1 + (ua * (x2 - x1));
        var y = y1 + (ua * (y2 - y1));
        const result = new Point(x, y)
        if (strictOnThis && !inLineBounds(result, this)) {
            return null
        }
        if (strictOnOther && !inLineBounds(result, other)) {
            return null
        }
        return result

        function inLineBounds(point, line) {
            const x = point.x
            const y = point.y
            const x1 = line.begin.x
            const y1 = line.begin.y
            const x2 = line.end.x
            const y2 = line.end.y
            return (Math.min(x1, x2) <= x) && (x <= Math.max(x1, x2))
                && (Math.min(y1, y2) <= y) && (y <= Math.max(y1, y2))
        }
    }
}

export class Polygon {
    constructor(vertices) {
        if (vertices.length < 3) {
            throw `Polygon must have at least 3 vertices. Got [${vertices}].`
        }
        this.vertices = vertices
    }

    centroid() {
        let ax = 0
        let ay = 0
        let area = 0
        this.forEachFacet((begin, end) => {
            const xk = begin.x
            const yk = begin.y
            const xk1 = end.x
            const yk1 = end.y

            const shared = xk * yk1 - xk1 * yk
            area += shared
            ax += (xk + xk1) * shared
            ay += (yk + yk1) * shared
        })
        area *= 0.5
        return new Point(ax / (6 * area), ay / (6 * area))
    }

    forEachFacet(callback) {
        const length = this.vertices.length
        for (let i = 0; i < length; i++) {
            const begin = this.vertices[i]
            let endIndex = i + 1
            if (endIndex == length) {
                endIndex = 0
            }
            const end = this.vertices[endIndex]
            callback(begin, end)
        }
    }
}

export function onOppositeSides(p1, p2, l) {
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