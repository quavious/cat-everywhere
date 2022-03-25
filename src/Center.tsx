/* eslint-disable no-undef */
import { useEffect, useState, VoidFunctionComponent } from 'react';
import { Coord } from '../@types/coord';
import { center } from './utils/assets';

export interface CenterProp extends google.maps.MarkerOptions {
  coord: Coord;
}

const Center: VoidFunctionComponent<CenterProp> = function Center({ coord, ...options }) {
  const [marker, setMarker] = useState<google.maps.Marker>();
  useEffect(() => {
    if (!marker) {
      setMarker(new google.maps.Marker());
    }
    return () => {
      if (marker) {
        marker.setMap(null);
      }
    };
  }, [marker]);
  useEffect(() => {
    if (marker) {
      marker.setOptions({ ...options });
      marker.setIcon({
        url: center,
      });
    }
  }, [marker, options]);
  useEffect(() => {
    if (!marker) {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Marker Event Mounted');
    }
  }, [marker]);

  return null;
};

export default Center;
