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


  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = 0;
  let tId = 0;
  let tname = "";
  let objective = false
  let unit_id = "";
  let description = ""
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
    tname = searchParams.get('tname');
    description = searchParams.get('desc')
    objective = searchParams.get('isObj')
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }

  //alert(subSemId)

  //variables
  let starttime = ""
  let doe = ""
  let section = 0
  let sectionIds = []
  let selectedStudentsId = []
  let count = 0
  let hours = 0
  let mins = 0
  let timelimit_in_secs = 0


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
        onSelect: function (selectedDateTime) {
          endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate'))
        }
      },
      end: {
        minDate: 0
      }

    }
  );


  $('#starttime').on('change', function () {
    starttime = $('#starttime').val()
  })

  $('#endtime').on('change', function () {
    doe = $('#endtime').val()
  })


  $('.durationHours').on('change', function () {
    hours = $('.durationHours').val()
  })

  $('.durationMinutes').on('change', function () {
    mins = $('.durationMinutes').val()
  })





  getSections()
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


            if (value.id == subSemId) {
              console.log(value.id)

              for (let i = 0; i < value.sections.length; i++) {
                sectionIds.push(value.sections[i].id)
                //console.log(value.sections[i].id)
                $('.sectionsList').append("<li class='sectionsListLi'><strong style='font-size:18px;'>" + value.sections[i].department_name + "  :  </strong><input type='radio' class='sectionsListInput' value='" + value.sections[i].id + "'data-department='" + value.sections[i].department_name + "' data-id='" + value.sections[i].id + "' data-section='" + JSON.stringify(value.sections[i]) + "' name='sectionsListAdd' id='sectionsListAdd" + value.sections[i].id + "' /><label for='sectionsListAdd" + value.sections[i].id + "' class='sectionsListLabel'>" + value.sections[i].name + "</label></li>")
              }
              console.log(sectionIds)
            }

          });
        }
        else {
          $('.sectionsList').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Sections in this Course</h5></div</div>");
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
  getStudents()
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
        $('.selectAllDiv').append(`<label for='selectAll'>SELECT ALL</label><input style='float:right;' class='mt-1 mr-3' name='selectAll' type='checkbox' id='selectAll' />`)

        if (result.status == 200) {
          //console.log(result.data)


          $.each(result.data, function (key, value) {
            if (selectedStudentsId.includes(value.id)) {
              $('.selectStudents').append(`<li class='py-1 px-3'><div class='profileAvatar px-1 mr-2' style='background-color:#1B658C;'>${value.name[0]}</div>${value.name}<input style='float:right;' class='mt-1 mr-3 studentsToSelect' name='selectAll' type='checkbox' checked='true' data-roll_number='${value.roll_number}' val='${value.id}' data-id='${value.id}' id='select${value.id}' /></li>`)
            } else {
              $('.selectStudents').append(`<li class='py-1 px-3'><div class='profileAvatar px-1 mr-2' style='background-color:#1B658C;'>${value.name[0]}</div>${value.name}<input style='float:right;' class='mt-1 mr-3 studentsToSelect' name='selectAll' type='checkbox' data-roll_number='${value.roll_number}' val='${value.id}' data-id='${value.id}' id='select${value.id}' /></li>`)
            }
            //allStudentsId.push(value.id)
          })

          // console.log(selectedStudentsId)

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


  //on click of select all, select all students

  $(document).on('click', '#selectAll', function () {
    if ($(this).is(':checked')) {

      // if (!selectedStudentsId.includes($(this).data('id'))){
      //   selectedStudentsId.splice(selectedStudentsId.indexOf($(this).data('id')), 1)
      // }


      //selectedStudentsId = []
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
      //selectedStudentsId = []
      if (!selectedStudentsId.includes($(this).data('id'))) {
        selectedStudentsId.push($(this).data('id'))
        //count = count + 1
        $('#numberOfStudents').text(selectedStudentsId.length)
      }
    } else {
      $("#selectAll").prop("checked", false);
      selectedStudentsId.splice(selectedStudentsId.indexOf($(this).data('id')), 1)
      //count = count - 1
      $('#numberOfStudents').text(selectedStudentsId.length)
    }
    //console.log(selectedStudentsId)
    //console.log(count)
    $('#numberOfStudents').text(selectedStudentsId.length)
  })



  $('#sendQuestionsBtn').on('click', function () {

    if (objective) {

      timelimit_in_secs = (hours * 60 * 60) + (mins * 60)

      var form = new FormData();
      form.append("name", tname)
      form.append("description", description)
      form.append("doe", doe)
      form.append("timelimit", timelimit_in_secs)
      form.append("students", "[" + selectedStudentsId + "]")
      form.append("test_id", tId)
      form.append("starttime", starttime)
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editObjectiveTest',
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
            alert(result.message)

            window.location.href = "myAssessment.html"

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

      timelimit_in_secs = (hours * 60 * 60) + (mins * 60)

      var form = new FormData();
      form.append("name", tname)
      form.append("description", description)
      form.append("timelimit", timelimit_in_secs)
      form.append("students", "[" + selectedStudentsId + "]")
      form.append("test_id", tId)
      form.append("starttime", starttime)
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editSubjectiveTest',
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
            alert(result.message)

            window.location.href = "myAssessment.html"

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

  })





})