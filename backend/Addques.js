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
  let subSemId = 0;
  let tId = 0;
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
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
  });




  //on click of delete image changing the styling again
  $('.uploadedques').on('click', function () {
    $('.uploadedques').hide()
    $('.notUploadedques').show()
    $('.imgPreviewques').hide()
    $('#quesImage').val('')
  })

  $('.uploadedhint').on('click', function () {
    $('.uploadedhint').hide()
    $('.notUploadedhint').show()
    $('.imgPreviewhint').hide()
    $('#hintImage').val('')
  })

  $('.uploadedsolution').on('click', function () {
    $('.uploadedsolution').hide()
    $('.notUploadedsolution').show()
    $('.imgPreviewsolution').hide()
    $('#solutionImage').val('')
  });

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

  loadList();
  let questionsList = [];
  let questions = [];


  function loadList() {

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
          $.each(result.data, function (key, value) {
            // alert(value);
            $('.initData').remove();
            $('#addques').append(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' data-id='` + value.id + `'>` + value.name + `</p></div>`)
            questionsList.push(value.id);
            questions.push(value);
          });

        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });


  }



  //get topics api

  $('#exampleModal').on('shown.bs.modal', function (event) {
    //let button = $(event.relatedTarget) // Button that triggered the modal

    //alert("hello")

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
        alert(result.message);
      }
    });


  });

  $('#exampleModal').on('hidden.bs.modal', function (event) {

  });



  // radios for selecting
  $('.tick').hide()


  $('.radiostest').on('change', function () {
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
  let bloom_level = ""
  let difficulty_level = ""
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

  $('#customSwitch1').on('change', function () {
    if ($("input[name='public_pvt']:checked").val() === 'public') {
      type = "public"
    } else {
      type = "private"
    }
  })

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
      topics.push({ "id": $(this).val(), "type": value });
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

    if (topics != null && option1 && option2 && bloom_level && difficulty_level && answer && question && type) {


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
          alert(result.message);
          //console.log('4') 
          options = []
          topics = []

          if (result.status == 200) {
            // console.log(result.data)
            $('#loadingDiv').remove();
            $('#abcd').css('position', 'absolute');
            $('#successToastBody').text('Question Added to Database Successfully');
            $('#successToast').toast('show');
            // $('.initData').remove();
            $('#addques').prepend(`<div class="addObjQuestions my-2 span-dept p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p class='questions' data-id='` + result.data.id + `'>` + result.data.name + `</p></div>`)
            questionsList.push(result.data.id);
            $("input.custom-control-input").attr("disabled", false);
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          $('#abcd').css('position', 'absolute');
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      alert("here");

    }

  });

  $("#btnSave").click(function () {
    if (questionsList != null && questionsList.length > 0) {
      alert(JSON.stringify(questionsList));

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
      form.append("units", "[]");

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
          }
          else {
            $('#loadingDiv').remove();
            // $('#abcd').css('position','absolute');
            $("input.custom-control-input").attr("disabled", false);
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

  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setInterval(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 5000);
  });


  //clicking questions
  $(document).on('click', '.questions', function () {
    $('#deleteBtn').show();
    $('#editBtn').show();
    $('#quesInput').val($(this).text());
    $('#questionId').val($(this).data('id'));

    //i have question id
    //now using that id, iterate through the questions array questions and find the match the ques.
    //fill uske options in the options inputs.

    for (i = 0; i < questions.length(); i++) {
      if ($(this).data('id') === questions[i].id) {
        $('#firstOption').val(questions[i].questions_options[0].name)
        $('#secondOption').val(questions[i].questions_options[1].name)
        $('#thirdOption').val(questions[i].questions_options[2].name)
        $('#fourthOption').val(questions[i].questions_options[3].name)
        $('#fifthOption').val(questions[i].questions_options[4].name)


      }
    }

  });



  //delete btn
  $("#deleteBtn").click(function () {

    let questionId = $('questionId').val();

    if (questionId && questionId != "0") {

    }

  });

});
