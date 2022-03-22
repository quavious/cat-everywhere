/* eslint-disable no-undef */
import { faCircleLeft, faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Status, Wrapper } from '@googlemaps/react-wrapper';
import React, { useCallback, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { CoordResolve } from '../@types/coord';
import Natsuki from './Natsuki';

function MapView() {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const getCoordinate = useCallback(async () => {
    const nextCoord = new Promise((res: CoordResolve, rej) => {
      try {
        window.navigator.geolocation.getCurrentPosition((data) => {
          const { latitude, longitude } = data.coords;
          res([latitude, longitude]);
        });
      } catch (err) {
        rej(err);
      }
    });
    return nextCoord;
  }, []);

  useEffect(() => {
    getCoordinate()
      .then(([lat, lon]) => {
        if (!ref.current) {
          throw new Error('Element Not Found');
        }
        (() =>
          new window.google.maps.Map(ref.current, {
            center: new google.maps.LatLng(lat, lon),
            zoom: 15,
          }))();
      })
      .catch(() => {});
  }, [ref, getCoordinate]);

  const render = (status: Status) => {
    if (status === Status.FAILURE) {
      return <h1>Failed</h1>;
    }
    return <h1>Loading</h1>;
  };

  return (
    <>
      <div style={{ width: '100%', height: '6vh' }} className="bg-teal-500">
        <div className="w-full h-full px-6 text-lg flex justify-between px-4 items-center">
          <div className="flex items-center font-bold text-white">
            <FontAwesomeIcon
              icon={faCircleLeft}
              onClick={(e) => {
                e.preventDefault();
                navigate('/');
              }}
              className="cursor-pointer"
            />
            <h2 className="hidden md:flex ml-2">Natsuki Everywhere</h2>
          </div>
          {/* <FontAwesomeIcon icon={faMagnifyingGlass} className="cursor-pointer" /> */}
        </div>
      </div>
      <Wrapper apiKey={process.env.GOOGLE_MAP_KEY || ''} render={render} libraries={['places', 'geometry']}>
        <div ref={ref} id="map" style={{ width: '100%', height: '94vh' }} />
      </Wrapper>
      <Natsuki />
    </>
  );
}

export default MapView;
