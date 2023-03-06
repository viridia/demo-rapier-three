export type Rapier = typeof import('@dimforge/rapier3d');

export function getRapier() {
  // eslint-disable-next-line import/no-named-as-default-member
  return import('@dimforge/rapier3d');
}
