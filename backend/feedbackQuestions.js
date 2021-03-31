$(document).ready(function () {
  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    $("#greetingNav").html($user.name);
  } else {
    window.location.replace("login.html");
  }

  $('.continueBtn').hide()


  let searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('cf') == 1) {
    const feedback_name = searchParams.get('fname');
    const feedback_id = searchParams.get('id');
    $('#feedbackName').text(feedback_name);


    $(document).on('click', '#addques', function () {
      window.location.href = "addFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=0";
    })


    $(document).on('click', '#chooseques', function () {
      let category = null;
      let template = null;

      $('#feedbackCategory').on('change', function () {
        category = this.value;
        $('#feedbackTemplate').find('option').remove()
        $('#feedbackTemplate').append('<option value="none" selected disabled hidden>Template</option>')

        //getting templates based on the category
        if (category != null) {
          var form = new FormData();
          form.append("category_id", category);
          $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyTemplate',
            type: 'POST',
            dataType: 'json',
            data: form,
            contentType: false,
            processData: false,
            headers: {
              'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
              // console.log(result.message);

              if (result.status == 200 && result.templates) {

                $.each(result.templates, function (key, value) {
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
        $('#feedbackTemplate').find('option').remove()
        $('#feedbackTemplate').append('<option value="none" selected disabled hidden>Template</option>')


        //getting templates based on the category
        if (category != null) {
          var form = new FormData();
          form.append("category_id", category);
          $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyTemplate',
            type: 'POST',
            dataType: 'json',
            data: form,
            contentType: false,
            processData: false,
            headers: {
              'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {

              if (result.status == 200 && result.templates) {

                $.each(result.templates, function (key, value) {
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
        new Notify({
          title: 'Error',
          text: "Please Add Questions",
          autoclose: true,
          status: 'error',
          autotimeout: 3000
        });
      } else {
        window.location.href = "sendFeedback.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=" + question_count;
      }
    })
  }
});
