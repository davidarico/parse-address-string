var test = require('tape')
, app = require('../')

test('explodeAddress',function(t){
	var tests = [
		{
			desc: 'basic worky'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007'
			,expected: {
				street_address1: '1842 W Washington Blvd'
				,city: 'Los Angeles'
				,postal_code: '90007'
				,state: 'CA'
				,country: null
			}
		}
		,{
			desc: 'street address looks like a zip code'
			,input: '90007 W Washington Blvd, Santa Monica, California 90007'
			,expected: {
				street_address1: '90007 W Washington Blvd'
				,city: 'Santa Monica'
				,postal_code: '90007'
				,state: 'CA'
				,country: null
			}
		}
		,{
			desc: 'street address is just words'
			,input: 'Trousdale Parkway, Los Angeles, California'
			,expected: {
				street_address1: 'Trousdale Parkway'
				,city: 'Los Angeles'
				,postal_code: null
				,state: 'CA'
				,country: null
			}
		}
		,{
			desc: 'state and city have the same name'
			,input: '1201 Broadway, New York, New York 10001'
			,expected: {
				street_address1: '1201 Broadway'
				,city: 'New York'
				,postal_code: '10001'
				,state: 'NY'
				,country: null
			}
		}
		,{
			desc: 'state with two names spelled out'
			,input: '306 Deep Creek Rd, Fayetteville, North Carolina 28312'
			,expected: {
				street_address1: '306 Deep Creek Rd'
				,city: 'Fayetteville'
				,postal_code: '28312'
				,state: 'NC'
				,country: null
			}
		}
		,{
			desc: 'country is appended with comma'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007, US'
			,expected: {
				street_address1: '1842 W Washington Blvd'
				,city: 'Los Angeles'
				,postal_code: '90007'
				,state: 'CA'
				,country: 'US'
			}
		}
		,{
			desc: 'country is appended without comma'
			,input: '1842 W Washington Blvd, Los Angeles, CA 90007 USA'
			,expected: {
				street_address1: '1842 W Washington Blvd'
				,city: 'Los Angeles'
				,postal_code: '90007'
				,state: 'CA'
				,country: 'US'
			}
		}
		,{
			desc: 'canada'
			,input: '646 Union Ave E, Winnipeg, MB R2L 1A4, CA'
			,expected: {
				street_address1: '646 Union Ave E'
				,city: 'Winnipeg'
				,postal_code: 'R2L 1A4'
				,state: 'MB'
				,country: 'CA'
			}
		}
		,{
			desc: 'canada - no country indicator'
			,input: '229 Begin St W, Thunder Bay, ON P7E 5M5'
			,expected: {
				street_address1: '229 Begin St W'
				,city: 'Thunder Bay'
				,postal_code: 'P7E 5M5'
				,state: 'ON'
				,country: null
			}
		}
		,{
			desc: 'street address + city + state only (no postal code)'
			,input: '3300-3332 Glen Koester Ln, Idaho Falls, ID'
			,expected: {
				street_address1: '3300-3332 Glen Koester Ln'
				,city: 'Idaho Falls'
				,postal_code: null
				,state: 'ID'
				,country: null
			}
		}
		,{
			desc: 'street address + city only'
			,input: '757 Juntura-Riverside Rd, Riverside'
			,expected: {
				street_address1: '757 Juntura-Riverside Rd'
				,city: 'Riverside'
				,postal_code: null
				,state: null
				,country: null
			}
		}
		,{
			desc: 'street address + postal code only'
			,input: '1813 Linda Vista Cir, 92831'
			,expected: {
				street_address1: '1813 Linda Vista Cir'
				,city: null
				,postal_code: '92831'
				,state: null
				,country: null
			}
		}
		,{
			desc: 'street address only'
			,input: '145 Parkway Ave'
			,expected: {
				street_address1: '145 Parkway Ave'
				,city:  null
				,postal_code: null
				,state: null
				,country: null
			}
		}
		,{
			desc: 'city only'
			,input: 'Los Angeles'
			,expected: {
				street_address1: null
				,city:  'Los Angeles'
				,postal_code: null
				,state: null
				,country: null
			}
		}
		,{
			desc: 'state only'
			,input: 'NJ'
			,expected: {
				street_address1: null
				,city:  null
				,postal_code: null
				,state: 'NJ'
				,country: null
			}
		}
		,{
			desc: 'postal code only'
			,input: '13820'
			,expected: {
				street_address1: null
				,city:  null
				,postal_code: '13820'
				,state: null
				,country: null
			}
		}
		,{
			desc: 'country only'
			,input: 'United States'
			,expected: {
				street_address1: null
				,city:  null
				,postal_code: null
				,state: null
				,country: 'US'
			}
		}
		,{
			desc: 'empty'
			,input: '  '
			,expected: {
				street_address1: null
				,city:  null
				,postal_code: null
				,state: null
				,country: null
			}
		}
		,{
			desc: 'invalid input'
			,input: {}
			,expected: {
				street_address1: null
				,city:  null
				,postal_code: null
				,state: null
				,country: null
			}
		},
		{
			desc: 'city, state country'
			,input: 'Columbus, TX US'
			,expected: {
				street_address1: null,
				city: 'Columbus',
				postal_code: null,
				state: 'TX',
				country: 'US'
			}
		}
	]

	t.plan(tests.length)

	tests.forEach(function(test){
		const addressObj = app.normalize(app(test.input))
		if (JSON.stringify(addressObj) != JSON.stringify(test.expected)) console.log(test.desc,'addressObj != test.expected',addressObj,'!=',JSON.stringify(test.expected))
		t.ok(JSON.stringify(addressObj) == JSON.stringify(test.expected), test.desc)
	})
})

test('implodeAddress',function(t){
	var tests = [
		{
			desc: 'basic worky'
			,input: {
				street_address1: '1842 W Washington Blvd'
				,street_address2: ''
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: null
			}
			,expected: '1842 W Washington Blvd, Los Angeles, CA 90007'
		}
		,{
			desc: 'has country'
			,input: {
				street_address1: '1842 W Washington Blvd'
				,street_address2: ''
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: 'US'
			}
			,expected: '1842 W Washington Blvd, Los Angeles, CA 90007, US'
		}
		,{
			desc: 'has street_address2'
			,input: {
				street_address1: '1842 W Washington Blvd'
				,street_address2: 'Ste 300'
				,city: 'Los Angeles'
				,state: 'CA'
				,postal_code: '90007'
				,country: null
			}
			,expected: '1842 W Washington Blvd Ste 300, Los Angeles, CA 90007'
		}
		,{
			desc: 'invalid input'
			,input: null
			,expected: ''
		}
	]

	t.plan(tests.length)

	tests.forEach(function(test){
		const addressStr = app.implodeAddress(test.input)
		t.ok(addressStr == test.expected, test.desc)
	})
})
