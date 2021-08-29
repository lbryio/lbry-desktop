// @flow
import React from 'react';
import { useRadioState, Radio, RadioGroup } from 'reakit/Radio';

type Props = {
  files: Array<WebFile>,
  onChange: (WebFile | void) => void,
};

type RadioProps = {
  id: string,
  label: string,
};

// Same as FormField type="radio" but it works with reakit:
const ForwardedRadio = React.forwardRef((props: RadioProps, ref) => (
  <span className="radio">
    <input {...props} type="radio" ref={ref} />
    <label htmlFor={props.id}>{props.label}</label>
  </span>
));

function FileList(props: Props) {
  const { files, onChange } = props;
  const radio = useRadioState();

  const getFile = (value?: string) => {
    if (files && files.length) {
      return files.find((file: WebFile) => file.name === value);
    }
  };

  React.useEffect(() => {
    if (radio.stops.length) {
      if (!radio.currentId) {
        radio.first();
      } else {
        const first = radio.stops[0].ref.current;
        // First auto-selection
        if (first && first.id === radio.currentId && !radio.state) {
          const file = getFile(first.value);
          // Update state and select new file
          onChange(file);
          radio.setState(first.value);
        }

        if (radio.state) {
          // Find selected element
          const stop = radio.stops.find(item => item.id === radio.currentId);
          const element = stop && stop.ref.current;
          // Only update state if new item is selected
          if (element && element.value !== radio.state) {
            const file = getFile(element.value);
            // Sselect new file and update state
            onChange(file);
            radio.setState(element.value);
          }
        }
      }
    }
  }, [radio, onChange]);

  return (
    <div className={'file-list'}>
      <RadioGroup {...radio} aria-label="files">
        {files.map(({ name }) => {
          return <Radio key={name} {...radio} value={name} label={name} as={ForwardedRadio} />;
        })}
      </RadioGroup>
    </div>
  );
}

export default FileList;
