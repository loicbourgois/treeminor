export class Vector {

  private x: number;
  private y: number;

  static getVectorFromVectorToVector(v1, v2) {
    const x = v2.x - v1.x;
    const y = v2.y - v1.y;
    return new Vector({x, y});
  }

  static sameNormals(v1, v2) {
    const normal1 = v1.getNormalized();
    const normal2 = v2.getNormalized();
    const xDiff = Math.abs( normal1.x - normal2.x );
    const yDiff = Math.abs( normal1.y - normal2.y );
    if (xDiff < 0.01 && yDiff < 0.01) {
      return true;
    } else {
      return false;
    }
  }

  static same(v1, v2) {
    const xDiff = Math.abs( v1.x - v2.x );
    const yDiff = Math.abs( v1.y - v2.y );
    if (xDiff < 0.01 && yDiff < 0.01) {
      return true;
    } else {
      return false;
    }
  }

  static getDistance(v1, v2) {
    const deltaX = v1.x - v2.x;
    const deltaY = v1.y - v2.y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  static getClosestAlongNormal(vector, vectors, normal) {
    let returnVector = null;
    let distance = null;
    vectors.forEach(candidateVector => {
      const candidateNormal = Vector.getVectorFromVectorToVector(vector, candidateVector).getNormalized();
      if (Vector.same(normal, candidateNormal)) {
        const d = Vector.getDistance(vector, candidateVector);
        if (distance === null || d < distance) {
          distance = d;
          returnVector = candidateVector;
        }
      } else {
        // NTD
      }
    });
    return returnVector;
  }

  //
  // line intercept math by Paul Bourke http://paulbourke.net/geometry/pointlineplane/
  // Determine the intersection point of two line segments
  // Return FALSE if the lines don't intersect
  //
  static getIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false;
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // Lines are parallel
    if (denominator === 0) {
      return false;
    }

    const ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denominator;
    const ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denominator;

    /*// is the intersection along the segments
    if (ua < 0 || ua > 1 || ub < 0 || ub > 1) {
      return false;
    }*/

    // Return a vector with the x and y coordinates of the intersection
    const x = x1 + ua * (x2 - x1);
    const y = y1 + ua * (y2 - y1);
    return new Vector({x, y});
  }

  constructor(vector: any) {
    this.loadConfiguration(vector);
  }

  loadConfiguration(configuration: any) {
    if (!configuration) {
      configuration = {};
    } else if (typeof configuration === 'string') {
      configuration = JSON.parse(configuration);
    } else if (configuration instanceof String) {
      configuration = JSON.parse(configuration as string);
    } else {
      // NTD
    }
    const vector = configuration;
    this.x = (vector.x !== undefined) ? vector.x : undefined;
    this.y = (vector.y !== undefined) ? vector.y : undefined;
  }

  translate(x, y) {
    this.x = this.x + x;
    this.y = this.y + y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  add(x: number, y: number) {
    this.x += x;
    this.y += y;
  }

  addVector(vector: Vector) {
    this.x += vector.x;
    this.y += vector.y;
  }

  asArray() {
    return [this.x, this.y];
  }

  getX() {
    return this.x;
  }

  getY() {
    return this.y;
  }

  getNormalized() {
    const length = Math.sqrt(this.x * this.x + this.y * this.y);
    const x = this.x / length;
    const y = this.y / length;
    return new Vector({x, y});
  }
}
