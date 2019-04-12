import { Utils } from './utils';

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

  static getDistanceToCoordinates(v, x, y) {
    const deltaX = v.x - x;
    const deltaY = v.y - y;
    return Math.sqrt(deltaX * deltaX + deltaY * deltaY);
  }

  static getDistanceSquared(v1, v2) {
    const deltaX = v1.x - v2.x;
    const deltaY = v1.y - v2.y;
    return deltaX * deltaX + deltaY * deltaY;
  }

  static getDistanceSquaredToCoordinates(v, x, y) {
    const deltaX = v.x - x;
    const deltaY = v.y - y;
    return deltaX * deltaX + deltaY * deltaY;
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
  // Given 4 points, returns the point of intersection.
  // Returns false if no intersection exist.
  //
  static getLineLineIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
    // Check if none of the lines are of length 0
    if ((x1 === x2 && y1 === y2) || (x3 === x4 && y3 === y4)) {
      return false;
    }

    const denominator = ((y4 - y3) * (x2 - x1) - (x4 - x3) * (y2 - y1));

    // Lines are parallel
    if (denominator === 0) {
      return false;
    }

    // A valid intersect can be found
    const a = (x1 * y2 - y1 * x2);
    const b = (x3 * y4 - y3 * x4);
    const xNumerator = a * (x3 - x4) - b * (x1 - x2);
    const yNumerator = a * (y3 - y4) - b * (y1 - y2);
    const x = xNumerator / denominator;
    const y = yNumerator / denominator;
    return new Vector({x, y});
  }

  //
  // Given two vectors, v1, v2, compute clones for v2
  // and then returns the 4 closest clones to v1.
  //
  // A clone is a copy of a vector in a neigbouring world.
  //
  // Relative to the current world,
  // the copy is translated by n*width and m*height.
  //
  // The vector v2 is a clone of itself in its own world.
  //
  static getFourClosestClones(v1, v2, width, height) {
    const ws = [-width, 0, width];
    const hs = [-height, 0, height];
    const vs = [];
    ws.forEach(w => {
      hs.forEach(h => {
        const v = new Vector({x: v2.x + w, y: v2.y + h});
        const distanceSquared = Vector.getDistanceSquared(v1, v);
        if (!isNaN(distanceSquared)) {
          vs.push({v, distanceSquared});
        } else {
          // NTD
        }
      });
    });
    // Order by ascending distance
    vs.sort((a, b) => {
      return a.distanceSquared - b.distanceSquared;
    });
    // Return vectors or false
    if (vs.length >= 4) {
      return [vs[0].v, vs[1].v, vs[2].v, vs[3].v];
    } else {
      return false;
    }
  }

  //
  // Same as getFourClosestClones, but return an array of [x, y] arrays
  //
  static getFourClosestClonesAsArrays(v1, v2, width, height) {
    const vs = [];
    for (let w = -width ; w <= width ; w += width) {
      for (let h = -height ; h <= height ; h += height) {
        const x = v2.x + w;
        const y = v2.y + h;
        const distanceSquared = Vector.getDistanceSquaredToCoordinates(v1, x, y);
        if (!isNaN(distanceSquared)) {
          vs.push({x, y, distanceSquared});
        } else {
          // NTD
        }
      }
    }
    // Order by ascending distance
    vs.sort((a, b) => {
      return a.distanceSquared - b.distanceSquared;
    });
    // Return vectors or false
    if (vs.length >= 4) {
      return [
        [vs[0].x, vs[0].y],
        [vs[1].x, vs[1].y],
        [vs[2].x, vs[2].y],
        [vs[3].x, vs[3].y]
      ];
    } else {
      return false;
    }
  }

  constructor(configuration: any) {
    const vector = Utils.getCheckedConfiguration(configuration);
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
