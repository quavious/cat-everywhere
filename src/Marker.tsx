/* eslint-disable no-undef */
import { Dispatch, SetStateAction, useEffect, useState, VoidFunctionComponent } from 'react';
import { SelectedProps } from '../@types/props';

export interface MarkerProp extends google.maps.MarkerOptions {
  photo: string;
  selected: SelectedProps;
  setSelected: Dispatch<SetStateAction<SelectedProps>>;
}

const Marker: VoidFunctionComponent<MarkerProp> = function Marker({ photo, selected, setSelected, ...options }) {
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
      marker.setOptions(options);
    }
  }, [marker, options]);
  useEffect(() => {
    if (!marker) {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Marker Event Mounted');
    }
    google.maps.event.clearListeners(marker, 'click');
    marker.addListener('click', () => {
      setSelected((prev) => ({ ...prev, clicked: true, photo }));
    });
  }, [marker, photo, setSelected]);

  return null;
};

export default Marker;
