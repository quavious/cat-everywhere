/* eslint-disable jsx-a11y/no-noninteractive-element-interactions */
import React, { useEffect, useRef } from 'react';
import { Draggable } from '../@types/unit';
import { onEnd, onMove, onPreStart, onStart } from './store/features/unit';
import { useUnitDispatch, useUnitSelector } from './store/hooks';
import ImageStatus from './utils/image';
import { cat } from './utils/assets';
import { suspend } from './utils/suspend';
import { ImageMouseEvent, ImageTouchEvent } from '../@types/event';

const Unit = function Unit() {
  const dispatch = useUnitDispatch();
  const selector = useUnitSelector((state) => state.unit);
  const ref = useRef<HTMLImageElement>(null);
  useEffect(() => {
    document.onmousemove = function fn(e) {
      e.preventDefault();
      if (selector.exp !== ImageStatus.MOVE) {
        return;
      }
      const { pageX, pageY } = e;
      dispatch(onMove({ pageX, pageY }));
    };
    document.ontouchmove = function fn(e) {
      e.preventDefault();
      if (selector.exp !== ImageStatus.MOVE || e.touches.length < 1) {
        return;
      }
      const { pageX, pageY } = e.touches[0];
      dispatch(onMove({ pageX, pageY }));
    };
  }, [selector, dispatch]);

  const handleStart = (event: Draggable) => {
    const { pageX, pageY, clientX, clientY } = event;
    if (!ref.current) {
      return;
    }
    const { left, top } = ref.current.getBoundingClientRect();
    dispatch(onPreStart({ clientX, clientY, left, top }));
    dispatch(onStart({ pageX, pageY, image: cat, exp: ImageStatus.MOVE }));
  };

  const handleEnd = async () => {
    dispatch(onEnd({ exp: ImageStatus.STOP, image: cat }));
    await suspend(2000);
    dispatch(onEnd({ exp: ImageStatus.NORMAL, image: cat }));
  };
  const handleMouseDown = (e: ImageMouseEvent) => {
    e.preventDefault();
    handleStart(e);
  };
  const handleTouchStart = (e: ImageTouchEvent) => {
    e.preventDefault();
    if (e.touches.length < 1) {
      return;
    }
    handleStart(e.touches[0]);
  };
  const handleMouseUp = async (e: ImageMouseEvent) => {
    e.preventDefault();
    await handleEnd();
  };
  const handleTouchEnd = async (e: ImageTouchEvent) => {
    e.preventDefault();
    await handleEnd();
  };
  return (
    <img
      src={selector.image}
      ref={ref}
      alt="Natsuki"
      style={{ position: 'fixed', left: `${selector.coord[0]}px`, top: `${selector.coord[1]}px`, zIndex: 1000 }}
      className="natsuki w-48 md:w-64 lg:w-72"
      onDragStart={() => false}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    />
  );
};

export default Unit;
