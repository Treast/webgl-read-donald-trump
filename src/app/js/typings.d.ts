import { Object3D } from 'three';

export interface ControlsPosition {
  x: number;
  y: number;
  z: number;
}

export interface FlagInformations {
  name: string;
  parent: string;
  windForce: number;
}

export interface IFact {
  title: string;
  date: string;
  content: string;
  url: string;
  parent: string;
}

export interface MousePosition {
  x: number;
  y: number;
}