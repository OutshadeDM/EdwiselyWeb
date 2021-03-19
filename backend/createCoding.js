$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  //toasts
  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 7000);
  });

  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${$user.token}`
    },
    success: function (result) {
      // alert(result.status);
      $('#selectSub').empty();
      if (result.status == 200 && result.data) {
        $('#selectSub').append("<option value='0' selected disabled>Choose Subject</option>");
        $.each(result.data, function (key, value) {
          $('#selectSub').append("<option value='" + value.id + "'>" + value.name + "</option>");
        });
      }
    },
    error: function (error) {
      alert("Request Failed with status: " + error.status);
    }
  });

  $('#createFeedbackBtn').on('click', function () {

    const name = $('#name').val()
    const desc = $($("#summernote").summernote("code")).text()
    const subject = $('#selectSub').val()

    if (name && desc && subject && subject != "0") {

      const form = new FormData();
      form.append("name", name);
      form.append("description", desc);
      form.append("subject_id", subject);
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }
      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/createCodingTest',
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
              window.location.href = "codingQuestions.html?fname=" + name + "&id=" + result.test_id + "&qc=0";
            }, 1500)
          }
          else {
            $('#errorToastBody').text(result.message);
            $('#errorToast').toast('show');
          }
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      $('#errorToastBody').text("Fill all fields");
      $('#errorToast').toast('show');
    }

  })

})