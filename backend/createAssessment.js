$(document).ready(function () {
  //alert("hello")
  $('#exampleModal').on('shown.bs.modal', function (event) {
    //let button = $(event.relatedTarget) // Button that triggered the modal


    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
      },
      success: function (result) {
        // alert(result.status);
        $('#courseTags').empty();
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {
            // alert(value);

            $('#courseTags').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='" + value.id + "' name='courseTagAdd' id='courseTagAdd" + value.name + "'/><label for='courseTagAdd" + value.name + "' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.name + "</label></li>");

          });

        }
        else {
          $('#courseTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert(result.message);
      }
    });

  })


  $('#createAssessmentBtn').on('click', function () {

    var title = $('#title-objective').val()
    var desc = $('#desc-objective').val()
    var subject = $("input[name='courseTagAdd']:checked").val();
    //var subject_id = 0


    //to get the subject id
    // $.ajax({
    //   url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    //   type: 'GET',
    //   contentType: 'application/json',
    //   headers: {
    //     'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
    //   },
    //   success: function (result) {
    //     // alert(result.status);
    //     if (result.status == 200 && result.data) {
    //       $.each(result.data, function (key, value) {

    //         //console.log(value.name)
    //         if (value.name == subject) {

    //           subject_id = value.id
    //         }
    //       });

    //     }
    //     else {
    //       subject_id = 0
    //     }


    //   },
    //   error: function (error) {
    //     alert(result.message);
    //   }
    // });




    //to make the post request


    //console.log('1')
    // alert("herer");
    if (title && desc && subject) {

      var form = new FormData();
      form.append("name", title);
      form.append("description", desc);
      form.append("subject_id", subject);


      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }


      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/createObjectiveTest',
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

          if (result.status == 200) {
            alert(result.message)
            window.location.href = "AddQuestionspage.html"
          }
        },
        error: function (error) {
          alert(result.message);
          //console.log('5')

        }
      });
    }

  })

})