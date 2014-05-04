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