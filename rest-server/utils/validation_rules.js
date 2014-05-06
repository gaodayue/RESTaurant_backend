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
		}
	],
	'r_latitude': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant Latitude'
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
		}
	]
};

exports.invitations_rules = {
	'restaurant_id': [
		{
			'rule': 'required',
			'error': 'Missing Restaurant ID'
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
		}
	],
	'price': [
		{
			'rule': 'required',
			'error': 'Missing Dish Price'
		}
	],
	'quantity': [
		{
			'rule': 'required',
			'error': 'Missing Dish Quantity'
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