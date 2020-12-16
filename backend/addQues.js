$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }
  // alert(`${$user.token}`);

  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = "0";
  let tId = "0";
  let unit_id = "0";
  let tname = "";
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }
  if (searchParams.has('tname')) {
    tname = searchParams.get('tname');
    if(tname)
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


  //initially hiding the hint and solution divs
  $('#hintDiv').hide()
  $('#solutionDiv').hide()
  $('#fifth').hide()

  //hiding edit btn
  $('#editBtn').hide();
  $('#addNewBtn').hide();

  //on click of hint btn
  $('#hintBtn').on('click', function () {
    $('#hintDiv').show()
  })

  //on click of solution btn
  $('#solutionBtn').on('click', function () {
    $('#solutionDiv').show();
  })

  //onclick of add option btn
  $('.fifthOptionBtn').on('click', function () {
    $('.fifthOptionBtn').hide();
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


  getTopics();

  function getTopics() {

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectTopics?subject_id=' + subSemId + '&university_degree_department_id=' + `${$user.university_degree_department_id}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        // alert(result.status);
        //alert(subSemId)

        $('#topicTags').empty();
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {
            // alert(value);

            $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + value.id + "' data-type='" + value.type + "'data-id='" + value.id + "' name='topicTagAdd' id='topicTagAdd" + value.id + "'/><label for='topicTagAdd" + value.id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.name + "</label></li>");

          });
        }
        else {
          $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  let questionsList = [];
  let questions = [];

  refreshQuestions();

  function refreshQuestions() {
    // alert("refresh");
    questions = [];
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestQuestions?test_id=' + tId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        // alert(result.message);

        if (result.status == 200 && result.data) {
          $('.initData').remove();

          $.each(result.data, function (key, value) {
            // alert(value);
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


  function loadList() {
    // alert(JSON.stringify(questions));
    $("#addquesDiv").empty();

    $.each(questions, function (key, value) {
      // alert(JSON.stringify(value));
      $('#addquesDiv').append(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' data-id='` + value.id + `'>` + value.name.replace('<pre>', '') + `</p></div>`);
    });
  }


  // radios for selecting
  $('.tick').hide()


  $('.radiostest').on('click', function () {
    // alert("here");
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
  })



   //displaying ques image 
  function readURLques(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#image_preview_ques').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#quesImage").change(function () {
    readURLques(this);
    //changing styles
    $('.uploadedques').show()
    $('.imgPreviewques').show()
    $('.notUploadedques').hide()
    $('#quesLabel').hide()
  });


  //displaying hint image
  function readURLhint(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#image_preview_hint').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#hintImage").change(function () {
    readURLhint(this);
    $('.uploadedhint').show()
    $('.imgPreviewhint').show()
    $('.notUploadedhint').hide()
    $('#hintLabel').hide()
  });



  //displaying solution image
  function readURLsolution(input) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        $('#image_preview_solution').attr('src', e.target.result);
      }

      reader.readAsDataURL(input.files[0]);
    }
  }

  $("#solutionImage").change(function () {
    readURLsolution(this);
    $('.uploadedsolution').show()
    $('.imgPreviewsolution').show()
    $('.notUploadedsolution').hide()
    $('#solutionLabel').hide()
  });

  //on click of delete image changing the styling again
  $('.uploadedques').on('click', function () {
    $('.uploadedques').hide()
    $('.notUploadedques').show()
    $('.imgPreviewques').hide()
    $('#quesImage').val('')
    $('#quesLabel').show()
    question_img = "";
    question_img_url = "";
  })

  $('.uploadedhint').on('click', function () {
    $('.uploadedhint').hide()
    $('.notUploadedhint').show()
    $('.imgPreviewhint').hide()
    $('#hintImage').val('')
    $('#hintLabel').show()
    hint_img = "";
    hint_img_url = "";
  })

  $('.uploadedsolution').on('click', function () {
    $('.uploadedsolution').hide()
    $('.notUploadedsolution').show()
    $('.imgPreviewsolution').hide()
    $('#solutionImage').val('')
    $('#solutionLabel').show()
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
    //question_img = $('#quesImage').val()
    question_img = $("#quesImage")[0].files[0];

  })
  $('#hintImage').on('change', function () {
    // hint_img = $('#hintImage').val()
    hint_img = $("#hintImage")[0].files[0];

  })
  $('#solutionImage').on('change', function () {
    // solution_img = $('#solutionImage').val()
    solution_img = $("#solutionImage")[0].files[0];

  })
  $('#opt1Image').on('change', function () {
    // option1_img = $('#opt1Image').val()
    option1_img = $("#opt1Image")[0].files[0];
    readURLOption(this,"1");
    $('#uploadedoption1').show()
    $('#notUploadedoption1').hide()
    $('#option1ImagePreview').show()

  })
  $('#opt2Image').on('change', function () {
    // option2_img = $('#opt2Image').val()
    option2_img = $("#opt2Image")[0].files[0];
    readURLOption(this,"2");
    $('#uploadedoption2').show()
    $('#notUploadedoption2').hide()
    $('#option2ImagePreview').show()

  })
  $('#opt3Image').on('change', function () {
    // option3_img = $('#opt3Image').val()
    option3_img = $("#opt3Image")[0].files[0];
    readURLOption(this,"3");
    $('#uploadedoption3').show()
    $('#notUploadedoption3').hide()
    $('#option3ImagePreview').show()

  })
  $('#opt4Image').on('change', function () {
    // option4_img = $('#opt4Image').val()
    option4_img = $("#opt4Image")[0].files[0];
    readURLOption(this,"4");
    $('#notUploadedoption4').hide();
    $('#uploadedoption4').show();
    $('#option4ImagePreview').show();
  })
  $('#opt5Image').on('change', function () {
    option5_img = $('#opt5Image')[0].files[0]
    readURLOption(this,"5");
    $('#uploadedoption5').show()
    $('#notUploadedoption5').hide()
    $('#option5ImagePreview').show()
  })


  function readURLOption(input,optionNo) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();

      reader.onload = function (e) {
        switch(optionNo){
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
          default:
            $('#image_preview_option5').attr('src', e.target.result);
            break;
        }
      }

      reader.readAsDataURL(input.files[0]);
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
    // alert('here');
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


  let type = 'public';

  $('#customSwitch1').on('click', function () {
    // alert("gere");
    if ($("input[name='public_pvt']:checked").val() === 'public') {
      type = "public"
    } else {
      type = "private"
    }
  });

  let answer = ''
  $('input[name=Radios]').on('change', function () {
    answer = $('input[name=Radios]:checked').val();
    // alert(answer);
  })

  // //to select multiple values of selected checkboxes

  $(document).on('click', '.topicTagsInput', function () {

    let value = $(this).data('type');

    // let type = value.charAt(0) + value.charAt(1).toUpperCase() + value.slice(2);

    if (!topics.includes(value)) {
      topics.push({ "id": parseInt($(this).val()), "type": value });
    }

    if ($(this).prop('checked') == false) {
      topics = $.grep(topics, function (e) {
        return e.id != $(this).val();
      });
    }

    // alert(JSON.stringify(topics));

  });

  //on click of + btn(post request)

  $('#plusBtn').on('click', function () {

    bloom_level = $('#selectBloomLevel').val();
    difficulty_level = $('#selectLevel').val();

    if (topics != null && topics.length > 0 && option1 && option2 && bloom_level && difficulty_level && source && answer && question && answer && type) {


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

      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }

      $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
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
          // alert(result.message);

          if (result.status == 200) {
            // console.log(result.data)
            $('#loadingDiv').remove();
            // $('#abcd').css('position', 'absolute');
            $('#successToastBody').text('Question Added to Database Successfully');
            $('#successToast').toast('show');
            $('#addquesDiv').append(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' data-id='` + result.data.id + `'>` + result.data.name + `</p></div>`)
            questionsList.push(result.data.id);
            questions.push(result.data);
            $("input.custom-control-input").attr("disabled", false);
            clearAll();

            // if (unit_id != "0") {
            //   setInterval(function () {
            //     window.location.replace('myAssessment.html');
            //   }, 1500)
            // }
          }
          else {
            $('#loadingDiv').remove();
            // $('#abcd').css('position', 'absolute');
            $("input.custom-control-input").attr("disabled", false);
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          // $('#abcd').css('position', 'absolute');
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      // alert(topics.length);
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

  function clearAll() {
    // alert('clearAll');
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
    $('#hintInput').val("");
    $('#hintInput').val("");
    if ($("input[name='public_pvt']:checked").val() != 'public') {
      $('#customSwitch1').click();
    }
    $('#solutionDiv').hide();
    $('#hintDiv').hide();

    $('#uploadedoption1').click();
    $('#uploadedoption2').click();
    $('#uploadedoption3').click();
    $('#uploadedoption4').click();
    $('#uploadedoption5').click();
    
    $('#fifth').hide();
    $('.fifthOptionBtn').show();

    $('#deleteBtn').hide();
    $('#editBtn').hide();
    $('#addNewBtn').hide();
    $('#addNewBtnTopics').hide();
    $('#plusBtn').show();


    $('.uploadedques').click();
    $('.uploadedhint').click();
    $('.uploadedsolution').click();

    getTopics();

  }


  $("#btnSave").click(function () {
    if (questionsList != null && questionsList.length > 0 && tId != "0") {
      // alert(JSON.stringify(questionsList));

      $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "#fff",
        opacity: 0.7
      }).appendTo($("#abcd"));
      $("input.custom-control-input").attr("disabled", true);

      let form = new FormData();
      form.append("test_id", tId);
      form.append("questions", "[" + questionsList + "]");
      form.append("units", "[" + unit_id + "]");

      // for (var key of form.entries()) {
      //   alert(key[1]);
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
          // alert(result.message);

          if (result.status == 200) {
            $('#successToastBody').text(result.message);
            $('#successToast').toast('show');
            $('#loadingDiv').remove();
            // $('#abcd').css('position','absolute');
            $("input.custom-control-input").attr("disabled", false);
            setInterval(function () {
              window.location.replace('myAssessment.html');
            }, 2000);
          }
          else {
            $('#loadingDiv').remove();
            // $('#abcd').css('position','absolute');
            $("input.custom-control-input").attr("disabled", false);
            alert(result.message);
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          // $('#abcd').css('position','absolute');
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });


    }
    else if (tId == "0") {
      $('#errorToastBody').text("No test found to add question");
      $('#errorToast').toast('show');
    }
  });

  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setInterval(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 7000);
  });


  //clicking questions
  $(document).on('click', '.questions', function () {
    $('#deleteBtn').show();
    $('#plusBtn').hide();
    $('#editBtn').show();
    $('#addNewBtn').show();
    $('#quesInput').val($(this).text());

    let questionId = $(this).data('id');
    $('#questionId').val(questionId);
    // alert($('#questionId').val());

    //i have question id
    //now using that id, iterate through the questions array questions and find the match the ques.
    //fill uske options in the options inputs.

    $.each(questions, function (key, value) {
      // alert(questionId);
      if (questionId == value.id) {
        console.log(value);
        
        $('#addsoln').show();
        $('#topicsDiv').hide();

        let question_type1 = value.question_type;

        if(value.question_type){

          if(value.question_type == 'private'){
            if ($("input[name='public_pvt']:checked").val() === 'public') {
              $('#customSwitch1').click();
            }
          }
          else if(value.question_type == 'public'){
            // alert("here");
            if ($("input[name='public_pvt']:checked").val() != 'public') {
              // alert("here");
              $('#customSwitch1').click();
            }
          }

        }
        else{
          $('#addsoln').hide();
          $('#topicsDiv').show();
          $('#topicsDiv').empty();
          $('#topicsDiv').append("<p class='font-weight-bold'>Topics</p>");
        }

        $('#firstOption').val(value.questions_options[0].name);
        $('#secondOption').val(value.questions_options[1].name);

        if (value.questions_options[2])
          $('#thirdOption').val(value.questions_options[2].name);
        if (value.questions_options[3])
          $('#fourthOption').val(value.questions_options[3].name);
        if (value.questions_options[4]) {
          $(".fifthOptionBtn").click();
          $('#fifthOption').val(value.questions_options[4].name);
        }

        if (value.source) {
          $('#sourceInput').val(value.solution);
        }

        if (value.solution) {
          $('#solutionDiv').show();
          $('#solutionInput').val(value.solution);
        }

        if (value.hint) {
          $('#hintDiv').show();
          $('#hintInput').val(value.hint);
        }

        if (value.blooms_level) {
          $('#selectBloomLevel').val(value.blooms_level);
        }

        // if(value.blooms_level){
        //   $('#selectLevel').val(value.blooms_level);
        // }

        $.each(value.topics_details, function (key, value) {
          // alert($('#topicTagAdd13779').attr('class'));
          if(question_type1){
            $('#topicTagAdd'+value.id).click();
          }
          else{
            $('#topicsDiv').append("<span class='badge badge-pill'>"+value.id+"</span><br>");
            $('#topicsDiv').append("<button class='btn btn-primary btn-block mt-3 p-1 py-0 shadow-sm font-weight-bold' id='addNewBtnTopics'>Add New</button");
          }
        });

        if(value.question_img && value.question_img != null && value.question_img != " "){
          // alert('here');
          $('.uploadedques').show()
          $('.imgPreviewques').show()
          $('.notUploadedques').hide()
          $('#quesLabel').hide()
          $('#image_preview_ques').attr('src',value.question_img);
          question_img_url = value.question_img;
        }

        if(value.hint_image && value.hint_image != null){
          // alert('here1');
          $('#hintDiv').show();
          $('.uploadedhint').show()
          $('.imgPreviewhint').show()
          $('.notUploadedhint').hide()
          $('#hintLabel').hide()
          $('#image_preview_hint').attr('src',value.hint_image);
          hint_img_url = value.hint_image;
        }

        if(value.solution_image && value.solution_image != null){
          // alert('here2');
          $('#solutionDiv').show();
          $('.uploadedsolution').show()
          $('.imgPreviewsolution').show()
          $('.notUploadedsolution').hide()
          $('#solutionLabel').hide()
          $('#image_preview_solution').attr('src',value.solution_image);
          solution_img_url = value.solution_image;
        }

        if(value.questions_options[0].option_img){
          option1_img_url = value.questions_options[0].option_img;
          $('#uploadedoption1').show();
          $('#notUploadedoption1').hide();
          $('#option1ImagePreview').show();
          $('#image_preview_option1').attr('src', option1_img_url);
        }

        if(value.questions_options[1].option_img){
          option2_img_url = value.questions_options[1].option_img;
          $('#uploadedoption2').show();
          $('#notUploadedoption2').hide();
          $('#option2ImagePreview').show();
          $('#image_preview_option2').attr('src', option2_img_url);
        }

        if(value.questions_options[2] && value.questions_options[2].option_img){
          option3_img_url = value.questions_options[2].option_img;
          $('#uploadedoption3').show();
          $('#notUploadedoption3').hide();
          $('#option3ImagePreview').show();
          $('#image_preview_option3').attr('src', option3_img_url);
        }

        if(value.questions_options[3] && value.questions_options[3].option_img){
          option4_img_url = value.questions_options[3].option_img;
          $('#uploadedoption4').show();
          $('#notUploadedoption4').hide();
          $('#option4ImagePreview').show();
          $('#image_preview_option4').attr('src', option4_img_url);
        }

        if(value.questions_options[4] && value.questions_options[4].option_img){
          option5_img_url = value.questions_options[4].option_img;
          $('#uploadedoption5').show();
          $('#notUploadedoption5').hide();
          $('#option5ImagePreview').show();
          $('#image_preview_option5').attr('src', option5_img_url);
        }



        if (value.questions_options[0].is_answer == "1") {
          // alert("here");
          $("input[name='Radios'][value='0']").prop("checked", true);
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
          // $("input[name=Radios][value=0]").attr("checked",true);
        }
        else if (value.questions_options[1].is_answer == "1") {
          $("input[name='Radios'][value='1']").prop("checked", true);
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
        }
        else if (value.questions_options[2] && value.questions_options[2].is_answer == "1") {
          $("input[name='Radios'][value='2']").prop("checked", true);
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
        }
        else if (value.questions_options[3] && value.questions_options[3].is_answer == "1") {
          $("input[name='Radios'][value='3']").prop("checked", true);
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
        }
        else if (value.questions_options[4] && value.questions_options[4].is_answer == "1") {
          // $('.fifthOptionBtn').click();
          $("input[name='Radios'][value='4']").prop("checked", true);
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
        }
      }
    });

  });



  //delete btn
  $("#deleteBtn").click(function () {

    let questionId = $('#questionId').val()
    // alert(questionId);

    if (questionId && questionId != "0") {

      questions = $.grep(questions, function (e) {
        return e.id != questionId;
      });

      questionsList.splice($.inArray("abc", questionsList), 1);

      loadList();
      clearAll();

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
    $('#addNewBtnTopics').hide();

    clearAll();

  });

  $(document).on('click', '#addNewBtnTopics', function () {
    $('#questionId').val("0");
    $('#addsoln').show();
    $('#topicsDiv').hide();
    $('#deleteBtn').hide();
    $('#plusBtn').show();
    $('#editBtn').hide();
    $('#addNewBtn').hide();
    $('#addNewBtnTopics').hide();

    clearAll();
  });

  $("#editBtn").click(function () {

    let questionId = $('#questionId').val()
    // alert(questionId);
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
        newQuestion.name = $('#quesInput').val();
        if(topics.length > 0)
          newQuestion.topics_details = topics;
        newQuestion.solution = $('#solutionInput').val();

        // alert(question_img_url);

        if(newQuestion.question_img && !question_img_url)
          newQuestion.question_img = "";

        if(newQuestion.solution_image && !solution_img_url)
          newQuestion.solution_image = "";

        if(newQuestion.hint_image && !solution_img_url)
          newQuestion.hint_image = "";  

        // newQuestion.question_type = type;
        // console.log(JSON.stringify(newOptions));

        let question_type1 = $("input[name='public_pvt']:checked").val();
        if(!question_type1)
          question_type1 = "private";
        

        let form = new FormData();
        form.append("question", JSON.stringify(newQuestion));
        form.append("question_img", question_img);
        form.append("solution_img", solution_img);
        form.append("hint_img", hint_img);
        // $("#courseName").text(JSON.stringify(newOptions));

        // for (var key of form.entries()) {
        //   alert(key[1]);
        // }

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
          success: function (result) {
            // alert(result.message);

            if (result.status == 200) {

              //setting new options

                let isNewOption3 = false;
                let isNewOption4 = false;
                let isNewOption5 = false;

                newOptions[0].name = option1;
                newOptions[1].name = option2;

                if(newOptions[2]) newOptions[2].name = option3;
                if(newOptions[5]) newOptions[3].name = option4;
                if(newOptions[4]) newOptions[4].name = option4;

                if(newOptions[0].option_img && !option1_img_url)
                  newOptions[0].option_img = "";

                if(newOptions[1].option_img && !option2_img_url)
                  newOptions[1].option_img = "";

                if(newOptions[2] && newOptions[2].option_img && !option3_img_url)
                  newOptions[2].option_img = "";

                if(newOptions[3] && newOptions[3].option_img && !option4_img_url)
                  newOptions[3].option_img = "";

                if(newOptions[4] && newOptions[3].option_img && !option5_img_url)
                  newOptions[4].option_img = "";

                let form2 = new FormData();
                form2.append("question_id",newQuestion.id);
                form2.append("options", JSON.stringify(newOptions));
                form2.append("option1_img", option1_img);
                form2.append("option2_img", option2_img);
                form2.append("option3_img", option3_img);
                form2.append("option4_img", option4_img);
                form2.append("option5_img", option5_img);

                // for (var key of form2.entries()) {
                //   alert(key[1]);
                // }

                $.ajax({
                  url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editObjectiveQuestionOption',
                  type: 'POST',
                  dataType: 'json',
                  data: form2,
                  contentType: false,
                  processData: false,
                  headers: {
                    'Authorization': `Bearer ${$user.token}`
                  },
                  success: function (result) {
                    // alert(result.status);
                    // alert(result.message);
                    if (result.status != 200){
                      // alert(result.message);

                      if(!newOptions[2] && (option3 || option3_img)){
                        let isAnswer = 0;
                        if(answer == "2") isAnswer = 1;
                        addNewOption(option3_img,newQuestion.id,option3,isAnswer);
                      }
      
                      if(!newOptions[3] && (option4 || option4_img)){
                        let isAnswer = 0;
                        if(answer == "3") isAnswer = 1;
                        addNewOption(option3_img,newQuestion.id,option3,isAnswer);
                      }
      
                      if(!newOptions[4] && (option5 || option5_img)){
                        let isAnswer = 0;
                        if(answer == "4") isAnswer = 1;
                        addNewOption(option3_img,newQuestion.id,option3,isAnswer);
                      }

                    }
                  },
                  error: function (error) {
                    $('#loadingDiv').remove();
                    // $('#abcd').css('position','absolute');
                    $("input.custom-control-input").attr("disabled", false);
                    alert("Request Failed with status: " + error.status);
                  }
                });


              if(question_type1 != newQuestion.question_type){
                // alert("here");
                let form1 = new FormData();
                form1.append("question_id",newQuestion.id);
                form1.append("type",question_type1);

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
                    // alert(result.message);
                    if (result.status == 200 || result.status == 400) {
                      // alert("here1");
                      $('#successToastBody').text("Question updated Successfully");
                      $('#successToast').toast('show');
                      $('#loadingDiv').remove();
                      // $('#abcd').css('position','absolute');
                      $("input.custom-control-input").attr("disabled", false);
                      clearAll();
                      $("#addquesDiv").empty();
                      refreshQuestions();
                    }
                  },
                  error: function (error) {
                    $('#loadingDiv').remove();
                    // $('#abcd').css('position','absolute');
                    $("input.custom-control-input").attr("disabled", false);
                    alert("Request Failed with status: " + error.status);
                  }
                });

              }
              else{

                $('#successToastBody').text(result.message);
                $('#successToast').toast('show');
                $('#loadingDiv').remove();
                // $('#abcd').css('position','absolute');
                $("input.custom-control-input").attr("disabled", false);
                clearAll();
                $("#addquesDiv").empty();
                refreshQuestions();

              }
            }
            else {
              $('#loadingDiv').remove();
              // $('#abcd').css('position','absolute');
              $("input.custom-control-input").attr("disabled", false);
              alert(result.message);
            }
          },
          error: function (error) {
            $('#loadingDiv').remove();
            // $('#abcd').css('position','absolute');
            $("input.custom-control-input").attr("disabled", false);
            clearAll();
            $("#addquesDiv").empty();
            refreshQuestions();
            alert("Request Failed with status: " + error.status);
        },
        error: function (error) {
          $('#loadingDiv').remove();
          // $('#abcd').css('position','absolute');
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });

    }

  });

  function addNewOption(option_img,questionId,name,isAnswer){

    let form = new FormData();
    form.append("option_img", option_img);
    form.append("question_id", questionId);
    form.append("name", name);
    form.append("is_answer", isAnswer);

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/addObjectiveQuestionOption',
      type: 'POST',
      dataType: 'json',
      data: form,
      contentType: false,
      processData: false,
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        // alert(result.message);

        if (result.status == 200 && result.option_id) {
          return true;
        }
        else{
          alert(result.message);
          return false;
        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });

  }

});
