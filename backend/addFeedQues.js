$(document).ready(function () {

    $user = "";
    if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    } else {
        window.location.replace("login.html");
    }

    const searchParams = new URLSearchParams(window.location.search);
    let sId = "669";
    let sName = "Add Questions";
    if (searchParams.has('id') && searchParams.has('sname')) {
        sId = searchParams.get('sid');
        sName = searchParams.get('sname');
        $('#courseName').text(sName);
    }

    let questions = [];
    let hint = ''
    let solution = ''
    let source = ''
    let catagory = "1"
    let field_type = 1
    //
    let options = []
    //
    let option1 = ''
    let option2 = ''
    let option3 = ''
    let option4 = ''
    let option5 = ''
    //
    let question_img = ""
    let option1_img = ""
    let option2_img = ""
    let option3_img = ""
    let option4_img = ""
    let option5_img = ""
    let question_img_url = ""
    let option1_img_url = ""
    let option2_img_url = ""
    let option3_img_url = ""
    let option4_img_url = ""
    let option5_img_url = ""

    $('.uploadedques').hide();
    $('.uploadedhint').hide();
    $('.uploadedsolution').hide();
    $('.imgPreviewques').hide();
    $('.imgPreviewhint').hide();
    $('.imgPreviewsolution').hide();


    $('#option1ImagePreview').hide();
    $('#uploadedoption1').hide();
    $('#option2ImagePreview').hide();
    $('#uploadedoption2').hide();
    $('#option3ImagePreview').hide();
    $('#uploadedoption3').hide();
    $('#option4ImagePreview').hide();
    $('#uploadedoption4').hide();
    $('#option5ImagePreview').hide();
    $('#uploadedoption5').hide();

    $('#fifth').hide();
    // radios for selecting
    $('.tick').hide();

    $('.radiostest').on('click', function () {
    if ($('#Radios1').is(':checked') === true) {
      $('.untick1').hide()
      $('.untick2').show()
      $('.untick3').show()
      $('.untick4').show()
      $('.untick5').show()
      $('.tick5').hide()
      $('.tick1').show()
      $('.tick2').hide()
      $('.tick3').hide()
      $('.tick4').hide()
    }
    if ($('#Radios2').is(':checked') === true) {
      $('.untick1').show()
      $('.untick2').hide()
      $('.untick3').show()
      $('.untick4').show()
      $('.untick5').show()
      $('.tick5').hide()
      $('.tick2').show()
      $('.tick1').hide()
      $('.tick3').hide()
      $('.tick4').hide()
    }
    if ($('#Radios3').is(':checked') === true) {
      $('.untick1').show()
      $('.untick2').show()
      $('.untick3').hide()
      $('.untick4').show()
      $('.untick5').show()
      $('.tick5').hide()
      $('.tick3').show()
      $('.tick2').hide()
      $('.tick1').hide()
      $('.tick4').hide()
    }
    if ($('#Radios4').is(':checked') === true) {
      $('.untick1').show()
      $('.untick2').show()
      $('.untick3').show()
      $('.untick4').hide()
      $('.untick5').show()
      $('.tick5').hide()
      $('.tick4').show()
      $('.tick2').hide()
      $('.tick3').hide()
      $('.tick1').hide()
    }
    if ($('#Radios5').is(':checked') === true) {
      $('.untick1').show()
      $('.untick2').show()
      $('.untick3').show()
      $('.untick4').show()
      $('.untick5').hide()
      $('.tick4').hide()
      $('.tick2').hide()
      $('.tick3').hide()
      $('.tick1').hide()
      $('.tick5').show()
    }
  });

  $('#fifthOptionBtn').on('click', function () {
    $('#fifthOptionBtn').hide();
    $('#fifth').show();
  })

  //on click of delete image changing the styling again
  $('.uploadedques').on('click', function () {
    $('.uploadedques').hide();
    $('.notUploadedques').show();
    $('.imgPreviewques').hide();
    $('#quesImage').val('');
    $('#quesLabel').show();
    question_img = "";
    question_img_url = "";
  })

  $('.uploadedhint').on('click', function () {
    $('.uploadedhint').hide();
    $('.notUploadedhint').show();
    $('.imgPreviewhint').hide();
    $('#hintImage').val('');
    $('#hintLabel').show();
    hint_img = "";
    hint_img_url = "";
  })

  $('.uploadedsolution').on('click', function () {
    $('.uploadedsolution').hide();
    $('.notUploadedsolution').show();
    $('.imgPreviewsolution').hide();
    $('#solutionImage').val('');
    $('#solutionLabel').show();
    solution_img = "";
    solution_img_url = "";
  });


  //textboxes and dropdowns
  $('#quesInput').on('change', function () {
    question = $('#quesInput').val()
  })
  $('#hintInput').on('change', function () {
    hint = $('#hintInput').val()
  })
  $('#solutionInput').on('change', function () {
    solution = $('#solutionInput').val()
  })
  $('#sourceInput').on('change', function () {
    source = $('#sourceInput').val()
  })
  $('.bloomSelect').on('change', function () {
    bloom_level = $('.bloomSelect').val()
  })
  $('.levelSelect').on('change', function () {
    difficulty_level = $('.levelSelect').val()
  })
  $('#firstOption').on('change', function () {
    option1 = $('#firstOption').val()
  })
  $('#secondOption').on('change', function () {
    option2 = $('#secondOption').val()
  })
  $('#thirdOption').on('change', function () {
    option3 = $('#thirdOption').val()
  })
  $('#fourthOption').on('change', function () {
    option4 = $('#fourthOption').val()
  })
  $('#fifthOption').on('change', function () {
    option5 = $('#fifthOption').val()
  })

  //images
  $('#quesImage').on('change', function () {
    if (readURL(this, "ques")) {
      $('.uploadedques').show();
      $('.imgPreviewques').show();
      $('.notUploadedques').hide();
      $('#quesLabel').hide();
      question_img = $("#quesImage")[0].files[0];
    }
  });

  $('#opt1Image').on('change', function () {
    // option1_img = $('#opt1Image').val()
    if (readURL(this, "1")) {
      option1_img = $("#opt1Image")[0].files[0];
      $('#uploadedoption1').show()
      $('#notUploadedoption1').hide()
      $('#option1ImagePreview').show()
    }
  });

  $('#opt2Image').on('change', function () {
    // option2_img = $('#opt2Image').val()
    if (readURL(this, "2")) {
      option2_img = $("#opt2Image")[0].files[0];
      $('#uploadedoption2').show()
      $('#notUploadedoption2').hide()
      $('#option2ImagePreview').show()
    }
  });

  $('#opt3Image').on('change', function () {
    // option3_img = $('#opt3Image').val()
    if (readURL(this, "3")) {
      option3_img = $("#opt3Image")[0].files[0];
      $('#uploadedoption3').show()
      $('#notUploadedoption3').hide()
      $('#option3ImagePreview').show()
    }
  });

  $('#opt4Image').on('change', function () {
    // option4_img = $('#opt4Image').val()
    if (readURL(this, "4")) {
      option4_img = $("#opt4Image")[0].files[0];
      $('#notUploadedoption4').hide();
      $('#uploadedoption4').show();
      $('#option4ImagePreview').show();
    }
  });

  $('#opt5Image').on('change', function () {
    if (readURL(this, "5")) {
      option5_img = $('#opt5Image')[0].files[0]
      $('#uploadedoption5').show()
      $('#notUploadedoption5').hide()
      $('#option5ImagePreview').show()
    }
  });

  function readURL(input, name) {
    const ext = $(input).val().split('.').pop().toLowerCase();

    if (input.files && input.files[0] && $.inArray(ext, ['gif', 'png', 'jpg', 'jpeg']) != -1) {
      var reader = new FileReader();

      reader.onload = function (e) {
        switch (name) {
          case "1":
            $('#image_preview_option1').attr('src', e.target.result);
            break;
          case "2":
            $('#image_preview_option2').attr('src', e.target.result);
            break;
          case "3":
            $('#image_preview_option3').attr('src', e.target.result);
            break;
          case "4":
            $('#image_preview_option4').attr('src', e.target.result);
            break;
          case "5":
            $('#image_preview_option5').attr('src', e.target.result);
            break;
          case "ques":
            $('#image_preview_ques').attr('src', e.target.result);
            break;
          default:
            $('#image_preview_option5').attr('src', e.target.result);
            break;
        }
      }
      reader.readAsDataURL(input.files[0]);
      return true
    }
    else {
      $('#errorToastBody').text('Invalid Image Type');
      $('#errorToast').toast('show');
      return false;
    }
  }

  $('#uploadedoption1').on('click', function () {
    $('#uploadedoption1').hide();
    $('#notUploadedoption1').show();
    $('#option1ImagePreview').hide();
    $('#opt1Image').val('');
    option1_img = "";
    option1_img_url = "";
  });

  $('#uploadedoption2').on('click', function () {
    $('#uploadedoption2').hide();
    $('#notUploadedoption2').show();
    $('#option2ImagePreview').hide();
    $('#opt2Image').val('');
    option2_img = "";
    option2_img_url = "";
  });

  $('#uploadedoption3').on('click', function () {
    $('#uploadedoption3').hide();
    $('#notUploadedoption3').show();
    $('#option3ImagePreview').hide();
    $('#opt3Image').val('');
    option3_img = "";
    option3_img_url = "";
  });

  $('#uploadedoption4').on('click', function () {
    $('#uploadedoption4').hide();
    $('#notUploadedoption4').show();
    $('#option4ImagePreview').hide();
    $('#opt4Image').val('');
    option4_img = "";
    option4_img_url = "";
  });

  $('#uploadedoption5').on('click', function () {
    $('#uploadedoption5').hide();
    $('#notUploadedoption5').show();
    $('#option5ImagePreview').hide();
    $('#opt5Image').val('');
    option5_img = "";
    option5_img_url = "";
  });

  getQuestions();

  function getQuestions(){
    questions = [];
    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyQuestions?survey_id=' + sId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {

          if (result.status == 200 && result.data) {
            $('.initData').remove();

            $.each(result.data, function (key, value) {
            //   questionsList.push(value.id);
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

  function loadList() {
    console.log(questions);
    $("#addquesDiv").empty();
    let i = 1;

    $.each(questions, function (key, value) {
      // $('#addquesDiv').append(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' id='p` + value.id + `' data-id='` + value.id + `'>` + value.name.replace('<pre>', '') + `</p></div>`);
      $('#addquesDiv').append("<div class='row m-0'>" +
      "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q"+ i++ +").</div>" +
      "<div class='col-10 chosenQuestions py-2 pr-2 questions' id='p" + value.id + "' data-id='" + value.id + "' style='cursor:pointer;'>" + value.name.replace('<pre>', '') + "</div>");
    });
    // MathJax.typesetPromise();
  }

  function clearAll() {
    $("input[name='Radios']").prop("checked", false);
    $('.untick1').show()
    $('.untick2').show()
    $('.untick3').show()
    $('.untick4').show()
    $('.untick5').show()
    $('.tick1').hide()
    $('.tick2').hide()
    $('.tick3').hide()
    $('.tick4').hide()
    $('.tick5').hide()
    question = '';
    catagory = "";
    field_type = 1;
    options = [];
    option1 = '';
    option2 = '';
    option3 = '';
    option4 = '';
    option5 = '';
    question_img = "";
    option1_img = "";
    option2_img = "";
    option3_img = "";
    option4_img = "";
    option5_img = "";
    question_img_url = "";
    option1_img_url = "";
    option2_img_url = "";
    option3_img_url = "";
    option4_img_url = "";
    option5_img_url = "";

    $('#quesInput').val("");
    $('#selectCatagory').val("1");
    $('#firstOption').val("");
    $('#secondOption').val("");
    $('#thirdOption').val("");
    $('#fourthOption').val("");
    $('#fifthOption').val("");
    $('#opt1Image').val("");
    $('#opt2Image').val("");
    $('#opt3Image').val("");
    $('#opt4Image').val("");
    $('#opt5Image').val("");
    $('#questionId').val("");

    $('#uploadedoption1').click();
    $('#uploadedoption2').click();
    $('#uploadedoption3').click();
    $('#uploadedoption4').click();
    $('#uploadedoption5').click();

    $('#fifth').hide();
    $('#fifthOptionBtn').show();
    $('.uploadedques').click();
  }

  $(document).on('click', '.questions', function () {

    if ($(this).data('id') != $('#questionId').val()) {
        clearAll(false);
        let questionId = $(this).data('id');

        $('#questionId').val(questionId);
        // let value = {};

        // $.each(questions, function (key, value1) {
        //     if (questionId == value1.id)
        //         value = value1;
        // });
        const value = questions.filter(question1 => questionId == question1.id)[0];
    // console.log(JSON.stringify(value));

        $('#quesInput').val(value.name);
        question = value.name;

        $('#firstOption').val(value.questions_options[0].name);
        option1 = value.questions_options[0].name;
        $('#secondOption').val(value.questions_options[1].name);
        option2 = value.questions_options[1].name;

        if (value.questions_options[2]) {
        $('#thirdOption').val(value.questions_options[2].name);
        option3 = value.questions_options[2].name;
        }
        if (value.questions_options[3]) {
        $('#fourthOption').val(value.questions_options[3].name);
        option4 = value.questions_options[3].name;
        }
        if (value.questions_options[4]) {
        $("#fifthOptionBtn").click();
        $('#fifthOption').val(value.questions_options[4].name);
        option5 = value.questions_options[4].name;
        }

        if (value.category_name) {
        $('#selectBloomLevel').val(value.category_name);
        category_name = value.category_name;
        }

        if (value.question_img && value.question_img != null && value.question_img != " ") {
        $('.uploadedques').show()
        $('.imgPreviewques').show()
        $('.notUploadedques').hide()
        $('#quesLabel').hide()
        $('#image_preview_ques').attr('src', value.question_img);
        question_img_url = value.question_img;
        }

        if (value.hint_image && value.hint_image != null) {
        $('#hintDiv').show();
        $('#hintBtn').hide();
        $('.uploadedhint').show()
        $('.imgPreviewhint').show()
        $('.notUploadedhint').hide()
        $('#hintLabel').hide()
        $('#image_preview_hint').attr('src', value.hint_image);
        hint_img_url = value.hint_image;
        }

        if (value.solution_image && value.solution_image != null) {
        $('#solutionDiv').show();
        $('#solutionBtn').hide();
        $('.uploadedsolution').show()
        $('.imgPreviewsolution').show()
        $('.notUploadedsolution').hide()
        $('#solutionLabel').hide()
        $('#image_preview_solution').attr('src', value.solution_image);
        solution_img_url = value.solution_image;
        }

        if (value.questions_options[0].option_img) {
        option1_img_url = value.questions_options[0].option_img;
        $('#uploadedoption1').show();
        $('#notUploadedoption1').hide();
        $('#option1ImagePreview').show();
        $('#image_preview_option1').attr('src', option1_img_url);
        }

        if (value.questions_options[1].option_img) {
        option2_img_url = value.questions_options[1].option_img;
        $('#uploadedoption2').show();
        $('#notUploadedoption2').hide();
        $('#option2ImagePreview').show();
        $('#image_preview_option2').attr('src', option2_img_url);
        }

        if (value.questions_options[2] && value.questions_options[2].option_img) {
        option3_img_url = value.questions_options[2].option_img;
        $('#uploadedoption3').show();
        $('#notUploadedoption3').hide();
        $('#option3ImagePreview').show();
        $('#image_preview_option3').attr('src', option3_img_url);
        }

        if (value.questions_options[3] && value.questions_options[3].option_img) {
        option4_img_url = value.questions_options[3].option_img;
        $('#uploadedoption4').show();
        $('#notUploadedoption4').hide();
        $('#option4ImagePreview').show();
        $('#image_preview_option4').attr('src', option4_img_url);
        }

        if (value.questions_options[4] && value.questions_options[4].option_img) {
        option5_img_url = value.questions_options[4].option_img;
        $('#uploadedoption5').show();
        $('#notUploadedoption5').hide();
        $('#option5ImagePreview').show();
        $('#image_preview_option5').attr('src', option5_img_url);
        }

        
        }
    });

});