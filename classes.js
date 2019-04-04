//Location class
class Location {
	constructor(lon, lat) {
		this.lon = lon;
		this.lat = lat;
	}

	//distance in miles
	distance(other) {
		const R = 3958.8; //radius of the earth
		const dlon = this.lon - other.lon; 
		const dlat = this.lat - other.lat;
		const a = Math.pow((Math.sin(dlat/2)), 2) + Math.cos(other.lat) * Math.cos(this.lat) * Math.pow((Math.sin(dlon/2)), 2); 
		const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)) 
		const d = R * c 

		return d;
	}
}
//City class
class City {
	constructor(name, location, restaurants) {
		this.name = name;
		this.location = location;
		this.restaurants = restaurants;
		this.requests = [];
		this.id_num = 0
	}

	add_request(request) {
		if (this.requests.length == 0) {
			this.requests.push(request);
		} else {
			for (var i = 0; i < this.requests.length; i++) {
				if (request.time < this.requests[i].time) {
					this.requests.splice(i, 0, request);
					this.id_num +=1
					return;
				}
			}
		}
	}

	remove_request(id) {
		for (var i = this.requests.length-1; i >=0; i--) {
			if (parseInt(id) === this.requests[i].request_id) {
				this.requests.splice(i, 1);
				return;
			}
		}
	}

	get_request_by_id(request_id) {
		var id = parseInt(request_id)
		for (var request of this.requests) {
			console.log(request.request_id)
			if (request.request_id === id) {
				return request;
			}
		}
		console.log("Hi")
		return null;
	}
	nearest(location) {
		var lst = [];

		for (var request of this.requests) {
			if (location.distance(request) < 2.5) {
				lst.push(rest);
			}
		}

		return lst;
	}

	filter_requests(list_of_filters) {
		var lst = []
		for (var r of this.requests) {
			lst.push(r)
		}
		for (var f of list_of_filters) {
			console.log("Got here")
			f.filter_list(lst);
		}
		
		return lst;
	}

	/*
		for sort from low to high price: pred = "price" standard = <
		high to low price: pred = "price" standard = >

		near to far time: pred = "time" standard = <
		far to near time: pred = "time" standard = >

		ex. standard(p1, p2) {
			return p1 < p2;
		}
	*/
	sort_price(standard) {
		lst = [];
		stan = restaurants[0];

		for (var i = 1; i < restaurants.length; i++) {
			if (standard(restaurants[i], stan)) {
				lst.unshift(restaurants[i]);
			}
		}

		return lst;
	}
}

//filter class
class Filter {
	constructor(filter_type, standard) {
		this.filter_type = filter_type,
		this.standard = standard
		
	};

	filter_list(lst) {
		if (this.filter_type === "price") {
			for (var i = lst.length-1; i >= 0; i--) {
				var request = lst[i]
				console.log(request)
				if (request.city.restaurants[request.restaurant].price > parseInt(this.standard)) {
					lst.splice(i, 1);
				}
			}
		}
		else if (this.filter_type === "cuisine") {
			for (var i =lst.length-1; i>=0; i--) {
				var request = lst[i]
				if (!(request.city.restaurants[request.restaurant].cuisine === this.standard)) {
					lst.splice(i, 1);
				}
			}
		}
		else if (this.filter_type === "time") {
			for (var i =lst.length-1; i>=0; i--) {
				var request = lst[i]
				if (parseInt(request.time) > parseInt(this.standard)) {
					lst.splice(i, 1);
				}
			}
		}
	}

	/*filter(list) {
		if (filter_type === "price") {
			for (var i =0; i < list.length; i++) {
				if (list[i].price() > standard) {
					list.remove(i, 1);
				}
			}
		}
		else if (filter_type === "cuisine") {
			for (var i =0; i < list.length; i++) {
				if (!(list[i].cuisine() == standard)) {
					list.remove(i, 1);
				}
			}
		}
		else if (filter_type === "time") {
			for (var i =0; i < list.length; i++) {
				if (list[i].time() > standard) {
					list.remove(i, 1);
				}
			}
		}
	}*/
}

//Restaurant class
class Restaurant {
	constructor(name, location, price, cuisine) {
		this.name = name;
		this.location = location;
		this.price = price;
		this.cuisine = cuisine;
	}
}

//User profile class
class User {
	constructor(name, contact_info, location, city) {
		this.user_name = name;
		this.contact_info = contact_info;
		this.location = location;
		this.city = city;
	}

	equals(other) {
		if (this.user_name === other.user_name && this.contact_info === other.contact_info && this.location === other.location && this.city === other.city) {
			return true;
		} else {
			return false;
		}
	}
}

//Request class
class Request {
	constructor(restaurant_name, user, location, city, time, id) {
		this.restaurant = restaurant_name;
		this.users = [user];
		this.location = location;
		this.city = city;
		this.time = time;
		this.request_id = id;
		this.size = 1;
	}

	equals(other) {
		if (this.restaurant === other.restaurant && this.location === other.location && this.time === other.time) {
			return true;
		} else {
			return false;
		}
	}

	add_user(user) {
		for (var i = 0; i < this.users.length; i++) {
			try {
				if (user.equals(this.users[i])) {
					throw "User is already on the list";
				}
			} 
			catch(e) {
				console.log("User is already on the list");
			}
		}
		this.users.push(user);
		this.size += 1;
	}

	remove_user(user) {
		try {
			if (this.users.length == 0) {
				throw "No user to remove";
			}
		}
		catch(e) {
			console.log("No user to remove");
		}
		
		for (var i = this.users.length-1; i >= 0; i--) {
			if (user.equals(this.users[i])) {
				this.users.remove(i, 1);
			}
		}
		this.size -= 1;
	}
}

module.exports = {
	Location: Location,
	City: City,
	Filter: Filter,
	Restaurant: Restaurant,
	User: User,
	Request: Request
}