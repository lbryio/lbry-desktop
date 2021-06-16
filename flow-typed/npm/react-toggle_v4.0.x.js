// flow-typed signature: 7d44bba9041ba487f4fa83ab9d1bd3c3
// flow-typed version: 064c20def6/react-toggle_v4.0.x/flow_>=v0.54.x

declare module "react-toggle" {
  declare type Icons = {
    checked?: React$Node,
    unchecked?: React$Node
  };

  declare type Props = {
    checked?: boolean,
    defaultChecked?: boolean,
    onChange?: (e: SyntheticInputEvent<*>) => void,
    onFocus?: (e: SyntheticInputEvent<*>) => void,
    onBlur?: (e: SyntheticInputEvent<*>) => void,
    name?: string,
    value?: string,
    id?: string,
    icons?: Icons | boolean,
    "aria-labelledby"?: string,
    "aria-label"?: string,
    disabled?: boolean
  };

  declare export default class Toggle extends React$Component<Props> {}
}
