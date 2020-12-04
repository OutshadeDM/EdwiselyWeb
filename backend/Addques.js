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
        //alert(result.status);
        //alert(subSemId)

        $('#topicTags').empty();
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {
            // alert(value);

            $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + value.id + "' name='topicTagAdd' id='topicTagAdd" + value.name + "'/><label for='topicTagAdd" + value.name + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.name + "</label></li>");

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









  //preparing for post api of questions




  let question = $('#quesInput').val()
  let hint = $('#hintInput').val()
  let solution = $('#solutionInput').val()
  let source = $('#sourceInput').val()
  let bloom_level = $('.bloomSelect').val()
  let difficulty_level = $('.levelSelect').val()
  let topics = []
  let field_type = 1
  let question_img
  let solution_img
  let hint_img
  let option1_img
  let option2_img
  let option3_img
  let option4_img
  let option5_img



  let options = []
  options.push($('#firstOption').val())
  options.push($('#secondOption').val())
  options.push($('#thirdOption').val())
  options.push($('#fourthOption').val())


  //window

  //let type = $("input[name='topicTagAdd']:checked").val();

  let type = ''
  if ($("#customSwitch1:checked")) {
    type = 'public'
  } else {
    type = 'private'
  }

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





  //on click of + btn(post request)






})







// //to select multiple values of selected checkboxes

// $("#merge_button").click(function(event){
//   event.preventDefault();
//   var searchIDs = $("#find-table input:checkbox:checked").map(function(){
//     return $(this).val();
//   }).get(); // <----
//   console.log(searchIDs);
// });




//// resetiing the input file
//
//$('#example-file').val('')
//