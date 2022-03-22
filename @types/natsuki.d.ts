export interface INatsuki {
  pageX: number;
  pageY: number;
}

export interface INatsukiStart extends INatsuki {
  clientX: number;
  clientY: number;
}

export interface INatsukiMove extends INatsuki {
  shiftX: number;
  shiftY: number;
}
