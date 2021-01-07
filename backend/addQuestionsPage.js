$(document).ready(function () {
  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }



  let searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('ca') == 0) {
    let tid = searchParams.get('tid');
    let subSemId = 0;
    let tname = ""
    let objective = false
    let description = ""
    let uid = 0;
    let question_count = 0
    //alert(tid)


    //toasts
    $('#errorToast,#successToast').on('show.bs.toast', function () {
      $('#toastDiv').show();
      setTimeout(function () {
        $('#errorToast').toast('hide');
        $('#successToast').toast('hide');
        $('#toastDiv').hide();
      }, 7000);
    });



    //getting the values from the getObjective tests api
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTests',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert(result.status);
        if (result.status == 200 && result.data) {
          //alert("works")
          //console.log(result.data)

          for (let i = 0; i < result.data.length; i++) {
            if (result.data[i].id == tid) {
              //alert(result.data[i].id)
              subSemId = result.data[i].subject_id
              tname = result.data[i].name
              objective = true
              description = result.data[i].description
              question_count = result.data[i].questions_count

              //return false;
            }
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
              $('#errorToastBody').text("Please Add Questions");
              $('#errorToast').toast('show');
            } else {
              window.location.href = "sendQuestionsPage.html?id=" + subSemId + "&tid=" + tid + "&tname=" + tname + "&uid=" + uid + "&desc=" + description + "&isObj=" + objective + "&qc=" + question_count;
            }
          })


        }
        else {
          $('#errorToastBody').text("Request Failed");
          $('#errorToast').toast('show');
        }
        //alert("Request Failed")
      },
      error: function (error) {
        $('#errorToastBody').text(error.message);
        $('#errorToast').toast('show');
        //alert("Request Failed with status: " + error.status);
      }
    });
  }
  else {

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
        $('#errorToastBody').text("Please Add Questions");
        $('#errorToast').toast('show');
        alert("Please Add Questions")
      } else {
        window.location.href = "sendQuestionsPage.html?id=" + subSemId + "&tid=" + tid + "&tname=" + tname + "&uid=" + uid + "&desc=" + description + "&isObj=" + objective + "&qc=" + question_count;
      }
    })
  }
});
