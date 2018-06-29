const yargs = require('yargs');
const axios=require('axios');

const argv = yargs
  .options({
    a: {
      demand: true,
      alias: 'address',
      describe: 'Address to fetch weather for',
      string: true
    }
  })
  .help()
  .alias('help', 'h')
  .argv;

var encodedAddress=encodeURIComponent(argv.address+argv._);
var geocodeUrl=`https://maps.googleapis.com/maps/api/geocode/json?address=${encodedAddress}`;

axios.get(geocodeUrl).then((response)=>{
	if (response.data.status==='ZERO_RESULTS')
	{
		throw new Error('Unable to find that address.');
	}
	var formattedAddress=response.data.results[0].formatted_address;
	var lat=response.data.results[0].geometry.location.lat;
	var lng=response.data.results[0].geometry.location.lng;
	var weatherUrl=`https://api.darksky.net/forecast/b642b1e980cdac60514bcfe58471eaa4/${lat},${lng}`;
	console.log(formattedAddress);
	return axios.get(weatherUrl);
}).then((response)=>{
	var temperature=response.data.currently.temperature;
	var appTemp=response.data.currently.apparentTemperature;
	var rainProbability=response.data.currently.precipProbability;
	var summary=response.data.currently.summary;
	console.log(`It's currently ${temperature}F but it feels like ${appTemp}F !`);
	console.log(`The precipitation probability is ${rainProbability}.`);
	console.log(`Sumamry:${summary}`);	
}).catch((e)=>{
	if (e.code==='ENOTFOUND')
	{
		console.log('Unable to connect to API servers.');
	}
	else
	{
		console.log(e.message);
	}
});
