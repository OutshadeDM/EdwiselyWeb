$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    $("#greetingNav").html($user.name);
  } else {
    window.location.replace("login.html");
  }


  let uploaded_file = null



  getSubjects(0)



  function getSubjects(subject_id) {
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
            $('#subject').append("<option value='" + value.id + "'>" + value.name + "</option>");
          });

        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  $('.quesUploadFile').on('change', function () {
    uploaded_file = $(".quesUploadFile")[0].files[0];
    console.log(uploaded_file.name)
    $('#uploadedFileName').text(uploaded_file.name + " has been selected")
  })


  $('#createAssignmentBtn').on('click', function () {

    const title = $('#title-objective').val()
    const desc = $("#summernote").summernote("code").replace(/<\/?[^>]+(>|$)/g, "")
    const subject = $("#subject").find(":selected").val()

    const section_name1 = $('#section_name1').val();
    const section_marks1 = $('#section_marks1').find(":selected").val();
    const instructions = $("#summernote1").summernote("code").replace(/<\/?[^>]+(>|$)/g, "");

    // console.log(title,desc,subject,section_name1,section_marks1,section_instr1);

    if (title && desc && subject && section_name1 && section_marks1) {

      if (objective == 'true') {
        const form = new FormData();
        form.append("name", title);
        form.append("description", desc);

        // for (var key of form.entries()) {
        //   console.log(key[1]);
        // }


        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/assignment/createAssignment',
          type: 'POST',
          dataType: 'json',
          data: form,
          contentType: false,
          processData: false,
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            console.log(result);
            if (result.status == 200) {
              new Notify({
                title: 'Success',
                text: "Successfully created the Test",
                autoclose: true,
                status: 'success',
                autotimeout: 3000
              });
              setTimeout(() => {
                window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id;
              }, 2000)
            }
          },
          error: function (error) {
            alert("Request Failed with status: " + error.status);
          }
        });

      }
      else if (objective == 'false') {
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
            alert(result.message);
            if (result.status == 200) {
              new Notify({
                title: 'Success',
                text: "Successfully created the Test",
                autoclose: true,
                status: 'success',
                autotimeout: 3000
              });
              setTimeout(() => {
                window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id + "&tname=" + result.name;
              }, 2000)
            }
          },
          error: function (error) {
            new Notify({
              title: 'Error',
              text: result.message,
              autoclose: true,
              status: 'error',
              autotimeout: 3000
            });
          }
        });
      }


    }
    else {
      new Notify({
        title: 'Error',
        text: "Fill all fields",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }

  })

})