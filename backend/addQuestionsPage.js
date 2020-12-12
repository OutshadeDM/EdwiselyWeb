$(document).ready(function () {
  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = 0;
  let tid = 0;
  let uid= 0;
  
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tid = searchParams.get('tid');
  }
  if (searchParams.has('uid')) {
    uid = searchParams.get('uid');
  }
  $(document).on('click', '#addques', function () {
    window.location.href = "addQues.html?id=" + subSemId + "&tid=" + tid + "&uid=" + uid;
  })

  $(document).on('click', '#uploadques', function () {
    window.location.href = "uploadQues.html?id=" + subSemId + "&tid=" + tid + "&uid=" + uid;
  })

  $(document).on('click', '#chooseques', function () {
    window.location.href = "chooseQues.html?id=" + subSemId + "&tid=" + tid + "&uid=" + uid;
  })

});
