import { Color } from 'three-full/sources/math/Color';
import { GridHelper } from 'three-full/sources/helpers/GridHelper';

const ThreeGrid = ({ size, gridColor, centerLineColor }) => {
  const divisions = size / 2;
  const grid = new GridHelper(size, divisions, new Color(centerLineColor), new Color(gridColor));
  grid.material.opacity = 0.4;
  grid.material.transparent = true;
  return grid;
};

export default ThreeGrid;
