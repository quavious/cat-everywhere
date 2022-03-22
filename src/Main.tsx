/* eslint-disable jsx-a11y/label-has-associated-control */
import { faFileArrowUp, faMapLocationDot } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { ChangeEvent, useRef } from 'react';
import { Link } from 'react-router-dom';
import Natsuki from './Natsuki';

import background from '../public/background-default.jpg';

function Main() {
  const bgRef = useRef<HTMLDivElement>(null);
  const handleChange = async (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    const { files } = e.target;
    if (!files) return;
    const file = files[0];
    const ext = file.name.split('.').pop();
    if (!ext) return;

    try {
      const buf = await file.arrayBuffer();

      let bin = '';
      const array = new Uint8Array(buf);
      array.forEach((el) => {
        bin += String.fromCharCode(el);
      });
      const b64 = `data:image/${ext};base64,${window.btoa(bin)}`;
      if (!bgRef.current) return;
      bgRef.current.style.background = `url(${b64}) center center / cover no-repeat`;
    } catch (err) {
      console.log('error');
    }
  };
  return (
    <div
      ref={bgRef}
      style={{
        background: `url(${background}) center center / cover no-repeat`,
      }}
      className="w-full h-screen"
    >
      <Natsuki />
      <label
        htmlFor="background"
        className="fixed bottom-4 left-8 flex items-center bg-red-500 px-2 py-2 rounded cursor-pointer"
      >
        <FontAwesomeIcon icon={faFileArrowUp} color="white" className="text-2xl" />
        <h5 className="hidden md:flex text-white font-bold ml-2">Change Background</h5>
      </label>
      <input
        type="file"
        name=""
        id="background"
        className="hidden"
        accept="image/*"
        onChange={handleChange}
        multiple={false}
      />
      <h5 className="fixed bottom-4 right-8 rounded bg-teal-500 px-2 py-2">
        <Link to="/map-view">
          <FontAwesomeIcon icon={faMapLocationDot} className="text-2xl" color="white" />
        </Link>
      </h5>
    </div>
  );
}

export default Main;
