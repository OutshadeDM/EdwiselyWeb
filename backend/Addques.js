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


  //on click of hint btn
  $('#hintBtn').on('click', function () {
    $('#hintDiv').show()
  })

  //on click of solution btn
  $('#solutionBtn').on('click', function () {
    $('#solutionDiv').show()
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




  let hint = $('#hintInput').val()




  let options = []
  options.push($('#firstOption').val())
  options.push($('#secondOption').val())
  options.push($('#thirdOption').val())
  options.push($('#fourthOption').val())


  //window

  //let type = $("input[name='courseTagAdd']:checked").val();

  let type = ''
  if ($("#customSwitch1:checked")) {
    type = 'public'
  } else {
    type = 'private'
  }

  // alert(type)


  //on click of + btn












})