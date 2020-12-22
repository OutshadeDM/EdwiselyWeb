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
  let tname = "";
  let unit_id = "";
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
    tname = searchParams.get('tname');
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }


  //setting the name of test
  $('#courseName').append(tname)



  // //alert(subSemId)
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


  let topics = []


  $(document).on('change', '.topicTagsInput', function (e) {
    //add Questions to a array which are selected

    (e.target.checked) ? topics.push({ "id": $(this).val(), "type": $(this).data('type') }) : (topics.splice(topics.indexOf({ "id": $(this).val(), "type": $(this).data('type') }), 1));
    console.log(JSON.stringify(topics))
  });



  let uploaded_question = ""


  $('.quesUploadFile').on('change', function () {
    // uploaded_question = $('.quesUploadFile').val()
    uploaded_question = $(".quesUploadFile")[0].files[0];
    //console.log(uploaded_question)

    // })
    alert("hello")



    // Upload api
    $('#uploadButton').on('click', function () {

      console.log("jndsi")
      alert("hello")

      var form = new FormData();
      form.append("files", uploaded_question);
      form.append("topics", JSON.stringify(topics));
      //alert(JSON.stringify(topics))
      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/uploadObjectiveQuestions',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          //alert(result.status);
          if (result.status == 200) {
            // $('#successToastBody').text('Questions Uploaded Successfully');
            // $('#successToast').toast('show');
            alert(result.message);
            window.location.href = "myAssessment.html"
          }
          else if (result.status == 500) {
            // $('#errorToastBody').text(result.message);
            // $('#errorToast').toast('show');
            alert(result.message);

          }
          else {
            // $('#errorToastBody').text('Request Unsuccessful');
            // $('#errorToast').toast('show');
            alert(result.message);
          }
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });


    })
  })


})