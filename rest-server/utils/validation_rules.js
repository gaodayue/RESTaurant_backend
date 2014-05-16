exports.restaurants_rules = {
	'r_name': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Name'
		}
	],
	'r_addr': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Address'
		}
	],
	'r_longitude': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Longitude'
		},
		{
			'rule': 'number',
			'error': 'Restaurant longitude must be a number'
		},
		{
			'rule': 'between',
			'args': [-180, 180],
			'error': 'Longitude must be between -180 < x < 180'
		}
	],
	'r_latitude': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Latitude'
		},
		{
			'rule': 'number',
			'error': 'Restaurant latitude must be a number'
		},
		{
			'rule': 'between',
			'args': [-90, 90],
			'error': 'Latitude must be between -90 < x < 90'
		}
	],
	'r_mgr_name': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Manager Name'
		}
	],
	'r_mgr_pwd': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Manager Password'
		}
	]
};

exports.dishes_rules = {
	'r_id': [
		{
			'rule': 'required',
			'error': 'Missing Dish ID'
		},
		{
			'rule': 'int',
			'error': 'Dish ID has to be an integer'
		}
	],
	'name': [
		{
			'rule': 'required',
			'error': 'Missing Dish Name'
		}
	],
	'price': [
		{
			'rule': 'required',
			'error': 'Missing Dish Price'
		},
		{
			'rule': 'number',
			'error': 'Dist price must be a number'
		}
	]
};

exports.invitations_rules = {
	'restaurant_id': [
		{
			'rule': 'required',
			'error': 'Missing restaurant ID'
		},
		{
			'rule': 'int',
			'error': 'Restaurant ID has to be an integer'
		}
	],
	'request_date': [
		{
			'rule': 'required',
			'error': 'Missing Invitation Request Date'
		}
	],
	'start_time': [
		{
			'rule': 'required',
			'error': 'Missing Invitation Order Start Time'
		}
	],
	'end_time': [
		{
			'rule': 'required',
			'error': 'Missing Invitation Order End Time'
		}
	],
	'customer_ids': [
		{
			'rule': 'required',
			'error': 'Missing Customer IDs'
		}
	]
};

exports.invitation_dishes_rules = {
	'd_id': [
		{
			'rule': 'required',
			'error': 'Missing Dish ID'
		}
	],
	'name': [
		{
			'rule': 'required',
			'error': 'Missing Dish Name'
		}
	],
	'price': [
		{
			'rule': 'required',
			'error': 'Missing Dish Price'
		},
		{
			'rule': 'number',
			'error': 'Dish Price must be a number'
		}
	],
	'quantity': [
		{
			'rule': 'required',
			'error': 'Missing Dish Quantity'
		},
		{
			'rule': 'number',
			'error': 'Dish quantity must be a number'
		}
	]
};

exports.cust_account_signup_rules = {
	'phoneno': [
		{
			'rule': 'required',
			'error': 'Missing Phone No'
		},
		{
			'rule': 'number',
			'error': 'Phone number must be number'
		},
		{
			'rule': 'minLength',
			'args': [11],
			'error': 'Phone number must be 11 digit'
		},
		{
			'rule': 'maxLength',
			'args': [11],
			'error': 'Phone number must be 11 digit'
		}
	],
	'password': [
		{
			'rule': 'required',
			'error': 'Missing Password'
		},
		{
			'rule': 'minLength',
			'args': [4],
			'error': 'Password minimal length is 4 character'
		}
	],
	'name': [
		{
			'rule': 'required',
			'error': 'Missing Name'
		}
	]
};

exports.cust_account_signin_rules = {
	'phoneno': [
		{
			'rule': 'required',
			'error': 'Missing Phone No'
		},
		{
			'rule': 'number',
			'error': 'Phone number must be number'
		},
		{
			'rule': 'minLength',
			'args': [11],
			'error': 'Phone number must be 11 digit'
		},
		{
			'rule': 'maxLength',
			'args': [11],
			'error': 'Phone number must be 11 digit'
		}
	],
	'password': [
		{
			'rule': 'required',
			'error': 'Missing Password'
		},
		{
			'rule': 'minLength',
			'args': [4],
			'error': 'Password minimal length is 4 character'
		}
	]
};

exports.rest_account_signup_rules = {
	'name': [
		{
			'rule': 'required',
			'error': 'Missing Name'
		}
	],
	'password': [
		{
			'rule': 'required',
			'error': 'Missing Password'
		},
		{
			'rule': 'minLength',
			'args': [4],
			'error': 'Password minimal length is 4 character'
		}
	]
};

exports.rest_account_signin_rules = {
	'name': [
		{
			'rule': 'required',
			'error': 'Missing Name'
		}
	],
	'password': [
		{
			'rule': 'required',
			'error': 'Missing Password'
		}
	]
};