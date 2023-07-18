
module.exports = explodeAddress
module.exports.explodeAddress = explodeAddress
module.exports.implodeAddress = implodeAddress
module.exports.normalize = normalize

const stateMap = require('./lib/states.json')
const countryMap = require('./lib/countries.json')


function normalize({ state, country, ...addressObj }) {
	// normalize state and country, if any
	if ( state ) {
		const normalizedState = stateMap[state.toLowerCase()]
		state = normalizedState || state
	}

	if ( country ) {
		const normalizedCountry = countryMap[country.toLowerCase()]
		country = normalizedCountry || country
	}

	return {
		...addressObj,
		state,
		country
	}
}


function explodeAddress(singleLineAddress){
	var addressObj = {
		street_address1: null
		,city: null
		,state: null
		,postal_code: null
		,country: null
	}
	if (typeof singleLineAddress != 'string') {
		return addressObj
	}
	singleLineAddress = singleLineAddress.trim()

	var postalCode = singleLineAddress.match(/([0-9]{5})|([a-z][0-9][a-z] ?[0-9][a-z][0-9])/gi)
		,indexOfPostalCode = -1
	if (postalCode) {
		postalCode = postalCode.pop() // pick match closest to end
		indexOfPostalCode = singleLineAddress.lastIndexOf(postalCode)
		if (indexOfPostalCode == 0 && singleLineAddress.length > 10) {
			// postal code is probably part of street address
			postalCode = null
			indexOfPostalCode = -1
		}
		if (postalCode) {
			addressObj.postal_code = postalCode
			var everythingAfterPostalCode = singleLineAddress.substr(indexOfPostalCode+postalCode.length)
			singleLineAddress = singleLineAddress.substr(0,indexOfPostalCode)+everythingAfterPostalCode
			var possibleCountry = everythingAfterPostalCode.replace(/\s*,/,'').split(',').shift().trim()
			if (possibleCountry && looksLikeCountry(possibleCountry)) {
				addressObj.country = possibleCountry
				singleLineAddress = singleLineAddress.substr(0,indexOfPostalCode) // just ditch everything after postal + country
			}
		}
	}

	var addySplit = singleLineAddress.split(',')

	// Handle special cases...
	// Neighborhood, City, State
	if (addySplit.length == 3 && looksLikeState(addySplit[2])) {
		addressObj.street_address1 = addySplit[0].trim()
		addressObj.city = addySplit[1].trim()
		addressObj.state = addySplit[2].trim()
		return addressObj
	}
	else if (addySplit.length == 2) { // handle case of "City, State Country"
		const stateCountry = addySplit[1].trim().split(' ').map(x => x.trim())
		if (stateCountry.length == 2 && looksLikeState(stateCountry[0]) && looksLikeCountry(stateCountry[1])) {
			addressObj.city = addySplit[0].trim()
			addressObj.state = stateCountry[0].trim()
			addressObj.country = stateCountry[1].trim()
			return addressObj
		}
	}

	// Handle generic case...
	addySplit.forEach(function(addyPart){
		if (!(addyPart = addyPart.trim())) return
		// if has numbers, assume street address
		if (/[0-9]/.test(addyPart)) {
			return !addressObj.street_address1 && (addressObj.street_address1 = addyPart)
		}
		// if looks like state
		if (looksLikeState(addyPart) && !addressObj.state) {
			return addressObj.state = addyPart
		}
		// if looks like country
		if (looksLikeCountry(addyPart)) {
			return !addressObj.country && (addressObj.country = addyPart)
		}
		// else assume city
		!addressObj.city && (addressObj.city = addyPart)
	})

	return addressObj
}

function implodeAddress(addressObj){
	if (addressObj === null || typeof addressObj != 'object') {
		return ''
	}
	var addyParts = []
		,addyPart
	if (typeof addressObj.street_address1 == 'string' && (addyPart = addressObj.street_address1.trim())) {
		addyParts[0] = addyPart
		if (typeof addressObj.street_address2 == 'string' && (addyPart = addressObj.street_address2.trim())) {
			addyParts[0] += ' '+addyPart
		}
	}
	['city','state'].forEach(function(addyKey){
		if (typeof addressObj[addyKey] == 'string' && (addyPart = addressObj[addyKey].trim())) {
			addyParts.push(addyPart)
		}
	})
	var singleLineAddress = addyParts.join(', ')
	if (typeof addressObj.postal_code == 'string' && (addyPart = addressObj.postal_code.trim())) {
		singleLineAddress += ' '+addyPart
		singleLineAddress = singleLineAddress.trim()
	}
	if (typeof addressObj.country == 'string' && (addyPart = addressObj.country.trim())) {
		singleLineAddress += singleLineAddress ? ', '+addyPart : addyPart
	}
	return singleLineAddress
}

var states
function looksLikeState(str){
	if (!states) {
		states = {}
		for (var k in stateMap) {
			if (stateMap.hasOwnProperty(k)){
				states[k.toLowerCase()] = true
				states[stateMap[k].toLowerCase()] = true
			}
		}
	}
	str = str.trim().toLowerCase()
	return !!states[str]
}

var countries
function looksLikeCountry(str){
	if (!countries) {
		countries = {}
		for (var k in countryMap) {
			if (countryMap.hasOwnProperty(k)){
				countries[k.toLowerCase()] = true
				countries[countryMap[k].toLowerCase()] = true
			}
		}
	}
	str = str.trim().toLowerCase()
	return !!countries[str]
}
