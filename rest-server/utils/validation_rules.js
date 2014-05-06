exports.restaurants_rules = {
	'r_name': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Name'
		},
		{
    	'rule': 'alphaNumeric',
    	'error': 'Must be names and numbers'
  	}
	],
	'r_addr': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Address'
		},
		{
    	'rule': 'alphaNumeric',
    	'error': 'Must be names and numbers'
  	}
	],
	'r_longitude': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Longitude'
		},
		{
			'rule': 'decimal',
			'error': 'Must be a number'
		},
		{
			'rule': 'between',
			'error': 'must be between -180 < x < 180'
		}
	],
	'r_latitude': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Latitude'
		},
		{
			'rule': 'decimal',
			'error': 'Must be a number'
		},
		{
			'rule': 'between',
			'error': 'must be between -90 < x < 90'
		}
	],
	'r_pic': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Picture'
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
			'error': 'Missing Restaurant ID'
		},
		{
			'rule': 'int',
			'error' 'ID has to be an integer'
		}
	],
	'name': [
		{
			'rule': 'required',
			'error': 'Missing Dish Name'
		},
		{
			'rule': 'alphaNumeric',
			'error': 'Must be names and/or number'
		}
	],
	'price': [
		{
			'rule': 'required',
			'error': 'Missing Dish Price'
		},
		{
			'rule': 'decimal',
			'error': 'Must be a number'
		}
	]
};

exports.invitations_rules = {
	'restaurant_id': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant ID'
		},
		{
			'rule': 'int',
			'error' 'ID has to be an integer'
		}
	],
	'request_date': [
		{
			'rule': 'required',
			'error': 'Missing Invitation Request Date'
		}
	],
	'request_period': [
		{
			'rule': 'required',
			'error': 'Missing Invitation Request Period'
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
		},
		{
			'rule': 'alphaNumeric',
			'error': 'Must be a name and/or number'
		}
	],
	'price': [
		{
			'rule': 'required',
			'error': 'Missing Dish Price'
		},
		{
			'rule': 'decimal',
			'error': 'Must be a number'
		}
	],
	'quantity': [
		{
			'rule': 'required',
			'error': 'Missing Dish Quantity'
		},
		{
			'rule': 'decimal',
			'error': 'Must be a number'
		}
	]
};

exports.accounts_rules = {
	'phoneno': [
		{
			'rule': 'required',
			'error': 'Missing Phone No'
		}
	],
	'password': [
		{
			'rule': 'required',
			'error': 'Missing Password'
		}
	]
};