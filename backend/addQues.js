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
  let tId = "0";
  let unit_id = "0";
  let tname = "";
  let sId = "0";
  let editQuesJSON = "";
  let isCookie = false;
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }
  if (searchParams.has('tname')) {
    tname = searchParams.get('tname');
    if (tname)
      $('#courseName').text(tname);
  }

  //preparing for post api of questions

  let question = ''
  let hint = ''
  let solution = ''
  let source = ''
  let bloom_level = "1"
  let difficulty_level = "1"
  let field_type = 1
  //
  let topics = []
  let options = []
  //
  let option1 = ''
  let option2 = ''
  let option3 = ''
  let option4 = ''
  let option5 = ''
  //
  let question_img = ""
  let solution_img = ""
  let hint_img = ""
  let option1_img = ""
  let option2_img = ""
  let option3_img = ""
  let option4_img = ""
  let option5_img = ""
  let question_img_url = ""
  let solution_img_url = ""
  let hint_img_url = ""
  let option1_img_url = ""
  let option2_img_url = ""
  let option3_img_url = ""
  let option4_img_url = ""
  let option5_img_url = ""

  let type = 'public';
  let answer = '';


  //initially hiding the hint and solution divs
  $('#hintDiv').hide();
  $('#hintBtn').show();
  $('#solutionDiv').hide();
  $('#solutionBtn').show();
  $('#fifth').hide();

  //hiding edit btn
  $('#editBtn').hide();
  $('#addNewBtn').hide();

  //on click of hint btn
  $('#hintBtn').on('click', function () {
    $('#hintDiv').show();
    $('#hintBtn').hide();
  })

  //on click of solution btn
  $('#solutionBtn').on('click', function () {
    $('#solutionDiv').show();
    $('#solutionBtn').hide();
  })

  //onclick of add option btn
  $('#fifthOptionBtn').on('click', function () {
    $('#fifthOptionBtn').hide();
    $('#fifth').show();
  })

  //initially hide the uploaded fonticons and image
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

  // radios for selecting
  $('.tick').hide();

  getTopics();

  function getTopics() {

    if (unit_id == "0") {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectTopics?subject_id=' + subSemId + '&university_degree_department_id=' + `${$user.university_degree_department_id}`,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {

          $('#topicTags').empty();
          if (result.status == 200 && result.data) {
            $.each(result.data, function (key, value) {

              $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + value.id + "' data-type='" + value.type + "' data-id='" + value.id + "' name='topicTagAdd' id='topicTagAdd" + value.id + "'/><label for='topicTagAdd" + value.id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.name + "</label></li>");

            });
          }
          else {
            $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");
            }
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaire/getUnitTopics?unit_ids=' + unit_id,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {

          $('#topicTags').empty();
          if (result.status == 200 && result.data) {
            $.each(result.data, function (key, value) {
              $.each(value.topic, function (key, value) {
                $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + value.topic_id + "' data-type='" + value.type + "' data-id='" + value.id + "' name='topicTagAdd' id='topicTagAdd" + value.topic_id + "'/><label for='topicTagAdd" + value.topic_id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.topic_name + "</label></li>");
              });
            });
          }
          else {
            $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");
            }
          if (searchParams.has('sid')) {
            sId = searchParams.get('sid');
            $('#questionBankA').attr('href','courseDetails.html?id=' + sId + '&uid=' + unit_id);
            $('#questionBankA').text('Question Bank');
            $('#divSaveSend').hide();
            if ($.cookie('editQues')) {
              editQuesJSON = $.cookie('editQues') ? JSON.parse($.cookie('editQues')) : null;
              questions.push(editQuesJSON);
              isCookie = true;
              loadList();
              $.cookie('editQues', "");
              $('#questionId').val(editQuesJSON.id);
              autoFill(questions[0]);
            }
          }
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
  }


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

  $('#hintImage').on('change', function () {
    if (readURL(this, "hint")) {
      $('.uploadedhint').show();
      $('.imgPreviewhint').show();
      $('.notUploadedhint').hide();
      $('#hintLabel').hide();
      hint_img = $("#hintImage")[0].files[0];
    }
  });

  $('#solutionImage').on('change', function () {
    if (readURL(this, "sol")) {
      $('.uploadedsolution').show();
      $('.imgPreviewsolution').show();
      $('.notUploadedsolution').hide();
      $('#solutionLabel').hide();
      solution_img = $("#solutionImage")[0].files[0];
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
          case "sol":
            $('#image_preview_solution').attr('src', e.target.result);
            break;
          case "hint":
            $('#image_preview_hint').attr('src', e.target.result);
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

  $('.onoffswitch-label').on('click', function () {
    const val = $("input[name='public_pvt']:checked").val();
    // alert(val);
    if (val !== 'public') {
      type = "public"
    } else {
      type = "private"
    }
  });

  $('input[name=Radios]').on('change', function () {
    answer = $('input[name=Radios]:checked').val();
  })

  // //to select multiple values of selected checkboxes

  $(document).on('click', '.topicTagsInput', function () {

    let value = $(this).data('type');
    let id = parseInt($(this).val());

    if (!topics.includes(value)) {
      topics.push({ "id": id, "type": value });
    }

    if ($(this).prop('checked') == false) {
      topics = topics.filter(function (e) {
        return e.id != id;
      });
    }

  });


  //on click of + btn(post request)

  $('#plusBtn').on('click', function () {

    bloom_level = $('#selectBloomLevel').val();
    difficulty_level = $('#selectLevel').val();

    if (topics != null && topics.length > 0 && (option1 || option1_img_url) && (option2 || option2_img_url)
      && bloom_level && difficulty_level && source && answer && question && type) {

      //saving in array
      options.push("" + option1 + "")
      options.push("" + option2 + "")
      if (option3 !== "") {
        options.push("" + option3 + "")
      }
      if (option4 !== "") {
        options.push("" + option4 + "")
      }
      if (option5 !== "") {
        options.push("" + option5 + "")
      }

      var form = new FormData();
      form.append("question", question);
      form.append("topics", JSON.stringify(topics))
      form.append("options", "[" + '"' + options.join('","') + '"' + "]");
      form.append("blooms_level", bloom_level);
      form.append("difficulty_level", difficulty_level);
      form.append("hint", hint);
      form.append("source", source);
      form.append("type", type);
      form.append("field_type", field_type);
      form.append("answer", answer);
      form.append("question_img", question_img);
      form.append("solution_img", solution_img);
      form.append("option1_img", option1_img);
      form.append("option2_img", option2_img);
      form.append("option3_img", option3_img);
      form.append("option4_img", option4_img);
      form.append("option5_img", option5_img);
      form.append("solution", solution);
      form.append("hint_img", hint_img);

      $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "#fff",
        opacity: 0.7
      }).appendTo($("#abcd").css('position', 'relative'));
      $("input.custom-control-input").attr("disabled", true);


      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/addObjectiveQuestion',
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
            $('#loadingDiv').remove();
            $('#successToastBody').text('Question Added to Database Successfully');
            $('#successToast').toast('show');
            
            questionsList.push(result.data.id);
            questions.push(result.data);
            loadList();
            $("input.custom-control-input").attr("disabled", false);
            clearAll(true);
          }
          else {
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      if (topics == null || !topics || topics.length == "0")
        $('#errorToastBody').text("Please Select Topics");
      else if (!option1 || !option2)
        $('#errorToastBody').text("2 Options are Mandatory");
      else if (!bloom_level || !difficulty_level)
        $('#errorToastBody').text("Please Select Bloom and Diffculty Level values");
      else if (!question)
        $('#errorToastBody').text("Please enter Question");
      else if (!type)
        $('#errorToastBody').text("Please Select Public or Private");
      else if (!answer)
        $('#errorToastBody').text("Please Select an Option as Answer");
      else if (!source)
        $('#errorToastBody').text("Please Enter Source");
      else if (topics != null && option1 && option2 && bloom_level && difficulty_level && answer && question && type)
        $('#errorToastBody').text("Some fields are mandatory");
      $('#errorToast').toast('show');
    }

  });

  function clearAll(updateTopics) {
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
    question = ''
    hint = ''
    solution = ''
    source = ''
    bloom_level = ""
    difficulty_level = ""
    field_type = 1
    topics = []
    options = []
    option1 = ''
    option2 = ''
    option3 = ''
    option4 = ''
    option5 = ''
    question_img = ""
    solution_img = ""
    hint_img = ""
    option1_img = ""
    option2_img = ""
    option3_img = ""
    option4_img = ""
    option5_img = ""
    question_img_url = ""
    solution_img_url = ""
    hint_img_url = ""
    option1_img_url = ""
    option2_img_url = ""
    option3_img_url = ""
    option4_img_url = ""
    option5_img_url = ""

    $('#quesInput').val("");
    $('#selectBloomLevel').val("1");
    $('#selectLevel').val("1");
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
    $('#hintImage').val("");
    $('#solutionImage').val("");
    $('#sourceInput').val("");
    $('#solutionInput').val("");
    $('#hintInput').val("");
    if ($("input[name='public_pvt']:checked").val() != 'public') {
      $('#customSwitch1').click();
    }
    $('#solutionDiv').hide();
    $('#hintDiv').hide();
    $('#solutionBtn').show();
    $('#hintBtn').show()
    $('#questionId').val("");

    $('#uploadedoption1').click();
    $('#uploadedoption2').click();
    $('#uploadedoption3').click();
    $('#uploadedoption4').click();
    $('#uploadedoption5').click();

    $('#fifth').hide();
    $('#fifthOptionBtn').show();

    $('#deleteBtn').hide();
    $('#editBtn').hide();
    $('#addNewBtn').hide();
    $('#plusBtn').show();


    $('.uploadedques').click();
    $('.uploadedhint').click();
    $('.uploadedsolution').click();
    
    $('#option1Label').show();
    $('#option2Label').show();
    $('#option3Label').show();
    $('#option4Label').show();
    $('#option5Label').show();
    
    $('#quesInput').prop('disabled',false);
    $('#firstOption').prop('disabled',false);
    $('#secondOption').prop('disabled',false);
    $('#thirdOption').prop('disabled',false);
    $('#fourthOption').prop('disabled',false);
    $('#fifthOption').prop('disabled',false);
    $('#solutionInput').prop('disabled',false);
    $('#hintInput').prop('disabled',false);
    $('#sourceInput').prop('disabled',false);
    $('.chooseImage').css('pointer-events','auto').css('cursor','auto');

    if (updateTopics)
      getTopics();

  }


  $("#btnSave").click(function () {
    saveQuestions(false);
  });

  $("#btnSaveSend").click(function () {
    saveQuestions(true);
  });

  function saveQuestions(isSend){
    if(!unit_id || unit_id == "0") unit_id = subSemId;
    if (questionsList != null && questionsList.length > 0 && tId != "0") {

      $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "#fff",
        opacity: 0.7
      }).appendTo($("#abcd"));
      $("input.custom-control-input").attr("disabled", true);

      let form = new FormData();
      form.append("test_id", tId);
      form.append("questions", JSON.stringify(questionsList));
      form.append("units", "[" + unit_id + "]");

      // console.log(tId,questionsList,unit_id)
      // for (var key of form.entries()) {
      //   console.log(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editObjectiveTestQuestions',
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
            $('#successToastBody').text(result.message);
            $('#successToast').toast('show');
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
            setTimeout(function () {
              if(!isSend)
                window.location.href = "myAssessment.html";
              else
                window.location.href = "sendQuestionsPage.html?id="+subSemId+"&tid="+tId+"&tname="+tname+"&uid="+unit_id+"&isObj=true&qc="+questions.length;
            }, 2000);
          }
          else {
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
            $('#errorToastBody').text(result.message);
            $('#errorToast').toast('show');
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else if (tId == "0" && sId != "0") {
      window.location.href = 'courseDetails.html?id=' + sId + '&uid=' + unit_id;
    }
  }

  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    $('#successToast').toast({animation: true});
    $('#errorToast').toast({animation: true});
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide(1000);
    }, 3000);
  });


  //clicking questions
  $(document).on('click', '.questions', function () {

    if ($(this).data('id') != $('#questionId').val()) {
      clearAll(false);
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
    $('#deleteBtn').show();
    $('#plusBtn').hide();
    $('#editBtn').show();
    if (!isCookie)
      $('#addNewBtn').show();

    $('#addsoln').show();
    $('#topicsDiv').hide();

    let question_type1 = value.question_type;

    if (value.question_type) {

      if (value.question_type == 'private') {
        if ($("input[name='public_pvt']:checked").val() === 'public') {
          $('#customSwitch1').click();
        }
      }
      else if (value.question_type == 'public') {
        if ($("input[name='public_pvt']:checked").val() != 'public') {
          $('#customSwitch1').click();
        }
      }
      
      $('#option1Label').show();
      $('#option2Label').show();
      $('#option3Label').show();
      $('#option4Label').show();
      $('#option5Label').show();
      $('#quesInput').prop('disabled',false);
      $('#firstOption').prop('disabled',false);
      $('#secondOption').prop('disabled',false);
      $('#thirdOption').prop('disabled',false);
      $('#fourthOption').prop('disabled',false);
      $('#fifthOption').prop('disabled',false);
      $('#solutionInput').prop('disabled',false);
      $('#hintInput').prop('disabled',false);
      $('#sourceInput').prop('disabled',false);
      $('.chooseImage').css('pointer-events','auto').css('cursor','auto');

    }
    else {
      $('#addsoln').hide();
      $('#topicsDiv').show();
      $('#topicsDiv').empty();
      $('#topicsDiv').append("<p class='font-weight-bold'>This question is not editable - it belongs to Edwisely repo</p>");
      $('#option1Label').hide();
      $('#option2Label').hide();
      $('#option3Label').hide();
      $('#option4Label').hide();
      $('#option5Label').hide();

      $('#quesInput').prop('disabled',true);
      $('#firstOption').prop('disabled',true);
      $('#secondOption').prop('disabled',true);
      $('#thirdOption').prop('disabled',true);
      $('#fourthOption').prop('disabled',true);
      $('#fifthOption').prop('disabled',true);
      $('#solutionInput').prop('disabled',true);
      $('#hintInput').prop('disabled',true);
      $('#sourceInput').prop('disabled',true);
      $('.chooseImage').css('pointer-events','none').css('cursor','not-allowed');
    }

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

    if (value.source) {
      $('#sourceInput').val(value.source);
      source = value.source;
    }

    if (value.solution) {
      $('#solutionDiv').show();
      $('#solutionBtn').hide();
      $('#solutionInput').val(value.solution);
      solution = value.solution;
    }

    if (value.hint) {
      $('#hintDiv').show();
      $('#hintBtn').hide();
      $('#hintInput').val(value.hint);
      hint = value.hint;
    }

    if (value.blooms_level) {
      $('#selectBloomLevel').val(value.blooms_level);
      bloom_level = value.blooms_level;
    }

    if (value.difficulty_level) {
      $('#selectLevel').val(value.difficulty_level);
      difficulty_level = value.difficulty_level;
    }

    $.each(value.topics_details, function (key, value) {
      if (question_type1) {
        $('#topicTagAdd' + value.id).prop('checked', true);
      }
      else {
        // $('#topicsDiv').append("<span class='badge badge-pill'>" + value.id + "</span><br>");
        $('#addNewBtn').show();
      }
    });
    topics = value.topics_details;

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

    if (value.questions_options[0].is_answer == "1") {
      $("input[name='Radios'][value='0']").prop("checked", true);
      answer = "0";
      $('.untick1').hide()
      $('.untick2').show()
      $('.untick3').show()
      $('.untick4').show()
      $('.untick5').show()
      $('.tick1').show()
      $('.tick2').hide()
      $('.tick3').hide()
      $('.tick4').hide()
      $('.tick5').hide()
      $('#option1Label').show();
    }
    else if (value.questions_options[1].is_answer == "1") {
      $("input[name='Radios'][value='1']").prop("checked", true);
      answer = "1";
      $('.untick1').show()
      $('.untick2').hide()
      $('.untick3').show()
      $('.untick4').show()
      $('.untick5').show()
      $('.tick1').hide()
      $('.tick2').show()
      $('.tick3').hide()
      $('.tick4').hide()
      $('.tick5').hide()
      $('#option2Label').show();
    }
    else if (value.questions_options[2] && value.questions_options[2].is_answer == "1") {
      $("input[name='Radios'][value='2']").prop("checked", true);
      answer = "2";
      $('.untick1').show()
      $('.untick2').show()
      $('.untick3').hide()
      $('.untick4').show()
      $('.untick5').show()
      $('.tick1').hide()
      $('.tick2').hide()
      $('.tick3').show()
      $('.tick4').hide()
      $('.tick5').hide()
      $('#option3Label').show();
    }
    else if (value.questions_options[3] && value.questions_options[3].is_answer == "1") {
      $("input[name='Radios'][value='3']").prop("checked", true);
      answer = "3";
      $('.untick1').show()
      $('.untick2').show()
      $('.untick3').show()
      $('.untick4').hide()
      $('.untick5').show()
      $('.tick1').hide()
      $('.tick2').hide()
      $('.tick3').hide()
      $('.tick4').show()
      $('.tick5').hide()
      $('#option4Label').show();
    }
    else if (value.questions_options[4] && value.questions_options[4].is_answer == "1") {
      $("input[name='Radios'][value='4']").prop("checked", true);
      answer = "4";
      $('.untick1').show()
      $('.untick2').show()
      $('.untick3').show()
      $('.untick4').show()
      $('.untick5').hide()
      $('.tick1').hide()
      $('.tick2').hide()
      $('.tick3').hide()
      $('.tick4').hide()
      $('.tick5').show()
      $('#option5Label').show();
    }
  }

  //delete btn
  $("#deleteBtn").click(function () {

    let questionId = $('#questionId').val()

    if (questionId && questionId != "0") {

      questions = $.grep(questions, function (e) {
        return e.id != questionId;
      });

      questionsList.splice($.inArray("abc", questionsList), 1);

      loadList();
      clearAll(true);

    }

  });

  $("#addNewBtn").click(function () {

    $('#questionId').val("0");
    $('#addsoln').show();
    $('#topicsDiv').hide();
    $('#deleteBtn').hide();
    $('#plusBtn').show();
    $('#editBtn').hide();
    $('#addNewBtn').hide();

    clearAll(true);

  });


  $("#editBtn").click(function () {

    let questionId = $('#questionId').val()
    let newQuestion = [];
    let newOptions = [];

    if (questionId && questionId != "0") {

      $.each(questions, function (key, value) {
        if (questionId == value.id) {
          newQuestion = value;
          newOptions = value.questions_options;
          return false;
        }
      });

      newQuestion.college_account_id = parseInt(`${$user.user_id}`);
      newQuestion.hint = $('#hintInput').val();
      newQuestion.blooms_level = bloom_level;
      newQuestion.difficulty_level = difficulty_level;
      newQuestion.name = $('#quesInput').val();
      if (topics.length > 0)
        newQuestion.topics_details = topics;
      newQuestion.solution = $('#solutionInput').val();


      if ((newQuestion.question_img && !question_img_url) || question_img){
        newQuestion.question_img = "";
        newQuestion.media = 1
      }

      if (newQuestion.solution_image && !solution_img_url)
        newQuestion.solution_image = "";

      if (newQuestion.hint_image && !hint_img_url)
        newQuestion.hint_image = "";


      if (newOptions[0] && newOptions[0].name) newOptions[0].name = option1;
      if (newOptions[1] && newOptions[1].name) newOptions[1].name = option2;
      if (newOptions[2] && newOptions[2].name) newOptions[2].name = option3;
      if (newOptions[3] && newOptions[3].name) newOptions[3].name = option4;
      if (newOptions[4] && newOptions[4].name) newOptions[4].name = option4;

      if (newOptions[0].option_img && !option1_img_url)
        newOptions[0].option_img = "";

      if (newOptions[1].option_img && !option2_img_url)
        newOptions[1].option_img = "";

      if (newOptions[2] && newOptions[2].option_img && !option3_img_url)
        newOptions[2].option_img = "";

      if (newOptions[3] && newOptions[3].option_img && !option4_img_url)
        newOptions[3].option_img = "";

      if (newOptions[4] && newOptions[4].option_img && !option5_img_url)
        newOptions[4].option_img = "";

      if (!newOptions[2] && (option3 || option3_img)) {
        let isAnswer = "0";
        let media = '0';
        if (!option3_img) media = "1";
        if (answer == "2") isAnswer = "1";
        newOptions[2] = {
          "id": "",
          "name": option3,
          "is_answer": isAnswer,
          "media": media,
          "option_img": option3_img_url,
          "question_id": questionId
        }
      }

      if (!newOptions[3] && (option4 || option4_img)) {
        let isAnswer = "0";
        let media = '0';
        if (!option4_img) media = "1";
        if (answer == "3") isAnswer = "1";
        newOptions[3] = {
          "id": "",
          "name": option4,
          "is_answer": isAnswer,
          "media": media,
          "option_img": option4_img_url,
          "question_id": questionId
        }
      }

      if (!newOptions[4] && (option5 || option5_img)) {
        let isAnswer = "0";
        let media = '0';
        if (!option5_img) media = "1";
        if (answer == "4") isAnswer = "1";
        newOptions[4] = {
          "id": "",
          "name": option5,
          "is_answer": isAnswer,
          "media": media,
          "option_img": option5_img_url,
          "question_id": questionId
        }
      }

      newOptions = newOptions.filter(function (e, index) {
        if (index == 0 && (option1 || option1_img || option1_img_url)) {
          if (answer == "0") e.is_answer = 1;
          else e.is_answer = "0";
          if (option1_img || option1_img_url) e.media = 1;
          return e;
        }
        if (index == 1 && (option2 || option2_img || option2_img_url)) {
          if (answer == "1") e.is_answer = 1;
          else e.is_answer = "0";
          if (option2_img || option2_img_url) e.media = 1;
          return e;
        }
        if (index == 2 && (option3 || option3_img || option3_img_url)) {
          if (answer == "2") e.is_answer = 1;
          else e.is_answer = "0";
          if (option3_img || option3_img_url) e.media = 1;
          return e;
        }
        if (index == 3 && (option4 || option4_img || option4_img_url)) {
          if (answer == "3") e.is_answer = 1;
          else e.is_answer = "0";
          if (option4_img || option4_img_url) e.media = 1;
          return e;
        }
        if (index == 4 && (option5 || option5_img || option5_img_url)) {
          if (answer == "4") e.is_answer = 1;
          else e.is_answer = "0";
          if (option5_img || option5_img_url) e.media = 1;
          return e;
        }
      });

      newQuestion.questions_options = newOptions;

      let question_type1 = $("input[name='public_pvt']:checked").val();
      if (!question_type1)
        question_type1 = "private";

      // console.log(JSON.stringify(newQuestion));

      if (topics != null && topics.length > 0 && newOptions.length >= 2 && bloom_level && answer && question && question_type1) {

        $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "#fff",
          opacity: 0.7
        }).appendTo($("#abcd"));
        $("input.custom-control-input").attr("disabled", true);

        let form = new FormData();
        form.append("question", JSON.stringify(newQuestion));
        form.append("question_img", question_img);
        form.append("solution_img", solution_img);
        form.append("hint_img", hint_img);
        form.append("option1_img", option1_img);
        form.append("option2_img", option2_img);
        form.append("option3_img", option3_img);
        form.append("option4_img", option4_img);
        form.append("option5_img", option5_img);
        form.append("question_id", questionId);

        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editObjectiveQuestion',
          type: 'POST',
          dataType: 'json',
          data: form,
          contentType: false,
          processData: false,
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result1) {

            if (result1.status == 200) {

              if (question_type1 != newQuestion.question_type) {
                // alert(question_type1);
                let form1 = new FormData();
                form1.append("question_id", newQuestion.id);
                form1.append("type", question_type1);

                $.ajax({
                  url: 'https://stagingfacultypython.edwisely.com/questions/updateFacultyAddedObjectiveQuestions',
                  type: 'POST',
                  dataType: 'json',
                  data: form1,
                  contentType: false,
                  processData: false,
                  headers: {
                    'Authorization': `Bearer ${$user.token}`
                  },
                  success: function (result) {
                    if (result.status == 200 || result.status == 400) {
                      $('#successToastBody').text("Question updated Successfully");
                      $('#successToast').toast('show');
                      $('#loadingDiv').remove();
                      $("input.custom-control-input").attr("disabled", false);
                      clearAll(true);
                      $("#addquesDiv").empty();
                      const foundIndex = questions.findIndex(x => x.id == questionId);
                      questions[foundIndex].question_type = question_type1;
                      questions[foundIndex] = result1.data;
                      loadList();

                      if (tId == "0" && sId != "0") {
                        setInterval(function () {
                          window.location.href = 'courseDetails.html?id=' + sId + '&uid=' + unit_id;
                        }, 2000);
                      }

                    }
                  },
                  error: function (error) {
                    $('#loadingDiv').remove();
                    $("input.custom-control-input").attr("disabled", false);
                    alert("Request Failed with status: " + error.status);
                  }
                });

              }
              else {
                $('#successToastBody').text(result1.message);
                $('#successToast').toast('show');
                $('#loadingDiv').remove();
                $("input.custom-control-input").attr("disabled", false);
                clearAll(true);
                $("#addquesDiv").empty();
                const foundIndex = questions.findIndex(x => x.id == questionId);
                questions[foundIndex] = result1.data;
                console.log(JSON.stringify(questions[foundIndex]));
                loadList();

                if (tId == "0" && sId != "0") {
                  setInterval(function () {
                    window.location.href = 'courseDetails.html?id=' + sId + '&uid=' + unit_id;
                  }, 2000);
                }

              }
            }
            else {
              $('#loadingDiv').remove();
              $('#errorToastBody').text(result.message);
              $('#errorToast').toast('show');
              $("input.custom-control-input").attr("disabled", false);
            }
          },
          error: function (error) {
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
            $("#addquesDiv").empty();
            alert("Request Failed with status: " + error.status);
          },
          error: function (error) {
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
            alert("Request Failed with status: " + error.status);
          }
        });
      }
      else {
        if (topics == null || !topics || topics.length == "0")
          $('#errorToastBody').text("Please Select Topics");
        else if (newOptions.length <= 1)
          $('#errorToastBody').text("2 Options are Mandatory");
        else if (!bloom_level)
          $('#errorToastBody').text("Please Select Bloom Level value");
        else if (!question)
          $('#errorToastBody').text("Please enter Question");
        else if (!type)
          $('#errorToastBody').text("Please Select Public or Private");
        else if (!answer)
          $('#errorToastBody').text("Please Select an Option as Answer");
        else if (!source)
          $('#errorToastBody').text("Please Enter Source");
        else if (topics != null && newOptions.length >= 2 && bloom_level && difficulty_level
          && answer && question && type)
          $('#errorToastBody').text("Some fields are mandatory");
        $('#errorToast').toast('show');
      }

    }

  });

});
