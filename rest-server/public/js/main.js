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