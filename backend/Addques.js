$(document).ready(function () {

  let searchParams = new URLSearchParams(window.location.search);
  let subSemId;
  // let units = [];
  if (searchParams.has('subSemId')) {
    subSemId = searchParams.get('subSemId');
  }

  let university_degree_department_id = 71

  //initially hidin the hint and solution divs
  $('#hintDiv').hide()
  $('#solutionDiv').hide()
  $('#fifth').hide()


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
  })








  //get topics api

  $('#exampleModal').on('shown.bs.modal', function (event) {
    //let button = $(event.relatedTarget) // Button that triggered the modal

    //alert("hello")

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectTopics?subject_id=' + subSemId + '&university_degree_department_id=' + university_degree_department_id,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
      },
      success: function (result) {
        alert(result.status);
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


  })



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
  let bloom_level = 1
  let difficulty_level = 1
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





  let type = ''

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
    topics.push({ "id": $(this).val(), "type": $(this).data('type').charAt(0) + $(this).data('type').charAt(1).toUpperCase() + $(this).data('type').slice(2) });
  })





  //on click of + btn(post request)

  $('#plusBtn').on('click', function () {

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

    //making objects


    //  for (i = 0; i < options.length; i++) {
    //    options.push({ "id": topics[i].id, "type": topics[i].type })

    //  console.log(objects)

    //making the form

    //let question_img = $("#quesImage")[0].files[0];




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
    //   console.log(key[1]);
    // }


    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/addObjectiveQuestion',
      type: 'POST',
      dataType: 'json',
      data: form,
      contentType: false,
      processData: false,
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjc0MjYyMyIsImV4cCI6IjE2MDgwMzg2MjMifQ.74y5dyBOCgwbVs7gUDn2Nn_ZRGrQhUhwD_waW9ialJk'
      },
      success: function (result) {
        //alert(result.message);
        //console.log('4') 
        options = []
        topics = []
        alert(result.message)

        if (result.status == 200) {
          console.log(result.data)
          $('.initData').remove()
          $('#addques').prepend(`<div class="addObjQuestions mb-1"><ol class="questionsUl ml-0"><li class="questionsLi" id="${result.data.id}"> ${result.data.name}</li></ol></div>`)

        }
      },
      error: function (result) {
        alert(error);
        //console.log('5')

      }
    });

  })


})
