Date.prototype.yyyymmdd = function() {         
  var yyyy = this.getFullYear().toString();                                    
  var mm = (this.getMonth()+1).toString(); // getMonth() is zero-based         
  var dd  = this.getDate().toString();             
  return yyyy + '-' + (mm[1]?mm:"0"+mm[0]) + '-' + (dd[1]?dd:"0"+dd[0]);
};

function describeTime(start_time, end_time) {
  var timeToString = function (time) {
    if (time <= 12) return time + 'am';
    else return time + 'pm';
  };
  return timeToString(start_time) + ' ~ ' + timeToString(end_time);
}

function showSuccess() {
  noty({
    layout: 'topCenter',
    type: 'success',
    text: 'success',
    timeout: 1000
  });
}

function showError() {
  noty({
    layout: 'topCenter',
    type: 'warning',
    text: 'something goes wrong',
    timeout: 1000
  });
}

function findOrderById(orders, orderId) {
  for (var i = 0; i < orders.length; i++) {
    if (orders[i].o_id == orderId)
      return orders[i];
  }
}

function showOrderModel(order) {
  var orderDate = new Date(order.request_date);

  $('#order-model-id').text('Order ' + order.o_id);
  $('#order-model-customer').text(order.customer.name);
  $('#order-model-phone').text(order.customer.phoneno);
  $('#order-model-date').text(orderDate.yyyymmdd());
  $('#order-model-time').text(describeTime(order.start_time, order.end_time));

  var ul_dishes = $('#order-model-dishes').empty().append('<li>Dishes</li>');
  // append dishes to ul
  $.each(order.dishes, function (index, dish) {
    $('<li>').text(dish.name + ' - ' + dish.quantity).appendTo(ul_dishes);
  });
  // append total price to ul
  $('<li>').html('Total: <span class="label label-info">$' + order.total_price + '</span>').appendTo(ul_dishes);

  if (order.status == 2) {
    // for order in booking status
    // TODO query the available tables
    $('#order-model').modal();
  
  } else if (order.status == 3) {
    // for order in booking_success status
    // add the close model button, and show the modal
    $('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
    $('#order-model').modal();
  }
}