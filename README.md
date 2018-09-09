# Fork of [parse-address-string](https://github.com/fluffybunnies/parse-address-string)
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FDelightfulStudio%2Fparse-address-string.svg?type=shield)](https://app.fossa.io/projects/git%2Bgithub.com%2FDelightfulStudio%2Fparse-address-string?ref=badge_shield)

Extracts street, city, state, zip, and country components from single-line address string

Major changes:
 - Remove `process.nextTick` dependency/replace callbacks with regular returns (React Native compatibility)
 - `normalize` function; normalizes state and country, if any, to use the abbreviated form (CA, US, etc.)

## Example
```javascript
var parseAddress = require('parse-address-string')

const addressObj = parseAddress('4296 W 7th St, Long Beach, CA 90802')
console.log('Street: ', addressObj.street_address1)
console.log('City: ', addressObj.city)
console.log('State: ', addressObj.state)
console.log('Zip: ', addressObj.postal_code)
console.log('Country: ', addressObj.country)
```


## License
[![FOSSA Status](https://app.fossa.io/api/projects/git%2Bgithub.com%2FDelightfulStudio%2Fparse-address-string.svg?type=large)](https://app.fossa.io/projects/git%2Bgithub.com%2FDelightfulStudio%2Fparse-address-string?ref=badge_large)