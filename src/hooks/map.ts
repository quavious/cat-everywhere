/* eslint-disable no-undef */
// It is written in Google Docs

import { isLatLngLiteral } from '@googlemaps/typescript-guards';
import { createCustomEqual } from 'fast-equals';
import { useEffect, useRef } from 'react';

export const deepCompareEqualsForMaps = createCustomEqual((deepEqual) => (p: any, q: any) => {
  if (isLatLngLiteral(p) || p instanceof google.maps.LatLng || isLatLngLiteral(q) || q instanceof google.maps.LatLng) {
    return new google.maps.LatLng(p).equals(new google.maps.LatLng(q));
  }

  return deepEqual(p, q);
});

export function useDeepCompareMemoize(value: any) {
  const ref = useRef();

  if (!deepCompareEqualsForMaps(value, ref.current)) {
    ref.current = value;
  }

  return ref.current;
}

export function useDeepCompareEffectForMaps(callback: React.EffectCallback, dependencies: any[]) {
  useEffect(callback, dependencies.map(useDeepCompareMemoize));
}
