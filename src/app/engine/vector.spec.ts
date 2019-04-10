import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Vector } from './vector';

describe('Vector', () => {
  describe('getVectorFromVectorToVector()', () => {
    it('', () => {
      const v1 = new Vector({x: 0.0, y: 1.0});
      const v2 = new Vector({x: 1.0, y: 1.0});
      const v3 = Vector.getVectorFromVectorToVector(v1, v2);
      expect(v3.getX()).toBe(1.0);
      expect(v3.getY()).toBe(0.0);
    });
  });

  describe('getFourClosestClones()', () => {
    it('', () => {
      const v1 = new Vector({x: 0.5, y: 0.0});
      const v2 = new Vector({x: -0.5, y: 0.0});
      const w = 10;
      const h = 10;
      const vs = Vector.getFourClosestClones(v1, v2, w, h);
      expect(vs[0].getX()).toBe(-0.5);
      console.log(vs);
    });
  });
});
