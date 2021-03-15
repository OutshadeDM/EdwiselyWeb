$(document).ready(function () {
  // Check if User is logged in
  let $user = "";
  if (isLoggedIn()) {
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }


  //initializing the page 
  $('.selectAllDiv').empty();

  let sId = 0;
  let starttime = ""
  let doe = ""
  let section = 0
  let sectionIds = []
  let selectedStudentsId = []
  let preSelectedStudentsIds = []
  let survery = [];
  let hours = 0
  let mins = 0
  let timelimit_in_secs = 0

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('id')) {
    sId = searchParams.get('id');
  }



  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/survey/getSurveys',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${$user.token}`
    },
    success: function (result) {
      // console.log(result.data);
      $('#feedbackList').empty();
      if (result.status == 200 && result.data) {
        survey = result.data.filter(survery1 => sId == survery1.id)[0];
        console.log(survey);

        survey.student_ids.forEach(function (id) {
          preSelectedStudentsIds.push(id)
        })

        console.log(preSelectedStudentsIds)

      }
    },
    error: function (error) {
      alert("Request Failed with status: " + error.status);
    }
  });

  getSections();
  getStudents();

  function getSections() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {

        $('.sectionsList').empty();
        $('.selectAllDiv').empty();
        if (result.status == 200 && result.data) {

          $.each(result.data, function (key, value) {
            //console.log(value)
            for (let i = 0; i < value.sections.length; i++) {
              if (!sectionIds.includes(value.sections[i].id)) {
                sectionIds.push(value.sections[i].id)
                $('.sectionsList').append("<li class='sectionsListLi'><strong style='font-size:18px;'>" + value.sections[i].department_name + "  :  </strong><input type='radio' class='sectionsListInput' value='" + value.sections[i].id + "'data-department='" + value.sections[i].department_name + "' data-id='" + value.sections[i].id + "' data-section='" + JSON.stringify(value.sections[i]) + "' name='sectionsListAdd' id='sectionsListAdd" + value.sections[i].id + "' /><label for='sectionsListAdd" + value.sections[i].id + "' class='sectionsListLabel'>" + value.sections[i].name + "</label></li>")
              }
            }

          });
          console.log(sectionIds)
        }
        else {
          $('.sectionsList').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Sections</h5></div</div>");
        }

        //auto selecting the first section
        let first_section = "sectionsListAdd" + sectionIds[0]
        if (sectionIds.length !== 0) {
          $("#" + first_section).attr('checked', true)
          section = $(".sectionsListInput:checked").val();
          $('.selectAllDiv').empty();
          getStudents()
        }

      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  function getStudents() {
    $('.selectStudents').empty();
    $('.selectAllDiv').empty();
    var form = new FormData();
    form.append("college_department_section_id", section);

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/common/getCollegeDepartmentSectionStudents',
      type: 'POST',
      dataType: 'json',
      data: form,
      contentType: false,
      processData: false,
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert(result.status)
        $('.selectAllDiv').empty();
        $('.selectAllDiv').append(`<label for='selectAll'><span class='pl-3 pr-4 '>STUDENTS</span><span class='spanSelectAll'>SELECT ALL</span></label><input style='float:right;' class='mt-1 mr-3' name='selectAll' type='checkbox' id='selectAll' />`)

        if (result.status == 200) {

          $.each(result.data, function (key, value) {
            if (preSelectedStudentsIds.includes(value.id)) {
              $('.selectStudents').append(`<li class='py-2 px-3'><div class='profileAvatar px-1 mr-2' style='background-image:linear-gradient(140deg, #A0F4FF 0%, #75DAE9 20%, #8459F8 100%);;'>${value.name[0].toUpperCase()}</div><div style='display:inline-block; width:90px;'>${value.roll_number}</div> -  ${value.name}<input style='float:right;' class='mt-1 mr-3 studentsToSelect' name='selectAll' type='checkbox' checked='true' disabled data-roll_number='${value.roll_number}' val='${value.id}' data-id='${value.id}' id='select${value.id}' /></li>`)
            }
            else if (selectedStudentsId.includes(value.id)) {
              $('.selectStudents').append(`<li class='py-2 px-3'><div class='profileAvatar px-1 mr-2' style='background-image:linear-gradient(140deg, #A0F4FF 0%, #75DAE9 20%, #8459F8 100%);;'>${value.name[0].toUpperCase()}</div><div style='display:inline-block; width:90px;'>${value.roll_number}</div> -  ${value.name}<input style='float:right;' class='mt-1 mr-3 studentsToSelect' name='selectAll' type='checkbox' checked='true' data-roll_number='${value.roll_number}' val='${value.id}' data-id='${value.id}' id='select${value.id}' /></li>`)
            }
            else {
              $('.selectStudents').append(`<li class='py-2 px-3'><div class='profileAvatar px-1 mr-2' style='background-image:linear-gradient(140deg, #A0F4FF 0%, #75DAE9 20%, #8459F8 100%);;'>${value.name[0].toUpperCase()}</div><div style='display:inline-block; width:90px;'>${value.roll_number}</div> -  ${value.name}<input style='float:right;' class='mt-1 mr-3 studentsToSelect' name='selectAll' type='checkbox' data-roll_number='${value.roll_number}' val='${value.id}' data-id='${value.id}' id='select${value.id}' /></li>`)
            }
          })

          console.log(selectedStudentsId)

        }
        else {
          alert("errorswd!")
        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  //initializing the values

  $('#starttime').val(starttime)
  $('#endtime').val(doe)




  $('#numberOfStudents').text(selectedStudentsId.length)







  let startDateTextBox = $('#starttime');
  let endDateTextBox = $('#endtime');

  $.timepicker.datetimeRange(
    startDateTextBox,
    endDateTextBox,
    {

      dateFormat: 'yy-mm-dd',
      timeFormat: 'HH:mm:ss',
      start: {
        minDate: 0,
        onChange: function (selectedDateTime) {
          endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'.replace(/\s/, 'T')))
        }
      },
      end: {
        minDate: new Date(),
      }

    }
  );




  $('#starttime').on('change', function () {
    starttime = $('#starttime').val()
  })

  $('#endtime').on('change', function () {
    doe = $('#endtime').val()
  })






  //changing section on selecting of radio
  $(document).on('click', '.sectionsListInput', function () {
    //alert("hello")
    section = $(".sectionsListInput:checked").val();
    //alert(section)
    //count = 0
    $('#numberOfStudents').text(selectedStudentsId.length)

    $('.selectAllDiv').empty();
    getStudents()
  });


  //get students
  $('.selectAllDiv').empty();





  //on click of select all, select all students

  $(document).on('click', '#selectAll', function () {
    if ($(this).is(':checked')) {

      $(".studentsToSelect").prop('checked', true);
      $('.studentsToSelect').each(function () {
        if (!selectedStudentsId.includes($(this).data('id'))) {
          selectedStudentsId.push($(this).data('id'))
        }
      })
      $('#numberOfStudents').text(selectedStudentsId.length)
    } else {

      $('.studentsToSelect').prop('checked', false);
      $('.studentsToSelect').each(function () {
        if (selectedStudentsId.includes($(this).data('id'))) {
          selectedStudentsId.splice(selectedStudentsId.indexOf($(this).data('id')), 1)
        }
      })
      $('#numberOfStudents').text(selectedStudentsId.length)

    }
  })



  //adding student ids into the array on selecting
  $(document).on('change', '.studentsToSelect', function () {

    if ($(this).is(':checked')) {

      if (!selectedStudentsId.includes($(this).data('id'))) {
        selectedStudentsId.push($(this).data('id'))
        $('#numberOfStudents').text(selectedStudentsId.length)
      }
    } else {
      $("#selectAll").prop("checked", false);
      selectedStudentsId.splice(selectedStudentsId.indexOf($(this).data('id')), 1)
      $('#numberOfStudents').text(selectedStudentsId.length)
    }
    //console.log(selectedStudentsId)

    $('#numberOfStudents').text(selectedStudentsId.length)
  })

  //toasts
  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 5000);
  });



  $('#sendQuestionsBtn').on('click', function () {


    if (doe && starttime && selectedStudentsId.length != 0) {



      var form = new FormData();
      form.append("doe", doe)
      form.append("students", "[" + selectedStudentsId + "]")
      form.append("survey_id", sId)
      form.append("start_time", starttime)
      form.append('is_comment_anonymous', $('#is_comment_anonymous').prop('checked') ? 1 : 0);
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/survey/sendSurveyToStudents',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          //alert(result.status)

          if (result.status == 200) {
            $('#successToastBody').text("Survey Successfully Sent");
            $('#successToast').toast('show');

            setTimeout(function () {
              window.location.href = "myFeedbacks.html";
            }, 3000);
          }
          else {
            alert("error!")
          }
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });



    }
    else {
      $('#errorToastBody').text("Fill All Details Carefully");
      $('#errorToast').toast('show');
    }
  });

})