$(document).ready(function () {
  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = 0;
  let tid = 0;
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tid = searchParams.get('tid');
  }
  $(document).on('click', '#addques', function () {
    window.location.href = "addQues.html?id=" + subSemId + "&tid=" + tid;
  })

  $(document).on('click', '#uploadques', function (event) {
    window.location.href = "uploadQues.html?id=" + subSemId + "&tid=" + tid;
  })

  $(document).on('click', '#chooseques', function (event) {
    window.location.href = "chooseQues.html?id=" + subSemId + "&tid=" + tid;
  })

});
