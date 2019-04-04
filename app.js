const express = require('express');
const app = express();

//import Objects
var {Location} = require('./classes')
var {City} = require('./classes')
var {Filter} = require('./classes')
var {Restaurant} = require('./classes')
var {User} = require('./classes')
var {Request} = require('./classes')


let LA = new City("LA", new Location(34.0522, -118.2437), 
	{"Eggslut": new Restaurant("Eggslut", new Location(34.050690, -118.248787), 1, "American"),
	"MilkBar": new Restaurant("MilkBar", new Location(34.083220, -118.345740), 3, "Dessert"),
	"BobaGuys": new Restaurant("BobaGuys", new Location(34.063950, -118.265360), 1, "Drinks"),
	"BlazePizza": new Restaurant("BlazePizza", new Location(34.023090, -118.280020), 1, "Italian")})
let Berkeley = new City("Berkeley", new Location(37.8716, -122.2727), 
	{"Chengdu": new Restaurant("Chengdu", new Location(37.868770, -122.256560), 1, "Chinese"),
	"FamousBao": new Restaurant("FamousBao", new Location(37.867870, -122.259980), 1, "Chinese"),
	"ShareTea": new Restaurant("ShareTea", new  Location(37.866990, -122.272510), 2, "Drinks"),
	"Quickly's": new Restaurant("Quicklys", new Location(37.873740, -122.269770), 1, "Drinks"),
	"BongoBurger": new Restaurant("BongoBurger", new Location(37.865260, -122.258180), 1, "American"),
	"LaVals": new Restaurant("LaVals", new Location(37.875500, -122.260410), 2, "Mexican"),
	"LuckyThaiHouse": new Restaurant("LuckyThaiHouse", new Location(37.872120, -122.267290), 2, "Thai"),
	"GreatChina": new Restaurant("GreatChina", new Location(37.867550, -122.266243), 2, "Chinese")})
let Stanford = new City("Stanford", new Location(37.4419, -122.1430), 
	{"RamenNagi": new Restaurant("RamenNagi", new Location(37.445560, -122.160507), 1, "Japanese"),
	"PizzaMyHeart": new Restaurant("PizzaMyHeart", new Location(37.444850,-122.162270), 1, "Italian"),
	"SoGongDongTofuHouse": new Restaurant("SoGongDongTofyHouse", new Location(37.413681, -122.125351), 2, "Korean"),
	"Thaiphoon": new Restaurant("Thaiphoon", new Location(37.444250, -122.161910), 2, "Thai"),
	"Yayoi": new Restaurant("Yayoi", new Location(37.447380, -122.160530), 2, "Japanese")})
const cities = {
	"LA": LA,
	"Berkeley": Berkeley,
	"Stanford": Stanford
}

const displayRequest = function(request){
	var userObject = []
	for (var user of request.users) {
		userObject.push({
			"name": user.user_name,
			"contact_info": user.contact_info
		})
	}
	console.log(request.location)
	return {
		restaurant: request.restaurant,
		users: userObject,
		location: {
			lat: request.location.lat,
			lon: request.location.lon
		},
		time: request.time,
		request_id: request.request_id
	}
}
app.get('/', function(req, res){
	res.send("Hello World");
})

app.get('/displayall', function(req, res) {
	var city_name = req.query.city_name
	var city = cities[city_name]
	var reqs_display = []
	for (var request of city.requests) {
		reqs_display.push(displayRequest(request));
	}
	res.send(JSON.stringify(reqs_display))
})
//Display proximal requests
//Query params: city_name, price, time, cuisine
app.get('/display', function(req, res){
	var city_name = req.query.city_name
	var location = new Location(req.query.lon, req.query.lat)
	console.log(city_name)
	var filters = []
	if (req.query.price > 0){
		filters.push(new Filter("price", req.query.price))
	}
	if (req.query.time > 0) {
		filters.push(new Filter("time", req.query.time))
	}
	if (req.query.cuisine != "None") {
		filters.push(new Filter("cuisine", req.query.cuisine))
	}
	console.log(filters)
	var city = cities[city_name]
	console.log("City:" + city)
	console.log(city.requests)
	var requests = city.nearest(location)
	if (filters.length > 0) {
		requests = (city.filter_requests(filters))
	}
	console.log(requests)
	var reqs_display = []
	for (var request of requests) {
		reqs_display.push(displayRequest(request));
	}
	res.send(JSON.stringify(reqs_display))
})

//Create new request
//Params: restaurant_name; lat, lon; time; city_name; user_name, contact_info
app.get('/create', function(req, res){
	var restaurant_name = req.query.restaurant_name
	var location = {
		lat: req.query.lat,
		lon: req.query.lon
	}
	var time = req.query.time
	var city_name = req.query.city_name
	var city = cities[city_name]
	var user = new User(req.query.user_name, req.query.contact_info, location, city_name)
	var id = city.id_num
	var request = new Request(restaurant_name, user, location, city, time, city.id_num)
	city.add_request(request)
	res.send(displayRequest(request))
})
 
app.get('/delete', function(req, res) {
	var city_name = req.query.city_name
	var id = req.query.id_num
	var city = cities[city_name]
	console.log(city)
	city.remove_request(id)
	res.send("Removed")
})
//Join an existing group
//Params: request_id, city_name, user_name, contact_info
app.get('/join', function(req, res) {
	var request_id = req.query.request_id
	var city_name = req.query.city_name
	var city = cities[city_name]
	var selected_request = city.get_request_by_id(request_id)
	console.log(selected_request)
	selected_request.add_user(new User(req.query.user_name, req.query.contact_info, selected_request.location))
	res.send(displayRequest(selected_request))
})

app.get('/clear', function(req, res) {
	cities["LA"].requests = []
	cities["LA"].id_num = 0
	cities["Berkeley"].requests = []
	cities["Berkeley"].id_num = 0
	cities["Stanford"].requests = []
	cities["Stanford"].id_num = 0
	res.send("Cleared");
})

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log("Listening");
})
// const server = app.listen(8000, () => {
// 	const host = server.address().address;
// 	const port = server.address().port;
// })


