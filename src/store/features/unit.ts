import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ImageStatus from '../../utils/image';
import { cat } from '../../utils/assets';

interface UnitState {
  coord: [number, number];
  offset: [number, number];
  exp: ImageStatus;
  image: any;
}

interface PreStartPayload {
  clientX: number;
  clientY: number;
  left: number;
  top: number;
}

interface StartPayload {
  pageX: number;
  pageY: number;
  exp: ImageStatus;
  image: any;
}

interface MovePayload {
  pageX: number;
  pageY: number;
}

interface EndPayload {
  exp: ImageStatus;
  image: any;
}

interface UnitPayload {
  nextImage: any;
}

const initialState: UnitState = {
  coord: [30, 30],
  offset: [30, 30],
  exp: ImageStatus.NORMAL,
  image: cat,
};

export const unitSlice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    onPreStart: (state, action: PayloadAction<PreStartPayload>) => {
      const { clientX, clientY, left, top } = action.payload;
      return { ...state, offset: [clientX - left, clientY - top] };
    },
    onStart: (state, action: PayloadAction<StartPayload>) => {
      const { pageX, pageY, exp, image } = action.payload;
      const { offset } = state;
      return { ...state, coord: [pageX - offset[0], pageY - offset[1]], exp };
    },
    onMove: (state, action: PayloadAction<MovePayload>) => {
      const { pageX, pageY } = action.payload;
      const [shiftX, shiftY] = state.offset;
      return { ...state, coord: [pageX - shiftX, pageY - shiftY] };
    },
    onEnd: (state, action: PayloadAction<EndPayload>) => {
      const { exp, image } = action.payload;
      return { ...state, exp };
    },
    onEndConfirm: (state, action: PayloadAction<EndPayload>) => {
      const { exp, image } = action.payload;
      return { ...state, exp };
    },
    onUnitChange: (state, action: PayloadAction<UnitPayload>) => {
      const { nextImage } = action.payload;
      return { ...state, image: nextImage };
    },
  },
});

export const { onPreStart, onStart, onMove, onEnd, onEndConfirm, onUnitChange } = unitSlice.actions;

export default unitSlice.reducer;
