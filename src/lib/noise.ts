/** @file Basic permutation noise functions. */
import { MathUtils } from "three";

export function permute(x: number): number {
  return MathUtils.euclideanModulo((34.0 * x + 1.0) * x, 289.0);
}

export function permute2(x: number, y: number): number {
  return permute(x + permute(y));
}

export function permute3(x: number, y: number, z: number): number {
  return permute(x + permute(y + permute(z)));
}

export function noise(x: number): number {
  return permute(x) / 289.0;
}

export function noise2(x: number, y: number): number {
  return permute2(x, y) / 289.0;
}

export function noise3(x: number, y: number, z: number): number {
  return permute3(x, y, z) / 289.0;
}
