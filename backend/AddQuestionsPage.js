$(document).ready(function () {

  $(document).on('click', '#addques', function (event) {
    alert('add question')
    event.preventDefault();
    var url = $(this).data('target');
    location.replace(url);
  })

  $(document).on('click', '#uploadques', function (event) {
    alert('upload question')
  })

  $(document).on('click', '#chooseques', function (event) {
    alert('choose question')
  })

});