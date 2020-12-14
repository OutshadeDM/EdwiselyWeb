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
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }

  // let university_degree_department_id = 71

  //initially hiding the hint and solution divs
  $('#hintDiv').hide()
  $('#solutionDiv').hide()
  $('#fifth').hide()

  //hiding edit btn
  $('#editBtn').hide()



  //on click of hint btn
  $('#hintBtn').on('click', function () {
    $('#hintDiv').show()
  })

  //on click of solution btn
  $('#solutionBtn').on('click', function () {
    $('#solutionDiv').show()
  })

  //onclick of add option btn
  $('.fifthOptionBtn').on('click', function () {
    $('.fifthOptionBtn').hide()
    $('#fifth').show()

  })

  //initially hide the uploaded fonticons and image
  $('.uploadedques').hide()
  $('.uploadedhint').hide()
  $('.uploadedsolution').hide()
  $('.imgPreviewques').hide()
  $('.imgPreviewhint').hide()
  $('.imgPreviewsolution').hide()




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
  })

  $('.uploadedhint').on('click', function () {
    $('.uploadedhint').hide()
    $('.notUploadedhint').show()
    $('.imgPreviewhint').hide()
    $('#hintImage').val('')
    $('#hintLabel').show()
  })

  $('.uploadedsolution').on('click', function () {
    $('.uploadedsolution').hide()
    $('.notUploadedsolution').show()
    $('.imgPreviewsolution').hide()
    $('#solutionImage').val('')
    $('#solutionLabel').show()
  });

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

  function refreshQuestions(){
    questions = [];
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestQuestions?test_id=' + tId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        // alert(result.status);

        // $('#topicTags').empty();
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

  })
  $('#opt2Image').on('change', function () {
    // option2_img = $('#opt2Image').val()
    option2_img = $("#opt2Image")[0].files[0];

  })
  $('#opt3Image').on('change', function () {
    // option3_img = $('#opt3Image').val()
    option3_img = $("#opt3Image")[0].files[0];

  })
  $('#opt4Image').on('change', function () {
    // option4_img = $('#opt4Image').val()
    option4_img = $("#opt4Image")[0].files[0];

  })
  $('#opt5Image').on('change', function () {
    option5_img = $('#opt5Image')[0].files[0]
  })





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
    answer = $('input[name=Radios]:checked').val()
  })



  // //to select multiple values of selected checkboxes



  //alert("hello")

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


    // $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
    //   position: "absolute",
    //   width: "100%",
    //   height: "100%",
    //   background: "#fff",
    //   opacity: 0.7
    // }).appendTo($("#abcd").css('position','relative'));
    // $("input.custom-control-input").attr("disabled", true);

    // $("#abcd").css('display','none')

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
      //form.append("topics", JSON.stringify(topics, null, 1).replace(/^ +/gm, " ").replace(/\n/g, "").replace(/{ /g, "{").replace(/ }/g, "}").replace(/\[ /g, "[").replace(/ \]/g, "]"));
      //form.append("topics", JSON.stringify([{ "id": "13779", "type": "GTopic" }]))
      //form.append("topics", JSON.stringify([{ "id": "13779", "type": "Gtopic" }]))
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
          //console.log('4') 

          if (result.status == 200) {
            // console.log(result.data)
            $('#loadingDiv').remove();
            // $('#abcd').css('position', 'absolute');
            $('#successToastBody').text('Question Added to Database Successfully');
            $('#successToast').toast('show');
            // $('.initData').remove();
            $('#addquesDiv').prepend(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' data-id='` + result.data.id + `'>` + result.data.name + `</p></div>`)
            questionsList.push(result.data.id);
            $("input.custom-control-input").attr("disabled", false);
            clearAll();

            if(unit_id != "0"){
              setInterval(function(){
                window.location.replace('myAssessment.html');
              },2000)
            }
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
        $('#errorToastBody').text("Bloom and Diffculty values cannot be empty");
      else if (!question)
        $('#errorToastBody').text("Please enter Question");
      else if (!type)
        $('#errorToastBody').text("Please Select Public or Private");
      else if (!answer)
        $('#errorToastBody').text("Please Select a Option as Answer");
      else if (!source)
        $('#errorToastBody').text("Please Enter Source");
      else if (topics != null && option1 && option2 && bloom_level && difficulty_level && answer && question && type)
        $('#errorToastBody').text("Some fields are mandatory");
      $('#errorToast').toast('show');
    }

  });

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
    $('#customSwitch1').val("public");
    $('#hintInput').val("");
    $('#hintInput').val("");

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
          //console.log('4') 

          if (result.status == 200) {
            // console.log(result.data)
            $('#successToastBody').text(result.message);
            $('#successToast').toast('show');
            $('#loadingDiv').remove();
            // $('#abcd').css('position','absolute');
            $("input.custom-control-input").attr("disabled", false);
            setInterval(function(){
              window.location.replace('myAssessment.html');
            },2000);
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
    else if(tId == "0"){
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
        // alert(value.id)
        // alert(value.questions_options[0].name);
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

        $.each(value.topics_details,function(key, value){
          // alert($('#topicTagAdd13779').attr('class'));
          $('#topicTagAdd'+value.id).click();
        });



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
        else if (value.questions_options[2].is_answer == "1") {
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
        else if (value.questions_options[3].is_answer == "1") {
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
        else if (value.questions_options[4].is_answer == "1") {
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
    // alert("here");
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

  $("#editBtn").click(function () {

    let questionId = $('#questionId').val()
    // alert("here");
    // alert(questionId);
    let newQuestion = [];

    if (questionId && questionId != "0") {

      $.each(questions, function (key, value) {
        if (questionId == value.id) {
          newQuestion = value;
          return false;
        }
      });

      // alert(JSON.stringify(newQuestion));
      // alert(`${$user.user_id}`);
      // alert($('#quesInput').val());

      

        newQuestion.college_account_id = `${$user.user_id}`;
        newQuestion.hint = $('#hintInput').val();
        newQuestion.blooms_level = bloom_level;
        newQuestion.name = $('#quesInput').val();
        if(topics.length > 0)
          newQuestion.topics_details = topics;
        newQuestion.solution = $('#solutionInput').val();
        newQuestion.question_type = type;
        // console.log(JSON.stringify(newQuestion));
        

        let form = new FormData();
        form.append("question", JSON.stringify(newQuestion));
        form.append("question_img", question_img);
        form.append("solution_img", solution_img);
        form.append("hint_img", hint_img);
        // $("#courseName").text(JSON.stringify(newQuestion));

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
            alert(result.message);
            //console.log('4') 

            if (result.status == 200) {
              // console.log(result.data)
              $('#successToastBody').text(result.message);
              $('#successToast').toast('show');
              $('#loadingDiv').remove();
              // $('#abcd').css('position','absolute');
              $("input.custom-control-input").attr("disabled", false);
              clearAll();
              $("#addquesDiv").empty();
              refreshQuestions();
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


  });

});
