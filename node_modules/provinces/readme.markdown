# provinces

state and province lists for countries

# completeness

This module currently has states and provinces for:

* united states
* united kingdom
* canada
* mexico
* australia
* china

# methods

``` js
var provinces = require('provinces')
```

Requiring the module gives you an array of object rows.

# data format

Each row consists of:

* row.name - full name of the province or state
* row.short - optional 2 or 3 character short name
* row.alt - optional array of additional names and abbreviations

# install

With [npm](https://npmjs.org) do:

```
npm install provinces
```

# license

MIT
