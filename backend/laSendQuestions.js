$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  let questionsList = [];
  let questions = [];

  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = "0";
  let tname = "";
  let sId = "0";
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
  }

  //preparing for post api of questions

  // let question = ''
  // let field_type = 1
  // //
  // let topics = []
  // let options = []
  // //
  // let option1 = ''
  // let option2 = ''
  // let option3 = ''
  // let option4 = ''
  // let option5 = ''
  // //
  // let question_img = ""
  // let option1_img = ""
  // let option2_img = ""
  // let option3_img = ""
  // let option4_img = ""
  // let option5_img = ""
  // let question_img_url = ""
  // let option1_img_url = ""
  // let option2_img_url = ""
  // let option3_img_url = ""
  // let option4_img_url = ""
  // let option5_img_url = ""
  // let answer = '';
  let graphType = 1;


  //initially hiding the hint and solution divs
  $('#fifth').hide();

  //initially hide the uploaded fonticons and image
  $('.imgPreviewques').hide();
  $('#option1Label').hide();
  $('#option2Label').hide();
  $('#option3Label').hide();
  $('#option4Label').hide();
  $('#option5Label').hide();
  $('#image_preview_option1').hide();
  $('#image_preview_option2').hide();
  $('#image_preview_option3').hide();
  $('#image_preview_option4').hide();
  $('#image_preview_option5').hide();

  // radios for selecting
  $('.tick').hide();

  refreshQuestions();

  function refreshQuestions() {
    if (tId != "0") {
      questions = [];

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestQuestions?test_id=' + tId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {

          if (result.status == 200 && result.data) {
            $('.initData').remove();

            $.each(result.data, function (key, value) {
              questionsList.push(value.id);
              questions.push(value);
            });

            loadList();
          }
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });
    }

  }


  function loadList() {
    $("#addquesDiv").empty();
    let i = 1;

    $.each(questions, function (key, value) {
      // $('#addquesDiv').append(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' id='p` + value.id + `' data-id='` + value.id + `'>` + value.name.replace('<pre>', '') + `</p></div>`);
      $('#addquesDiv').append("<div class='row m-0'>" +
      "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q"+ i++ +").</div>" +
      "<div class='col-10 chosenQuestions py-2 pr-2 questions' id='p" + value.id + "' data-id='" + value.id + "' style='cursor:pointer;'>" + value.name.replace('<pre>', '') + "</div>");
    });
    MathJax.typesetPromise();
  }

  //images
  // $('#quesImage').on('change', function () {
  //   if (readURL(this, "ques")) {
  //     $('.uploadedques').show();
  //     $('.imgPreviewques').show();
  //     $('.notUploadedques').hide();
  //     $('#quesLabel').hide();
  //     question_img = $("#quesImage")[0].files[0];
  //   }
  // });

  // $('#opt5Image').on('change', function () {
  //   if (readURL(this, "5")) {
  //     option5_img = $('#opt5Image')[0].files[0]
  //     $('#uploadedoption5').show()
  //     $('#notUploadedoption5').hide()
  //     $('#option5ImagePreview').show()
  //   }
  // });


  function readURL(input, val) {
    const ext = $(input).val().split('.').pop().toLowerCase();

    if (input.files && input.files[0] && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) != -1) {
      var reader = new FileReader();

      reader.onload = function (e) {
        switch (val) {
          case 1:
            $('#image_preview_option1').attr('src', e.target.result);
            break;
          case 2:
            $('#image_preview_option2').attr('src', e.target.result);
            break;
          case 3:
            $('#image_preview_option3').attr('src', e.target.result);
            break;
          case 4:
            $('#image_preview_option4').attr('src', e.target.result);
            break;
          case 5:
            $('#image_preview_option5').attr('src', e.target.result);
            break;
          case 6:
            $('#image_preview_ques').attr('src', e.target.result);
            break;
          default:
            $('#image_preview_ques').attr('src', e.target.result);
            break;
        }
      }
      reader.readAsDataURL(input.files[0]);
      return true;
    }
    else {
      new Notify ({
          title: 'Error',
          text : 'Invalid Image Type',
          autoclose: true,
          status: 'error',
          autotimeout: 3000
      });
      return false;
    }
  }

  function clearAll() {
    // question = ''
    // options = []
    // option1 = ''
    // option2 = ''
    // option3 = ''
    // option4 = ''
    // option5 = ''
    // question_img = ""
    // option1_img = ""
    // option2_img = ""
    // option3_img = ""
    // option4_img = ""
    // option5_img = ""
    // question_img_url = ""
    // option1_img_url = ""
    // option2_img_url = ""
    // option3_img_url = ""
    // option4_img_url = ""
    // option5_img_url = ""

    $('#quesInput').val("");
    $('#selectBloomLevel').val("1");
    $('#selectLevel').val("1");
    $('#firstOption').val("");
    $('#secondOption').val("");
    $('#thirdOption').val("");
    $('#fourthOption').val("");
    $('#fifthOption').val("");

    $('#fifth').hide();
    
    $('#option1Label').show();
    $('#option2Label').show();
    $('#option3Label').show();
    $('#option4Label').show();
    $('#option5Label').show();

  }


  //clicking questions
  $(document).on('click', '.questions', function () {

    if ($(this).data('id') != $('#questionId').val()) {
      clearAll();
      let questionId = $(this).data('id');

      $('#questionId').val(questionId);

      $.each(questions, function (key, value) {
        if (questionId == value.id) {
          autoFill(value);
          return false;
        }
      });
    }

  });

  function autoFill(value = []) {
    // console.log(JSON.stringify(value));

    $('#quesInput').val(value.name);

    $('#firstOption').val(value.questions_options[0].name);
    $('#secondOption').val(value.questions_options[1].name);

    if (value.questions_options[2]) {
      $('#thirdOption').val(value.questions_options[2].name);
    }
    if (value.questions_options[3]) {
      $('#fourthOption').val(value.questions_options[3].name);
    }
    if (value.questions_options[4]) {
      $("#fifthOptionBtn").click();
      $('#fifthOption').val(value.questions_options[4].name);
    }

    if (value.question_img && value.question_img != null && value.question_img != " ") {
      $('#quesLabel').hide()
      $('#image_preview_ques').attr('src', value.question_img);
    }

    if (value.questions_options[0].option_img) {
      $('#option1ImagePreview').show();
      $('#image_preview_option1').attr('src', option1_img_url);
    }

    if (value.questions_options[1].option_img) {
      $('#option2ImagePreview').show();
      $('#image_preview_option2').attr('src', option2_img_url);
    }

    if (value.questions_options[2] && value.questions_options[2].option_img) {
      $('#option3ImagePreview').show();
      $('#image_preview_option3').attr('src', option3_img_url);
    }

    if (value.questions_options[3] && value.questions_options[3].option_img) {
      $('#option4ImagePreview').show();
      $('#image_preview_option4').attr('src', option4_img_url);
    }

    if (value.questions_options[4] && value.questions_options[4].option_img) {
      $('#option5ImagePreview').show();
      $('#image_preview_option5').attr('src', option5_img_url);
    }

    if (value.questions_options[0].is_answer == "1")
      $('#option1Label').show();
    else if (value.questions_options[1].is_answer == "1")
      $('#option2Label').show();
    else if (value.questions_options[2] && value.questions_options[2].is_answer == "1")
      $('#option3Label').show();
    else if (value.questions_options[3] && value.questions_options[3].is_answer == "1")
      $('#option4Label').show();
    else if (value.questions_options[4] && value.questions_options[4].is_answer == "1")
      $('#option5Label').show();
  }

});
