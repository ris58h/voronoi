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
    intersection(other) {
        const x1 = this.begin.x
        const y1 = this.begin.y
        const x2 = this.end.x
        const y2 = this.end.y
        const x3 = other.begin.x
        const y3 = other.begin.y
        const x4 = other.end.x
        const y4 = other.end.y
    
        const denom = ((y4 - y3) * (x2 - x1)) - ((x4 - x3) * (y2 - y1))
        const numea = ((x4 - x3) * (y1 - y3)) - ((y4 - y3) * (x1 - x3))
        // const numeb = ((x2 - x1) * (y1 - y3)) - ((y2 - y1) * (x1 - x3))
    
        if (denom == 0.0) {
            return null
        }
    
        const ua = numea / denom
        // const ub = numeb / denom
    
        var x = x1 + (ua * (x2 - x1));
        var y = y1 + (ua * (y2 - y1));
        return new Point(x, y)
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
