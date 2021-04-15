$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    $("#greetingNav").html($user.name);
  } else {
    window.location.replace("login.html");
  }

  const searchParams = new URLSearchParams(window.location.search);
  let tId = 0;
  if (searchParams.has('id')) {
    tId = searchParams.get('id')
    getTestDetails();
  }

  let uploaded_file = null

  function getTestDetails(){
    $.ajax({
      url: `https://stagingfacultypython.edwisely.com/assignment/getAssignmentDetails?assignment_id=${tId}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result)
        if (result.status == 200 && result.data) {
          $('#courseName').text(result.data.name);
          $('#title').val(result.data.name);
          $("#summernote").summernote("code",result.data.description);
          $("#summernote1").summernote("code",result.data.instructions);
          getSubjects(result.data.subject_id)
        }        
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  getSubjects(null);

  function getSubjects(subject_id) {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert(result);
        if (result.status == 200 && result.data) {
          $('#subject').empty();
          $.each(result.data, function (key, value) {
            $('#subject').append("<option value='" + value.id + "'>" + value.name + "</option>");
          });
          if (subject_id)
            $('#subject').val(subject_id);
        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  $('.assignmentFile').on('change', function () {
    uploaded_file = $(".assignmentFile")[0].files[0];
    console.log(uploaded_file)
    $('#uploadedFileName').text(uploaded_file.name)
  })


  $('#createAssignmentBtn').on('click', function () {

    const title = $('#title').val()
    const desc = $("#summernote").summernote("code").replace(/<\/?[^>]+(>|$)/g, "")
    const subject = $("#subject").find(":selected").val()
    const instructions = $("#summernote1").summernote("code").replace(/<\/?[^>]+(>|$)/g, "");

    // console.log(title,desc,subject,instructions,uploaded_file);

    if (title && desc && subject && instructions && uploaded_file) {
        const form = new FormData();
        form.append("name", title);
        form.append("description", desc);
        form.append("subject_id",subject);
        form.append("file",uploaded_file);
        form.append("instructions",instructions);

        // for (var key of form.entries()) {
        //   console.log(key[1]);
        // }
        console.log(tId);

        if(!tId){
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
                // setTimeout(() => {
                //   window.location.href = "sendAssignment.html?id=" + result.test_id;
                // }, 2000)
              }
            },
            error: function (error) {
              alert("Request Failed with status: " + error.status);
            }
          });
        }
        else{
          console.log("edit")
          form.append("assignment_id",tId);
          $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/assignment/editAssignment',
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
                  text: "Successfully updated the Test",
                  autoclose: true,
                  status: 'success',
                  autotimeout: 3000
                });
                // setTimeout(() => {
                //   window.location.href = "sendAssignment.html?id=" + tId;
                // }, 2000)
              }
            },
            error: function (error) {
              alert("Request Failed with status: " + error.status);
            }
          });
        }
    }
    else {
      new Notify({
        title: 'Error',
        text: "All fields are mandatory",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }

  })

})