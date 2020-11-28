$(document).ready(function () {
  //   alert("ok");
  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTests',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
    },
    success: function (result) {
      // alert(result.status);
      $('#objectiveassessmentList').empty();
      if (result.status == 200) {
        $.each(result.data, function (key, value) {

          $('#objective-assessments').append("<option value=" + value.subject_id + ">" + value.subject_name + "</option>");


          if (value.questions_count)
            $('#objectiveassessmentList').append(
              "<div class='col-sm-6 assessment' data-subSemId='" + value.subject_id +
              "'><div class='card mb-3 text-left'><h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
              "</h5><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
              "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions:" + value.questions_count +
              "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'>Send</button></div></div>"
            );
          else
            $('#objectiveassessmentList').append(
              "<div class='col-sm-6 assessment' data-subSemId='" + value.subject_id +
              "'><div class='card mb-3 text-left'><h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
              "</h5><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
              "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions:" + value.questions_count +
              "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentAddBtn' data-target='AddQuestionsPage.html'>Add</button></div></div>"
            );
        });
      }
      else
        $('#objectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
    },
    error: function (error) {
      alert(result.message);
    }
  });


  //for send btn
  $(document).on('click', '#assignmentSendBtn', function () {
    alert("sent")
  });


  //for add btn
  $(document).on('click', '#assignmentAddBtn', function (event) {
    //alert("added")
    event.preventDefault();
    var url = $(this).data('target');
    location.replace(url);
  });




  //different  tab
  $("#nav-syllabus-tab").click(function () {
    // alert("The paragraph was clicked.");

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectiveTests',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
      },
      success: function (result) {
        // alert(result.status);
        $('#subjectiveassessmentList').empty();
        if (result.status == 200) {
          $.each(result.data, function (key, value) {

            $('#subjective-assessments').append("<option value=" + value.subject_id + ">" + value.subject_name + "</option>");


            if (value.questions_count)
              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment' data-subSemId='" + value.subject_id +
                "'><div class='card mb-3 text-left'><h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions:" + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn'>Send</button></div></div>"
              );
            else
              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment' data-subSemId='" + value.subject_id +
                "'><div class='card mb-3 text-left'><h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions:" + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn'>Add</button></div></div>"
              );
          });
        }
        else
          $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
      },
      error: function (error) {
        alert(result.message);
      }
    });

  });



});