$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }


  //let searchParams = new URLSearchParams(window.location.search);



  $('#createFeedbackBtn').on('click', function () {

    var title = $('#title-feedback').val()
    var desc = $('#desc-feedback').val()


    //to make the post request

    if (title && desc) {

      var form = new FormData();
      form.append("title", title);
      form.append("description", desc);
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }
      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/survey/createSurvey',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          if (result.status == 200) {
            new Notify ({
                title: 'Success',
                text : result.message,
                autoclose: true,
                status: 'success',
                autotimeout: 3000
            });
            setTimeout(() => {
              window.location.href = "feedbackQuestions.html?fname=" + title + "&id=" + result.survey_id + "&cf=1"
            }, 2000)
          }
          else {
            new Notify ({
                title: 'Error',
                text : result.message,
                autoclose: true,
                status: 'error',
                autotimeout: 3000
            });
          }
        },
        error: function (error) {
          new Notify ({
              title: 'Error',
              text : error.message,
              autoclose: true,
              status: 'error',
              autotimeout: 3000
          });
        }
      });




    }
    else {
      new Notify ({
          title: 'Error',
          text : "Fill all fields",
          autoclose: true,
          status: 'error',
          autotimeout: 3000
      });
    }

  })

})