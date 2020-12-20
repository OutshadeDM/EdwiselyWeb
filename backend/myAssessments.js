$(document).ready(function () {
  // alert("ok");

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  // let university_degree_department_id = "71";


  $('#createAssessmentBtn').on('click', function () {
    window.location.href = "createAssessment.html"
  })


  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${$user.token}`
    },
    success: function (result) {
      // alert(result.status);
      $('#objective-assessments').empty();
      $('#objective-assessments').append("<option value='0'>All</option>");
      $('#subjective-assessments').empty();
      $('#subjective-assessments').append("<option value='0'>All</option>");
      $('#cond-ObjassessmentsSubject').empty();
      $('#cond-ObjassessmentsSubject').append("<option value='0' selected disabled>Filter Assessment By Subject</option>");
      $('#cond-SubassessmentsSubject').empty();
      $('#cond-SubassessmentsSubject').append("<option value='0' selected disabled>Filter Assessment By Subject</option>");

      if (result.status == 200 && result.data) {
        $.each(result.data, function (key, value) {
          // alert(value);

          $('#objective-assessments').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#subjective-assessments').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#cond-ObjassessmentsSubject').append("<option value=" + value.id + ">" + value.name + "</option>");
          $('#cond-SubassessmentsSubject').append("<option value=" + value.id + ">" + value.name + "</option>");
        });

      }

    },
    error: function (error) {
      alert("Request Failed with status: " + error.status);
    }
  });

  getObjAssesments();

  function clearSelections() {
    $('#objective-assessments').val("0");
    $('#subjective-assessments').val("0");
    $('#cond-ObjassessmentsSubject').val("0");
    $('#cond-ObjassessmentsSection').val("0");
    $('#condObjDate').val("");
    $('#cond-SubassessmentsSubject').val("0");
    $('#cond-SubassessmentsSection').val("0");
    $('#condSubDate').val("");
  }

  $("#nav-obj-tab").click(function () {
    clearSelections();
    getObjAssesments();
  });


  $('#objective-assessments').change(function () {
    getObjAssesments();
  });

  function getObjAssesments() {
    $('#subjective-assessments').val("0");
    $('#cond-ObjassessmentsSection').val("0");
    let subject = $('#objective-assessments').val()
    // alert(subject)

    if (subject == 0) {
      // alert("here");

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTests',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#objectiveassessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCards(result.data, true);
          }
          else
            $('#objectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseObjectiveTests?subject_id=' + subject,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#objectiveassessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCards(result.data, true);
          }
          else
            $('#objectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
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
    clearSelections();
    getSubAssesments();
  });

  $('#subjective-assessments').change(function () {
    getSubAssesments();
  });

  function getSubAssesments() {
    let subject = $('#objective-assessments').val()
    // alert(subject)

    if (subject == "0") {
      // alert("here");

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectiveTests',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#subjectiveassessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCards(result.data, false)
          }
          else
            $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
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
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#subjectiveassessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCards(result.data, false);

          }
          else
            $('#subjectiveassessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
  }

  function displayCards(data = [], isObj) {
    let div = "";

    $.each(data, function (key, value) {

      div = div + "<div class='col-sm-6 assessment'>";
      div = div + "<div class='card mb-3 objCard text-left'>";
      div = div + "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5>";
      div = div + "<a class='btn editBtn' href='addQuestionsPage.html?id=" + value.subject_id + "&tname="+value.name+"&tid=" + value.id + "'><i class='fas fa-pen'></i></a>";
      div = div + "<div class='card-body pl-0'>";
      div = div + "<p class='card-text pl-3'>" + value.description + "</p>";
      div = div + "</div>";
      div = div + "<div class='p-1 pl-3 pr-3 text-muted card-footer'>";
      div = div + "Questions: " + value.questions_count;
      if (!value.questions_count)
        div = div + "<a href='../pages/addQuestionsPage.html?id=" + value.subject_id + "&tid=" + value.id + "&tname=" + value.name + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Add</a>";
      else
        div = div + "<a href='../pages/sendQuestionsPage.html?subSemId=" + value.subject_id + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Send</a>";
      div = div + "</div></div></div>";

    });

    if (isObj)
      $('#objectiveassessmentList').append(div);
    else if (!isObj)
      $('#subjectiveassessmentList').append(div)
  }

  
  
  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getCourseDepartmentSections?university_degree_department_id=' + `${$user.university_degree_department_id}`,
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${$user.token}`
    },
    success: function (result) {
      // alert(result.status);
      $('#cond-ObjassessmentsSection').empty();
      $('#cond-ObjassessmentsSection').append("<option value='0' selected disabled>Filter Assessment By Section</option>");
      $('#cond-SubassessmentsSection').empty();
      $('#cond-SubassessmentsSection').append("<option value='0' selected disabled>Filter Assessment By Section</option>");
      if (result.status == 200) {
        $.each(result.data, function (key, value) {
          $('#cond-ObjassessmentsSection').append("<option value='" + value.id + "'>" + value.name + "</option>");
          $('#cond-SubassessmentsSection').append("<option value='" + value.id + "'>" + value.name + "</option>");
        });
      }
      // else {
      //     alert(result.message + " Please Login again");
      //     window.location.href = "Loginpage.html";
      // }
    },
    error: function (error) {
      alert("Request Failed with status: " + error.status);
    }
  });

  $("#nav-cond-tab").click(function () {
    clearSelections();
    $("#nav-cond-obj-tab").click();
  });


  $("#nav-cond-obj-tab").click(function () {
    // getSubAssesments();

    let condObjDate = $('#condObjDate').val();
    let condObjAssessmentsSection = $('#cond-ObjassessmentsSection').val();
    let condObjAssessmentsSubject = $('#cond-ObjassessmentsSubject').val();

    let date = new Date();
    date.setMonth(date.getMonth() - 6);
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    if (!condObjDate || condObjDate == null) {
      condObjDate = fullDate;
      // $('#condObjDate').val(fullDate);
      $('#condObjDate').datepicker('setDate', date);
    }

    // alert(condObjAssessmentsSection);
    // alert(condObjAssessmentsSubject);
    // alert(condObjDate);

    if (condObjDate && !condObjAssessmentsSection && !condObjAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getConductedObjectiveTests?from_date=' + condObjDate,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCondCards(result.data, true);
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else if (condObjDate && !condObjAssessmentsSection && condObjAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseConductedObjectiveTests?subject_id=' + condObjAssessmentsSubject,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCondCards(result.data, true);
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else if (condObjDate && condObjAssessmentsSection && !condObjAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedObjectiveTests?section_id=' + condObjAssessmentsSection,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCondCards(result.data, true);
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else if (condObjDate && condObjAssessmentsSection && condObjAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedObjectiveTests?section_id=' + condObjAssessmentsSection,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condObjAssessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              if (value.subject_id == condObjAssessmentsSubject) {
                $('#condObjAssessmentList').append(
                  "<div class='col-sm-6 assessment'>" +
                  "<div class='card mb-3 objCard text-left'>" +
                  "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5>" +
                  "<p class='pl-3 condCardDesc'>" + value.description + "</p>" +
                  "<div class='card-body pl-1 pb-0 align-bottom'>" +
                  "<h6 class='font-weight-bold'>" + value.created_at + " - " + value.doe + "</h6>" +
                  "</div>" +
                  "<div class='px-3 text-muted card-footer'>" +
                  "<div class='row'>" +
                  "<div class='col-sm-4'>" +
                  "Questions: <span class='font-weight-bold'>" + value.questions_count + "</span>" +
                  "</div>" +
                  "<div class='col-sm-4'>" +
                  "Sent To: <span class='font-weight-bold'>" + value.students_count + "</span>" +
                  "</div>" +
                  "<div class='col-sm-4'>" +
                  "Answered: <span class='font-weight-bold'>" + value.test_completed + "</span>" +
                  "</div></div></div></div></div>"
                );
              }
            });
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }

  });

  $("#nav-cond-sub-tab").click(function () {
    // getSubAssesments();

    let condSubDate = $('#condSubDate').val();
    let condSubAssessmentsSection = $('#cond-SubassessmentsSection').val();
    let condSubAssessmentsSubject = $('#cond-SubassessmentsSubject').val();

    let date = new Date();
    date.setMonth(date.getMonth() - 6);
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    if (!condSubDate || condSubDate == null) {
      condSubDate = fullDate;
      // $('#condSubDate').val(fullDate);
      $('#condSubDate').datepicker('setDate', date);
    }

    // alert(condSubAssessmentsSection);
    // alert(condSubAssessmentsSubject);
    // alert(condSubDate);

    if (condSubDate && !condSubAssessmentsSection && !condSubAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getConductedSubjectiveTests?from_date=' + condSubDate,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.message);
          $('#condSubAssessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCondCards(result.data, false);
          }
          else
            $('#condSubAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else if (condSubDate && !condSubAssessmentsSection && condSubAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSubjectWiseConductedSubjectiveTests?subject_id=' + condSubAssessmentsSubject,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condSubAssessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCondCards(result.data, false);
          }
          else
            $('#condSubAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else if (condSubDate && condSubAssessmentsSection && !condSubAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedSubjectiveTests?section_id=' + condSubAssessmentsSection,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condSubAssessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCondCards(result.data, false);
          }
          else
            $('#condSubAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else if (condSubDate && condSubAssessmentsSection && condSubAssessmentsSubject) {

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getSectionWiseConductedSubjectiveTests?section_id=' + condSubAssessmentsSection,
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#condSubAssessmentList').empty();
          if (result.status == 200) {
            $.each(result.data, function (key, value) {

              if (value.subject_id == condSubAssessmentsSubject) {
                $('#condSubAssessmentList').append(
                  "<div class='col-sm-6 assessment'>" +
                  "<div class='card mb-3 objCard text-left'>" +
                  "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5>" +
                  "<p class='pl-3 condCardDesc'>" + value.description + "</p>" +
                  "<div class='card-body pl-1 pb-0 align-bottom'>" +
                  "<h6 class='font-weight-bold'>" + value.created_at + " - " + value.doe + "</h6>" +
                  "</div>" +
                  "<div class='px-3 text-muted card-footer'>" +
                  "<div class='row'>" +
                  "<div class='col-sm-4'>" +
                  "Questions: <span class='font-weight-bold'>" + value.questions_count + "</span>" +
                  "</div>" +
                  "<div class='col-sm-4'>" +
                  "Sent To: <span class='font-weight-bold'>" + value.students_count + "</span>" +
                  "</div>" +
                  "<div class='col-sm-4'>" +
                  "Answered: <span class='font-weight-bold'>" + value.test_completed + "</span>" +
                  "</div></div></div></div></div>"
                );
              }
            });
          }
          else
            $('#condObjAssessmentList').append("<div class='col-sm-12 mb-5'><h5>No Assessments Found</h5></div>");
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

    }

  });

  function displayCondCards(data = [], isObj) {
    let div = "";

    $.each(data, function (key, value) {

      let endDateString = "";
      let endDate = new Date(value.start_time.toLocaleString());
      // if(value.start_time) console.log(endDate)
      if(!isObj && value.start_time){
         endDate.setMinutes(endDate.getMinutes() + value.timelimit);
         endDateString = endDate.getFullYear() + '-' +('0' + (endDate.getMonth()+1)).slice(-2)+ '-' +  ('0' + endDate.getDate()).slice(-2) + ' '+endDate.getHours()+ ':'+('0' + (endDate.getMinutes())).slice(-2)+ ':'+('0' + (endDate.getSeconds())).slice(-2);
      }
      else if(!isObj && value.created_at) endDate.setMinutes(endDate.getMinutes() + value.timelimit);

      div = div + "<div class='col-sm-6 assessment condLink' data-id='" + value.id + "' data-test='" + value.test_completed + "'>";
      div = div + "<div class='card mb-3 objCard text-left'>";
      div = div + "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5>";
      div = div + "<p class='pl-3 condCardDesc'>" + value.description + "</p>";
      div = div + "<div class='card-body pl-1 pb-0 align-bottom'>";
      if (value.start_time){
        if(!isObj)
          div = div + "<h6 class='font-weight-bold'>" + value.start_time + "  -  " + endDateString + "</h6>";  
        else
          div = div + "<h6 class='font-weight-bold'>" + value.start_time + "  -  " + value.doe + "</h6>";
      }
      else{
        if(!isObj)
          div = div + "<h6 class='font-weight-bold'>" + value.created_at + "  -  " + endDateString + "</h6>";  
        else
          div = div + "<h6 class='font-weight-bold'>" + value.created_at + "  -  " + value.doe + "</h6>";
      }
      div = div + "</div><div class='px-3 text-muted card-footer'>";
      div = div + "<div class='row'>";
      div = div + "<div class='col-sm-4'>";
      div = div + "Questions: <span class='font-weight-bold'>" + value.questions_count + "</span>";
      div = div + "</div>";
      div = div + "<div class='col-sm-4'>";
      div = div + "Sent To: <span class='font-weight-bold'>" + value.students_count + "</span>";
      div = div + "</div>";
      div = div + "<div class='col-sm-4'>";
      div = div + "Answered: <span class='font-weight-bold'>" + value.test_completed + "</span>";
      div = div + "</div></div></div></div></div>";

    });

    if (isObj)
      $('#condObjAssessmentList').append(div);
    else
      $('#condSubAssessmentList').append(div);
  }

  $('#condObjDate').change(function () {
    $('#nav-cond-obj-tab').click();
  });

  $('#cond-ObjassessmentsSection').change(function () {
    $('#nav-cond-obj-tab').click();
  });

  $('#cond-ObjassessmentsSubject').change(function () {
    $('#nav-cond-obj-tab').click();
  });

  $('#condSubDate').change(function () {
    $('#nav-cond-sub-tab').click();
  });

  $('#cond-SubassessmentsSection').change(function () {
    $('#nav-cond-sub-tab').click();
  });

  $('#cond-SubassessmentsSubject').change(function () {
    $('#nav-cond-sub-tab').click();
  });

  $(document).on('click', '.condLink', function () {
    //alert("sent")
    let test_id = $(this).data('id');
    let test_completed = $(this).data('test');
    if (test_completed > 0) {
      let link = document.createElement('a');
      link.href = "https://develop.createtest.edwisely.com/facaltytestdashboard?test_id=" + test_id + "&token=" + `${$user.token}`;
      link.target = "_blank";
      link.dispatchEvent(new MouseEvent('click'));
    }
  });

  // let date1 = new Date();
  // date1.setMonth(date1.getMonth() - 6);
  // let month = date1.getMonth();
  // if(month.length == 1) month = "0"+month;

  $('.input-group.date').datepicker({
    format: "yyyy-mm-dd",
    calendarWeeks: true,
    autoclose: true
  });


  $("#condObjDate").blur(function () {
    // alert("here");
    let date = new Date();
    date.setMonth(date.getMonth() - 6);
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    // $("#condObjDate").val(fullDate);
    $('#condObjDate').datepicker('setDate', date);


  });

  $("#condSubDate").blur(function () {
    let date = new Date();
    date.setMonth(date.getMonth() - 6);
    let fullDate = date.getFullYear() + "-" + date.getMonth() + "-" + date.getDate();
    $("#condSubDate").val(fullDate);
    $('#condSubDate').datepicker('setDate', date);
      // $("#condSubDate").val(fullDate);

  });



});
