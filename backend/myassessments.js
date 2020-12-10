$(document).ready(function () {
    // alert("ok");

  // $user = "";
	// if ($user = isLoggedIn()) {
  //   $('html').removeClass('d-none');
  //   alert("here");
  // }
  // else {
	// 	window.location.replace("login.html");
  // }
  // alert(JSON.stringify($user));

  let university_degree_department_id = "71";


  $('#createAssessmentBtn').on('click', function () {
    window.location.href = "createAssessment.html"
  })


  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
    },
    success: function (result) {
      // alert(result.status);
      $('#objective-assessments').empty();
      $('#objective-assessments').append("<option value='0'>All</option>");
      $('#subjective-assessments').empty();
      $('#subjective-assessments').append("<option value='0'>All</option>");
      $('#cond-ObjassessmentsSubject').empty();
      $('#cond-ObjassessmentsSubject').append("<option value='0' selected disabled>Filter Assessment By Subject</option>");
      
      if (result.status == 200 && result.data) {
        $.each(result.data, function (key, value) {
          // alert(value);

          $('#objective-assessments').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#subjective-assessments').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#cond-ObjassessmentsSubject').append("<option value=" + value.id + ">" + value.name + "</option>");

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
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#objectiveassessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {
              // alert("addQuestionsPage.html?id="+value.subject_id+"&tid="+value.id);

              $('#objectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><a class='btn editBtn' href='addQuestionsPage.html?id="+value.subject_id+"&tid="+value.id+"'><i class='fas fa-pen'></i></a><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
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
    else {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseObjectiveTests?subject_id=' + subject,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#objectiveassessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {
              alert("addQuestionsPage.html?id="+value.subject_id+"&tid="+value.id);

              $('#objectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><a class='btn editBtn' href='addQuestionsPage.html?id="+value.subject_id+"&tid="+value.id+"'><i class='fas fa-pen'></i></a><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
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
  // $(document).on('click', '.editBtn', function () {
  //   let subSemId = $(this).data('id');
  //   window.location.href = "AddQuestionspage.html?subSemId="+subSemId;
  // })


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

              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><a class='btn editBtn' href='addQuestionsPage.html?id='"+value.subject_id+"&tid="+value.id+"><i class='fas fa-pen'></i></a><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
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
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#subjectiveassessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              $('#subjectiveassessmentList').append(
                "<div class='col-sm-6 assessment'><div class='card mb-3 objCard text-left'>"+
                "<h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name +
                "</h5><a class='btn editBtn' href='addQuestionsPage.html?id='"+value.subject_id+"&tid="+value.id+"><i class='fas fa-pen'></i></a><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description +
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

  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getCourseDepartmentSections?university_degree_department_id='+university_degree_department_id,
    type: 'GET',
    contentType: 'application/json',
    headers: {
        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
    },
    success: function (result) {
        // alert(result.status);
        $('#cond-ObjassessmentsSection').empty();
        $('#cond-ObjassessmentsSection').append("<option value='0' selected disabled>Filter Assessment By Section</option>");
        if (result.status == 200) {
            $.each(result.data, function (key, value) {
                $('#cond-ObjassessmentsSection').append("<option value='"+value.id+"'>"+value.name+"</option>");
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

  $("#nav-cond-tab").click(function () {
    // getSubAssesments();
    $('#subjective-assessments').val("0");
    $('#objective-assessments').val("0");

    let condObjDate = $('#condObjDate').val();
    let condObjAssessmentsSection = $('#cond-ObjassessmentsSection').val();
    let condObjAssessmentsSubject = $('#cond-ObjassessmentsSubject').val();

    // alert(condObjAssessmentsSection);
    if(!condObjDate || condObjDate == null) condObjDate = "2020-06-01";
    // alert(condObjAssessmentsSubject);
  
    if(condObjDate && !condObjAssessmentsSection && !condObjAssessmentsSubject){

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getConductedObjectiveTests?from_date='+condObjDate,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              $('#condObjAssessmentList').append(
                "<div class='col-sm-6 assessment'>"+
                "<div class='card mb-3 objCard text-left'>"+
                "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>"+value.name+"</h5>"+
                "<p class='pl-3 condCardDesc'>"+value.description+"</p>"+
                "<div class='card-body pl-1 pb-0 align-bottom'>"+
                "<h6 class='font-weight-bold'>"+value.created_at+" - "+value.doe+"</h6>"+
                "</div>"+
                "<div class='px-3 text-muted card-footer'>"+
                "<div class='row'>"+
                "<div class='col-sm-4'>"+
                "Questions: <span class='font-weight-bold'>"+value.questions_count+"</span>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "Sent To: <span class='font-weight-bold'>"+value.students_count+"</span>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "Answered: <span class='font-weight-bold'>"+value.test_completed+"</span>"+
                "</div></div></div></div></div>"
              );
            });
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });

    }
    else if(condObjDate && !condObjAssessmentsSection && condObjAssessmentsSubject){

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseConductedObjectiveTests?subject_id='+condObjAssessmentsSubject,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              $('#condObjAssessmentList').append(
                "<div class='col-sm-6 assessment'>"+
                "<div class='card mb-3 objCard text-left'>"+
                "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>"+value.name+"</h5>"+
                "<p class='pl-3 condCardDesc'>"+value.description+"</p>"+
                "<div class='card-body pl-1 pb-0 align-bottom'>"+
                "<h6 class='font-weight-bold'>"+value.created_at+" - "+value.doe+"</h6>"+
                "</div>"+
                "<div class='px-3 text-muted card-footer'>"+
                "<div class='row'>"+
                "<div class='col-sm-4'>"+
                "Questions: <span class='font-weight-bold'>"+value.questions_count+"</span>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "Sent To: <span class='font-weight-bold'>"+value.students_count+"</span>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "Answered: <span class='font-weight-bold'>"+value.test_completed+"</span>"+
                "</div></div></div></div></div>"
              );
            });
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });

    }
    else if(condObjDate && condObjAssessmentsSection && !condObjAssessmentsSubject){

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedObjectiveTests?section_id='+condObjAssessmentsSection,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              $('#condObjAssessmentList').append(
                "<div class='col-sm-6 assessment'>"+
                "<div class='card mb-3 objCard text-left'>"+
                "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>"+value.name+"</h5>"+
                "<p class='pl-3 condCardDesc'>"+value.description+"</p>"+
                "<div class='card-body pl-1 pb-0 align-bottom'>"+
                "<h6 class='font-weight-bold'>"+value.created_at+" - "+value.doe+"</h6>"+
                "</div>"+
                "<div class='px-3 text-muted card-footer'>"+
                "<div class='row'>"+
                "<div class='col-sm-4'>"+
                "Questions: <span class='font-weight-bold'>"+value.questions_count+"</span>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "Sent To: <span class='font-weight-bold'>"+value.students_count+"</span>"+
                "</div>"+
                "<div class='col-sm-4'>"+
                "Answered: <span class='font-weight-bold'>"+value.test_completed+"</span>"+
                "</div></div></div></div></div>"
              );
            });
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });

    }
    else if(condObjDate && condObjAssessmentsSection && condObjAssessmentsSubject){

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedObjectiveTests?section_id='+condObjAssessmentsSection,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNzU4Mjk5NCIsImV4cCI6IjE2MDg4Nzg5OTQifQ.qhQ3en3nxGgCCha78273ZfJRLUV3ea_cB-GPcfRcl9k'
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              if(value.subject_id == condObjAssessmentsSubject){
                $('#condObjAssessmentList').append(
                  "<div class='col-sm-6 assessment'>"+
                  "<div class='card mb-3 objCard text-left'>"+
                  "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>"+value.name+"</h5>"+
                  "<p class='pl-3 condCardDesc'>"+value.description+"</p>"+
                  "<div class='card-body pl-1 pb-0 align-bottom'>"+
                  "<h6 class='font-weight-bold'>"+value.created_at+" - "+value.doe+"</h6>"+
                  "</div>"+
                  "<div class='px-3 text-muted card-footer'>"+
                  "<div class='row'>"+
                  "<div class='col-sm-4'>"+
                  "Questions: <span class='font-weight-bold'>"+value.questions_count+"</span>"+
                  "</div>"+
                  "<div class='col-sm-4'>"+
                  "Sent To: <span class='font-weight-bold'>"+value.students_count+"</span>"+
                  "</div>"+
                  "<div class='col-sm-4'>"+
                  "Answered: <span class='font-weight-bold'>"+value.test_completed+"</span>"+
                  "</div></div></div></div></div>"
                );
              }
            });
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
          alert(error);
        }
      });

    }

  });

  $('#cond-ObjassessmentsSection').change(function () {
    $('#nav-cond-tab').click();
  });

  $('#cond-ObjassessmentsSubject').change(function () {
    $('#nav-cond-tab').click();
  });



});