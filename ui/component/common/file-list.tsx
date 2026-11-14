import React from "react";
import { useRadioState, Radio, RadioGroup } from "reakit/Radio";

type Props = {
  files: Array<File>;
  onChange: (arg1: File | undefined) => void;
};

type RadioProps = {
  id: string;
  label: string;
};

// Same as FormField type="radio" but it works with reakit:
const ForwardedRadio = React.forwardRef((props: RadioProps, ref) => (
  <span className="radio">
    {/* @ts-expect-error - TS2322 - Type 'ForwardedRef<unknown>' is not assignable to type 'LegacyRef<HTMLInputElement>'. */}
    <input {...props} type="radio" ref={ref} />
    <label htmlFor={props.id}>{props.label}</label>
  </span>
));

function FileList(props: Props) {
  const { files, onChange } = props;
  const radio = useRadioState();

  const getFile = (value?: string) => {
    if (files && files.length) {
      return files.find((file: File) => file.name === value);
    }
  };

  React.useEffect(() => {
    if (radio.items.length) {
      if (!radio.currentId) {
        radio.first();
      } else {
        const first = radio.items[0].ref.current;
        // First auto-selection
        if (first && first.id === radio.currentId && !radio.state) {
          // @ts-expect-error - TS2339 (ts-migration)
          const file = getFile(first.value);
          // Update state and select new file
          onChange(file);
          // @ts-expect-error - TS2339 (ts-migration)
          radio.setState(first.value);
        }

        if (radio.state) {
          // Find selected element
          const stop = radio.items.find((item) => item.id === radio.currentId);
          const element = stop && stop.ref.current;
          // Only update state if new item is selected
          // @ts-expect-error - TS2339 (ts-migration)
          if (element && element.value !== radio.state) {
            // @ts-expect-error - TS2339 (ts-migration)
            const file = getFile(element.value);
            // Select new file and update state
            onChange(file);
            // @ts-expect-error - TS2339 (ts-migration)
            radio.setState(element.value);
          }
        }
      }
    }
  }, [radio, onChange, getFile]);

  return (
    <div className={"file-list"}>
      <RadioGroup {...radio} aria-label="files">
        {files.map(({ name }) => {
          return <Radio key={name} {...radio} value={name} label={name} as={ForwardedRadio} />;
        })}
      </RadioGroup>
    </div>
  );
}

export default FileList;
