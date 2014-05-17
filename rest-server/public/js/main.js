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

function searchAvailableTables(order, successCallback) {
  $('#order-model-table').html('<span class="label label-warning">loading</span>');
  var param = {
    'request_date': new Date(order.request_date).yyyymmdd(),
    'start_time': order.start_time,
    'end_time': order.end_time,
    'num_people': order.num_people
  };
  $.get('/api/tables/available', param)
    .done(function (availTables) {
      successCallback(availTables);
    })
    .fail(function () {
      $('#order-model-table').html('<span class="label label-danger">failed</span>');
    });
}

function acceptOrderHandler(event) {
  event.preventDefault();

  var btn = $(this);
  btn.button('loading');

  var orderId = $('#order-model').attr('data-oid');
  var choosedTable = $('#table-selector').val();
  
  $.post('/api/orders/accept/' + orderId, { 'table_number': choosedTable })
    .done(function () {
      showSuccess();
      $('#pending-orders td[data-oid=' + orderId + ']').text('accepted');
    })
    .fail(showError)
    .always(function () {
      $('#order-model').modal('hide');
    });
}

function denyOrderHandler(event) {
  event.preventDefault();
  
  var btn = $(this);
  btn.button('loading');

  var orderId = $('#order-model').attr('data-oid');
  $.post('/api/orders/deny/' + orderId)
    .done(function () {
      showSuccess();
      $('#pending-orders td[data-oid=' + orderId + ']').text('denied');
    })
    .fail(showError)
    .always(function () {
      $('#order-model').modal('hide');
    });
}

function showOrderModel(order) {
  var orderDate = new Date(order.request_date);
  $('#order-model').attr('data-oid', order.o_id);
  $('#order-model-id').text('Order ' + order.o_id);
  $('#order-model-customer').text(order.customer.name);
  $('#order-model-phone').text(order.customer.phoneno);
  $('#order-model-date').text(orderDate.yyyymmdd());
  $('#order-model-time').text(describeTime(order.start_time, order.end_time));
  $('.modal-footer').empty();

  var ul_dishes = $('#order-model-dishes').empty().append('<li>Dishes</li>');
  // append dishes to ul
  $.each(order.dishes, function (index, dish) {
    $('<li>').text(dish.name + ' - ' + dish.quantity).appendTo(ul_dishes);
  });
  // append total price to ul
  $('<li>').html('Total: <span class="label label-info">$' + order.total_price + '</span>').appendTo(ul_dishes);

  // for order in booking_success status, just add the close model button
  if (order.status == 3) {
    $('.modal-footer').html('<button type="button" class="btn btn-default" data-dismiss="modal">Close</button>');
    $('#order-model').modal('show');
    return;
  }

  // for order in booking status
  if (order.status == 2) {
    // 1. query the available tables
    searchAvailableTables(order, function (availTables) {
      if (availTables.length == 0) {
        $('#order-model-table').html('<span class="label label-info">no available tables</span>');
      
      } else {  // add available tables to <select>
        var tableSelect = $('<select id="table-selector">');
        $.each(availTables, function (index, availTable) {
          var option = null;
          if (index == 0)
            option = $('<option>', {value: availTable.table_number, text: availTable.table_number, selected: true});
          else
            option = $('<option>', {value: availTable.table_number, text: availTable.table_number});
          option.appendTo(tableSelect);
        });
        $('#order-model-table').empty().append(tableSelect);
      }

      // 2. add accept (if there are available tables) and deny button
      $('<button type="button" class="btn btn-warning" data-loading-text="Waiting...">Deny</button>')
        .click(denyOrderHandler)
        .prependTo($('.modal-footer'));

      if (availTables.length > 0) {
        $('<button type="button" class="btn btn-success" data-loading-text="Waiting...">Accept</button>')
          .click(acceptOrderHandler)
          .prependTo($('.modal-footer'));
      }
    });
    
    $('#order-model').modal('show');
  }
  
}