$(document).ready(function () {
  //   alert("ok");

  let university_degree_department_id = "71";


  $('#createAssessmentBtn').on('click', function () {
    window.location.href = "createAssessmentpage.html"
  })


  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
    },
    success: function (result) {
      // alert(result.status);
      $('#objective-assessments').empty();
      $('#objective-assessments').append("<option value='0'>All</option>");
      $('#subjective-assessments').empty();
      $('#subjective-assessments').append("<option value='0'>All</option>");
      $('#cond-assessmentsSubject').empty();
      $('#cond-assessmentsSubject').append("<option value='0' selected disabled>Filter Assessment By Subject</option>");
      
      if (result.status == 200 && result.data) {
        $.each(result.data, function (key, value) {
          // alert(value);

          $('#objective-assessments').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#subjective-assessments').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#cond-assessmentsSubject').append("<option value=" + value.id + ">" + value.name + "</option>");

        });

      }

    },
    error: function (error) {
      alert(error);
    }
  });

  getObjAssesments();


  $('#objective-assessments').change(function () {
    getObjAssesments();
  });

  function getObjAssesments(){
    $('#subjective-assessments').val("0");
    let subject = $('#objective-assessments').val()
    // alert(subject)

    if (subject == 0) {
      // alert("here");

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

              if (value.questions_count)
                $('#objectiveassessmentList').append(
                  "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                  "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                  "</h5><button class='btn editBtn' data-id='" + value.subject_id +"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                  "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                  "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
                );
              else
                $('#objectiveassessmentList').append(
                  "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                  "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                  "</h5><button class='btn editBtn' data-id='" + value.subject_id +"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                  "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                  "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentAddBtn'><a href='../pages/AddQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Add</a></button></div></div>"
                );
            });
          }
          else
            $('#objectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });
    }
    else {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseObjectiveTests?subject_id=' + subject,
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

              if (value.questions_count)
                $('#objectiveassessmentList').append(
                  "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                  "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                  "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                  "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                  "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
                );
              else
              $('#objectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
              );
            });
          }
          else
            $('#objectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });

    }
  }


  //for send btn
  $(document).on('click', '#assignmentSendBtn', function () {
    //alert("sent")
  });


  //for add btn
  $(document).on('click', '#assignmentAddBtn', function () {
    //alert("added")
  });

  //for edit button
  $(document).on('click', '.editBtn', function () {
    let subSemId = $(this).data('id');
    window.location.href = "AddQuestionspage.html?subSemId="+subSemId;
  })


  //different  tab
  $("#nav-sub-tab").click(function () {
    getSubAssesments();
    $('#objective-assessments').val("0");
  });

  $('#subjective-assessments').change(function () {
    getSubAssesments();
  });

  function getSubAssesments(){
    let subject = $('#objective-assessments').val()
    // alert(subject)

    if (subject == "0") {
      // alert("here");

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
  
              if (value.questions_count)
                $('#subjectiveassessmentList').append(
                  "<div class='col-sm-6 assessment'><div class='card mb-3 text-left'>"+
                  "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                  "</h5><button class='btn editBtn' data-id='"+value.subSemId+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                  "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                  "<button class='btn btn-primary text-white pl-4 pr-4 assBtn'>Send</button></div></div>"
                );
              else
                $('#subjectiveassessmentList').append(
                  "<div class='col-sm-6 assessment'><div class='card mb-3 text-left'>"+
                  "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                  "</h5><button class='btn editBtn' data-id='"+value.subSemId+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                  "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
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
    }
    else {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseSubjectiveTests?subject_id=' + subject,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
        },
        success: function (result) {
          // alert(result.status);
          $('#subjectiveassessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              if (value.questions_count)
                $('#subjectiveassessmentList').append(
                  "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                  "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                  "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                  "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                  "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
                );
              else
              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
              );
            });
          }
          else
            $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });

    }
  }

  $('.input-group.date').datepicker({
    format: "yyyy-mm-dd",
    calendarWeeks: true,
    autoclose: true,
    todayHighlight: true
  });

  $("#nav-cond-tab").click(function () {
    // getSubAssesments();
    $('#subjective-assessments').val("0");
    $('#objective-assessments').val("0");

    let condDate = $('#condDate').val();
    let condAssessmentsSection = $('#cond-assessmentsSection').val();
    let condAssessmentsSubject = $('#cond-assessmentsSubject').val();

    // alert(condAssessmentsSection);
    if(!condDate || condDate == null) condDate = "2020-06-01";
    // alert(condAssessmentsSubject);


    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/getCourseDepartmentSections?university_degree_department_id='+university_degree_department_id,
      type: 'GET',
      contentType: 'application/json',
      headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
      },
      success: function (result) {
          // alert(result.status);
          $('#cond-assessmentsSection').empty();
          $('#cond-assessmentsSection').append("<option value='0' selected disabled>Filter Assessment By Section</option>");
          if (result.status == 200) {
              $.each(result.data, function (key, value) {
                  $('#cond-assessmentsSection').append("<option value='"+value.id+"'>"+value.name+"</option>");
              });
          }
          // else {
          //     alert(result.message + " Please Login again");
          //     window.location.href = "Loginpage.html";
          // }
      },
      error: function (error) {
          alert(error);
      }
  });
  
  if(condDate && !condAssessmentsSection && !condAssessmentsSubject){

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getConductedObjectiveTests?from_date='+condDate,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
      },
      success: function (result) {
        // alert(result.status);
        $('#subjectiveassessmentList').empty();
        if (result.status == 200) {
          $.each(result.data, function (key, value) {

            if (value.questions_count)
              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
              );
            else
            $('#subjectiveassessmentList').append(
              "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
              "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
              "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
              "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
              "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
            );
          });
        }
        else
          $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
      },
      error: function (error) {
        alert(error);
      }
    });

  }
  else if(condDate && !condAssessmentsSection && condAssessmentsSubject){

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseConductedObjectiveTests?subject_id='+condAssessmentsSubject,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
      },
      success: function (result) {
        // alert(result.status);
        $('#subjectiveassessmentList').empty();
        if (result.status == 200) {
          $.each(result.data, function (key, value) {

            if (value.questions_count)
              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
              );
            else
            $('#subjectiveassessmentList').append(
              "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
              "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
              "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
              "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
              "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
            );
          });
        }
        else
          $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
      },
      error: function (error) {
        alert(error);
      }
    });

  }
  else if(condDate && condAssessmentsSection && !condAssessmentsSubject){

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedObjectiveTests?section_id='+condAssessmentsSection,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
      },
      success: function (result) {
        // alert(result.status);
        $('#subjectiveassessmentList').empty();
        if (result.status == 200) {
          $.each(result.data, function (key, value) {

            if (value.questions_count)
              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
                "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
                "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
              );
            else
            $('#subjectiveassessmentList').append(
              "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
              "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
              "</h5><button class='btn editBtn' data-id='"+value.subject_id+"'><i class='fas fa-pen'></i></button><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
              "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions: " + value.questions_count +
              "<button class='btn btn-primary text-white pl-4 pr-4 assBtn' id='assignmentSendBtn'><a href='../pages/SendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btnLink'>Send</a></button></div></div>"
            );
          });
        }
        else
          $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
      },
      error: function (error) {
        alert(error);
      }
    });

  }



  });



});