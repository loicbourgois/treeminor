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
});
