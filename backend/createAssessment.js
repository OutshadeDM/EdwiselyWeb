$(document).ready(function () {
  //alert("hello")
  $('#exampleModal').on('shown.bs.modal', function (event) {
    let button = $(event.relatedTarget) // Button that triggered the modal


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

            $('#courseTags').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='" + value.name + "' name='courseTagAdd' id='courseTagAdd" + value.name + "'/><label for='courseTagAdd" + value.name + "' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.name + "</label></li>");

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

})