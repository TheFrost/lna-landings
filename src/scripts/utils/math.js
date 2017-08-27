export const norm = (value, min, max) => (value - min) / (max - min);

export const lerp = (min, max, t) => min + (max - min) * t;

export const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

export const randomInt = (min, max) => Math.floor(Math.random() * ((max - min) + 1)) + min
;

export const map = (srcValue, srcMin, srcMax, dstMin, dstMax) => {
  const n = norm(srcValue, srcMin, srcMax);
  return lerp(dstMin, dstMax, n);
};
