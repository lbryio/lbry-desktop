
# humanize-number

  Humanize a number `1000000.99` -> `1,000,000.99`

## Installation

    $ component install component/humanize-number

## Example

```js
var humanize = require('humanize-number');

humanize(1000);
// => '1,000'

humanize(1000.55, { delimiter: '.', separator: ',' });
// => '1.000,55'
```

## License

  MIT

