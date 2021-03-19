$(document).ready(function () {
  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  $('.continueBtn').hide()

  //toasts
  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 5000);
  });


  let searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('cf') == 1) {
    const feedback_name = searchParams.get('fname');
    const feedback_id = searchParams.get('id');


    $(document).on('click', '#addques', function () {
      window.location.href = "addFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=0";
    })


    $(document).on('click', '#chooseques', function () {
      let category = null;
      let template = null;

      $('#feedbackCategory').on('change', function () {
        category = this.value;

        //getting templates based on the category
        if (category != null) {
          $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/survey/getFeedbackTemplates?survey_category_id=' + category,
            type: 'GET',
            contentType: 'application/json',
            headers: {
              'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
              // console.log(result.message);

              if (result.status == 200 && result.data) {

                $.each(result.data, function (key, value) {
                  console.log(value)
                  $('#feedbackTemplate').append('<option value=' + value.id + '>' + value.name + '</option>');

                });

              }
            },
            error: function (error) {
              alert("Request Failed with status: " + error.status);
            }
          });
        }

      });

      $('#feedbackTemplate').on('change', function () {
        template = this.value;
        // console.log(template)
        //$('#modalBody').append("<div class='text-center pt-5'><button class='btn btn-primary continueBtn'>Continue</button><div>")
        $('.continueBtn').show()
      })

      $(document).on('click', '.continueBtn', function () {
        window.location.href = "chooseFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=0&category=" + category + "&template=" + template;
      })


    })

  }


  //coming on the page not from the created feedback window
  else {

    let feedback_name = ""
    let feedback_id = 0
    let question_count = 0

    if (searchParams.has('id')) {
      feedback_name = searchParams.get('fname');
      feedback_id = searchParams.get('id');
      question_count = searchParams.get('qc');
      $('#feedbackName').text(feedback_name);
    }

    $(document).on('click', '#addques', function () {
      window.location.href = "addFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=" + question_count;
    })


    $(document).on('click', '#chooseques', function () {
      let category = null;
      let template = null;

      $('#feedbackCategory').on('change', function () {
        category = this.value;

        //getting templates based on the category
        if (category != null) {
          $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/survey/getFeedbackTemplates?survey_category_id=' + category,
            type: 'GET',
            contentType: 'application/json',
            headers: {
              'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
              // console.log(result.message);

              if (result.status == 200 && result.data) {

                $.each(result.data, function (key, value) {
                  //console.log(value)
                  $('#feedbackTemplate').append('<option value=' + value.id + '>' + value.name + '</option>');

                });

              }
            },
            error: function (error) {
              alert("Request Failed with status: " + error.status);
            }
          });
        }

      });

      $('#feedbackTemplate').on('change', function () {
        template = this.value;
        // console.log(template)
        //$('#modalBody').append("<div class='text-center pt-5'><button class='btn btn-primary continueBtn'>Continue</button><div>")
        $('.continueBtn').show()
      })

      $(document).on('click', '.continueBtn', function () {
        window.location.href = "chooseFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=0&category=" + category + "&template=" + template;
      })


    })

    $(document).on('click', '#sendFeedbackBtn', function () {
      if (question_count == 0) {
        $('#errorToastBody').text("Please Add Questions");
        $('#errorToast').toast('show');
      } else {
        window.location.href = "sendFeedback.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=" + question_count;
      }
    })
  }
});
