$(document).ready(function () {
  let searchParams = new URLSearchParams(window.location.search);
  let subSemId;
  // let units = [];
  if (searchParams.has('subSemId')) {
    subSemId = searchParams.get('subSemId');
  }

  $(document).on('click', '#addques', function () {
    window.location.href = "Addques.html?subSemId=" + subSemId
  })

  $(document).on('click', '#uploadques', function (event) {
    window.location.href = "Uploadques.html?subSemId=" + subSemId
  })

  $(document).on('click', '#chooseques', function (event) {
    window.location.href = "Chooseques.html?subSemId=" + subSemId
  })

});