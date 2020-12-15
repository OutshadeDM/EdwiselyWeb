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
  let unit_id = "";
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }

  //alert(subSemId)
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
})

let topics = []



$(document).on('click', '.topicTagsInput', function () {

  let value = $(this).data('type');
  //alert(value)

  // let type = value.charAt(0) + value.charAt(1).toUpperCase() + value.slice(2);

  if (!topics.includes(value)) {
    //alert($(this).val())
    topics.push({ "id": $(this).val(), "type": value });
  }

  if ($(this).prop('checked') == false) {
    topics = $.grep(topics, function (e) {
      return e.id != $(this).val();
    });
  }

  //alert(JSON.stringify(topics));

});


let uploaded_question = ""


$('.quesUploadFile').on('change', function () {
  // uploaded_question = $('.quesUploadFile').val()
  uploaded_question = $(".quesUploadFile")[0].files[0];
  //console.log(uploaded_question)

})




// Upload api
$('#uploadBtn').on('click', function () {

  //alert("hello")

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
      alert(result.status);
      if (result.status == 200) {
        // $('#successToastBody').text('Questions Uploaded Successfully');
        // $('#successToast').toast('show');
        alert(result.message);
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



