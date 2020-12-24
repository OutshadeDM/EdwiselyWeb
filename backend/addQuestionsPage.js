$(document).ready(function () {
  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = 0;
  let tid = 0;
  let tname = ""
  let objective = false
  let description = ""
  let uid = 0;
  let question_count = 0

  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tid = searchParams.get('tid');
    question_count = searchParams.get('qc');
    description = searchParams.get('desc')
    objective = searchParams.get('isObj')
  }

  if (searchParams.has('tname')) {
    tname = searchParams.get('tname');
    if (tname)
      $('#courseName').text(tname);
  }

  //setting the name of test


  if (searchParams.has('uid')) {
    uid = searchParams.get('uid');
  }
  $(document).on('click', '#addques', function () {
    window.location.href = "addQues.html?id=" + subSemId + "&tid=" + tid + "&tname=" + tname + "&uid=" + uid + "&desc=" + description + "&isObj=" + objective + "&qc=" + question_count;
  })

  $(document).on('click', '#uploadques', function () {
    window.location.href = "uploadQues.html?id=" + subSemId + "&tid=" + tid + "&tname=" + tname + "&uid=" + uid + "&desc=" + description + "&isObj=" + objective + "&qc=" + question_count;
  })

  $(document).on('click', '#chooseques', function () {
    window.location.href = "chooseQues.html?id=" + subSemId + "&tid=" + tid + "&tname=" + tname + "&uid=" + uid + "&desc=" + description + "&isObj=" + objective + "&qc=" + question_count;
  })

  $(document).on('click', '#sendAssBtn', function () {
    if (question_count == 0) {
      alert("Please Add Questions")
    } else {
      window.location.href = "sendQuestionsPage.html?id=" + subSemId + "&tid=" + tid + "&tname=" + tname + "&uid=" + uid + "&desc=" + description + "&isObj=" + objective + "&qc=" + question_count;
    }
  })

});
