/* eslint-disable no-undef */
import { faCircleLeft, faMagnifyingGlass, faClose } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Wrapper } from '@googlemaps/react-wrapper';
import React, {
  Children,
  cloneElement,
  Dispatch,
  FormEvent,
  FunctionComponent,
  isValidElement,
  SetStateAction,
  useCallback,
  useEffect,
  useRef,
  useState,
  VFC,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { Coord, CoordResolve } from '../@types/coord';
import { PlaceProps, SelectedProps } from '../@types/props';
import Center from './Center';
import { useDeepCompareEffectForMaps } from './hooks/map';
import Marker from './Marker';
import Unit from './Unit';

interface MapProps extends google.maps.MapOptions {
  selected: SelectedProps;
  setSelected: Dispatch<SetStateAction<SelectedProps>>;
  setPlaces: Dispatch<SetStateAction<PlaceProps[]>>;
  setOuterCoord: Dispatch<SetStateAction<Coord>>;
}

const Map: FunctionComponent<MapProps> = function Map({
  setOuterCoord,
  selected,
  setSelected,
  setPlaces,
  children,
  ...options
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [innerCoord, setInnerCoord] = useState<Coord>();
  const [map, setMap] = useState<google.maps.Map>();
  const [mapFetch, setMapFetch] = useState<google.maps.places.PlacesService>();
  const [keyword, setKeyword] = useState({
    value: '',
    open: false,
  });
  const navigate = useNavigate();

  const getCoordinate = useCallback(async () => {
    const nextCoord = new Promise((res: CoordResolve, rej) => {
      try {
        window.navigator.geolocation.getCurrentPosition((data) => {
          const { latitude, longitude } = data.coords;
          setInnerCoord(() => [latitude, longitude]);
          res([latitude, longitude]);
        });
      } catch (err) {
        rej(err);
      }
    });
    return nextCoord;
  }, []);

  useEffect(() => {
    getCoordinate().then(([lat, lng]) => {
      if (ref.current) {
        const newMap = new google.maps.Map(ref.current, {
          zoom: 15,
          center: new google.maps.LatLng(lat, lng),
        });
        setMap(newMap);
      }
    });
  }, [ref, getCoordinate]);

  useEffect(() => {
    if (innerCoord) {
      setOuterCoord(innerCoord);
    }
  }, [innerCoord, setOuterCoord]);

  useEffect(() => {
    if (map) {
      setMapFetch(new google.maps.places.PlacesService(map));
    }
  }, [map]);

  useEffect(() => {
    if (!map) {
      return;
    }
    if (process.env.NODE_ENV === 'development') {
      console.log('Map Event Mounted');
    }
    google.maps.event.clearListeners(map, 'click');
    map.addListener('click', (e: google.maps.MapMouseEvent) => {
      const loc = e.latLng;
      if (!loc) {
        return;
      }
      setInnerCoord([loc.lat(), loc.lng()]);
    });
  }, [map]);

  useDeepCompareEffectForMaps(() => {
    if (map) {
      map.setOptions(options);
    }
  }, [map, options]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!mapFetch || !innerCoord) {
      return;
    }
    const [lat, lng] = innerCoord;
    mapFetch.textSearch(
      {
        query: keyword.value,
        location: new google.maps.LatLng(lat, lng),
        radius: 400,
      },
      (resp) => {
        if (!resp) return;
        const data = resp.map((el): PlaceProps | null => {
          if (el.name && el.icon && el.photos && el.place_id && el.geometry && el.geometry.location) {
            const photo = el.photos[0].getUrl();
            const loc = el.geometry.location;
            const { name: title, icon, place_id: placeId } = el;
            return {
              title,
              icon,
              photo,
              placeId,
              lat: loc.lat(),
              lng: loc.lng(),
            };
          }
          return null;
        });
        const filtered = data.filter((el): el is PlaceProps => el !== null);
        if (process.env.NODE_ENV === 'development') {
          console.log(filtered.length);
        }
        setKeyword((prev) => ({ ...prev, open: false }));
        setPlaces(filtered);
        if (filtered.length > 0) {
          map?.setCenter(new google.maps.LatLng(filtered[0].lat, filtered[1].lng));
        }
      },
    );
  };

  return (
    <div className="pt-12 h-screen">
      <div className="bg-teal-500 w-full fixed left-0 top-0 right-0 h-12">
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
            <h2 className="hidden md:flex ml-2 whitespace-nowrap">Natsuki Everywhere</h2>
          </div>
          {keyword.open && (
            <form className="w-full mx-4" onSubmit={handleSubmit}>
              <input
                className="w-full px-2 my-1 py-0.5 text-md"
                value={keyword.value}
                onChange={(e) => {
                  e.preventDefault();
                  setKeyword({ ...keyword, value: e.target.value });
                }}
              />
            </form>
          )}
          <FontAwesomeIcon
            icon={faMagnifyingGlass}
            className="cursor-pointer"
            onClick={(e) => {
              e.preventDefault();
              setKeyword({ ...keyword, open: !keyword.open });
            }}
          />
        </div>
      </div>
      <div ref={ref} className="w-full h-full" />
      {Children.map(children, (child) => {
        if (isValidElement(child)) {
          return cloneElement(child, { map });
        }
        return undefined;
      })}
      {selected.clicked && (
        <div className="w-full h-full fixed top-0 left-0 right-0" style={{ zIndex: 700 }}>
          <button
            className="fixed top-6 right-6 bg-red-500 rounded-lg px-2 py-1"
            type="button"
            onClick={(e) => {
              e.preventDefault();
              setSelected((prev) => ({ ...prev, clicked: false }));
            }}
          >
            <FontAwesomeIcon icon={faClose} color="white" className="fa-2xl" />
          </button>
          <div
            className="w-full h-full"
            style={{
              background: `url(${selected.photo}) center center / cover no-repeat`,
            }}
          />
        </div>
      )}
      <Unit />
    </div>
  );
};

const MapView: VFC = function MapView() {
  const [places, setPlaces] = useState<PlaceProps[]>([]);
  const [outerCoord, setOuterCoord] = useState<Coord>([1000, 1000]);
  const [selected, setSelected] = useState<SelectedProps>({
    clicked: false,
    photo: '',
    title: '',
  });

  return (
    <Wrapper apiKey={process.env.GOOGLE_MAP_KEY || ''} libraries={['places', 'geometry']}>
      <Map setPlaces={setPlaces} selected={selected} setSelected={setSelected} setOuterCoord={setOuterCoord}>
        {places.map((place) => (
          <Marker
            position={new google.maps.LatLng(place.lat, place.lng)}
            key={place.placeId}
            photo={place.photo}
            selected={selected}
            setSelected={setSelected}
          />
        ))}
        {outerCoord[0] !== 1000 && outerCoord[1] !== 1000 && (
          <Center coord={outerCoord} position={new google.maps.LatLng(outerCoord[0], outerCoord[1])} />
        )}
      </Map>
    </Wrapper>
  );
};

export default MapView;
