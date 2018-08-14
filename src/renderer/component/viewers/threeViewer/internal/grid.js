import { GridHelper, Color } from './three';

const ThreeGrid = ({ size, gridColor, centerLineColor }) => {
  const divisions = size / 2;
  const grid = new GridHelper(size, divisions, new Color(centerLineColor), new Color(gridColor));
  grid.material.opacity = 0.4;
  grid.material.transparent = true;
  return grid;
};

export default ThreeGrid;
