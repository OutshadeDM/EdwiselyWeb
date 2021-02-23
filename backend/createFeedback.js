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


  //toasts
  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 7000);
  });




  $('#createFeedbackBtn').on('click', function () {

    var title = $('#title-feedback').val()
    var desc = $('#desc-feedback').val()


    //to make the post request

    if (title && desc) {

      var form = new FormData();
      form.append("title", title);
      form.append("description", desc);
      for (var key of form.entries()) {
        alert(key[1]);
      }
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

          console.log(result);


          if (result.status == 200) {
            $('#successToastBody').text(result.message);
            $('#successToast').toast('show');
            setTimeout(() => {
              window.location.href = "feedbackQuestions.html?fname=" + title + "&feedback_id=" + result.survey_id + "&cf=1"
            }, 2000)
          }
          else {
            $('#errorToastBody').text(error.message);
            $('#errorToast').toast('show');
          }
        },
        error: function (error) {
          $('#errorToastBody').text(error.message);
          $('#errorToast').toast('show');
        }
      });




    }
    else {
      $('#errorToastBody').text("Fill all fields");
      $('#errorToast').toast('show');
    }

  })

})