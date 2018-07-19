# Fork of [parse-address-string](https://github.com/fluffybunnies/parse-address-string)
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
