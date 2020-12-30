$(document).ready(function () {
  //alert("hello")

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }


  let searchParams = new URLSearchParams(window.location.search);
  let objective = false
  // let units = [];
  if (searchParams.has('isObj')) {
    objective = searchParams.get('isObj')
  }






  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${$user.token}`
    },
    success: function (result) {
      //alert(result.status);
      $('#courseTags').empty();
      if (result.status == 200 && result.data) {
        $.each(result.data, function (key, value) {
          // alert(value);

          $('#courseTags').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='" + value.id + "' data-name='" + value.name + "' name='courseTagAdd' id='courseTagAdd" + value.id + "'/><label for='courseTagAdd" + value.id + "' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.name + "</label></li>");

        });

      }
      else {
        $('#courseTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
        //alert("here");
      }


    },
    error: function (error) {
      alert("Request Failed with status: " + error.status);
    }
  });

  $('#exampleModal').on('hidden.bs.modal', function (event) {
    let courseTagAdd = $("input[name='courseTagAdd']:checked").val();
    // alert(courseTagAdd);
    if (courseTagAdd) $('#assessmentSub').text($('#courseTagAdd' + courseTagAdd).data('name'));
    // else $('#assessmentSub').text("Select a subject");

  })

  $(document).on('click', '.courseTagsLi', function () {
    $('#exampleModal').modal('toggle');
  });


  $('#createAssessmentBtn').on('click', function () {

    var title = $('#title-objective').val()
    var desc = $('#desc-objective').val()
    var subject = $("input[name='courseTagAdd']:checked").val();
    //alert(objective)
    // alert(title)
    // alert(desc)
    // alert(subject)


    //to make the post request


    //console.log('1')
    // alert("herer");
    if (title && desc && subject) {

      //alert(objective)





      if (objective == 'true') {
        //alert(objective)
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
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            //alert(result.message);
            //console.log('4') 

            if (result.status == 200) {
              alert(result.message)
              window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id
            }
          },
          error: function (error) {
            alert("Request Failed with status: " + error.status);
          }
        });
      }
      if (objective == 'false') {
        var form = new FormData();
        form.append("name", title);
        form.append("description", desc);
        form.append("subject_id", subject);
        // for (var key of form.entries()) {
        //   alert(key[1]);
        // }
        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/createSubjectiveTest',
          type: 'POST',
          dataType: 'json',
          data: form,
          contentType: false,
          processData: false,
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            //alert(result.message);
            //console.log('4') 

            if (result.status == 200) {
              alert(result.message)
              window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id
            }
          },
          error: function (error) {
            alert("Request Failed with status: " + error.status);
          }
        });
      }


    }

  })

})