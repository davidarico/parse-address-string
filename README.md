# Fork of [parse-address-string](https://github.com/fluffybunnies/parse-address-string)

Major changes:
 - Remove `process.nextTick` dependency/replace callbacks with regular returns (React Native compatibility)
 - Normalize state and country, if any, to use the abbreviated form (CA, US, etc.)
