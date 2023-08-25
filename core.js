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

export class WeightedPoint extends Point {
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

    distanceTo(point) {
        return Line.distanceTo(this.begin, this.end, point)
    }

    static distanceTo(begin, end, point) {
        const x0 = point.x
        const y0 = point.y
        const x1 = begin.x
        const y1 = begin.y
        const x2 = end.x
        const y2 = end.y
        const ed = euclidianDistance(x1, y1, x2, y2)
        return Math.abs((y2 - y1)*x0 - (x2 - x1)*y0 + x2*y1 - y2*x1) / ed
    }
}

export class Polygon {
    constructor(vertices) {
        if (vertices.length < 3) {
            throw 'Illegal argument'
        }
        this.vertices = vertices
    }

    area() {
        let area
        this.processFacets((begin, end) => {
            const ik = begin.x
            const jk = begin.y
            const ik1 = end.x
            const jk1 = end.y
            area += ik * jk1 - ik1 * jk

            return true
        })
        return Math.abs(0.5 * area)
    }

    centroid() {
        let ax
        let ay
        let area
        this.processFacets((begin, end) => {
            const xk = begin.x
            const yk = begin.y
            const xk1 = end.x
            const yk1 = end.y

            const shared = xk * yk1 - xk1 * yk
            area += shared
            ax += (xk + xk1) * shared
            ay += (yk + yk1) * shared

            return true
        })
        area *= 0.5
        return new Point(ax / (6 * area), ay / (6 * area))
    }

    contains(point) {
        let result = false
        this.processFacets((begin, end) => {
            const p_x = point.x
            const p_y = point.y
            const begin_x = begin.x
            const begin_y = begin.y
            const end_x = end.x
            const end_y = end.y

            if ((p_x == begin_x && p_y == begin_y) || (p_x == end_x && p_y == end_y)) {
                result = true
                return false
            }

            if ( ((end_y > p_y) != (begin_y > p_y)) && (p_x < (begin_x - end_x) * (p_y - end_y) / (begin_y - end_y) + end_x) ){
                result = !result
            }

            return true
        })
        return result
    }

    processFacets(callback) {
        //TODO don't use iterator
        const iterator = this.vertices[Symbol.iterator]()
        const first = iterator.next().value
        let begin = first
        let end
        let interrupted
        let next
        while (!(next = iterator.next()).done) {
            end = next.value
            interrupted = !callback(begin, end)
            if (interrupted) {
                break
            }
            begin = end
        }
        if (!interrupted) {
            interrupted = !callback(begin, first)
        }
    }
}
