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

  let test_id = 0;
  let starttime = ""
  let test_name = ""
  let doe = ""
  let section = 0
  let sectionIds = []
  let selectedStudentsId = []
  let preSelectedStudentsIds = []

  const searchParams = new URLSearchParams(window.location.search);
  if (searchParams.has('test_id')) {
    test_id = searchParams.get('test_id');
    test_name = searchParams.get('test_name');

  }


  // $('#summerNote').on('change', function () {
  //   console.log($('#summerNote').text())
  // })



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


  $('.durationHours').on('change', function () {
    if ($('.durationHours').val() > 100) {
      $('.durationHours').val('99')
    }

    if ($('.durationHours').val() < 0) {
      $('.durationHours').val('0')
    }

    $('.durationHours').val(parseInt($('.durationHours').val()))
    hours = parseInt($('.durationHours').val())
  })

  $('.durationMinutes').on('change', function () {
    if ($('.durationMinutes').val() > 59) {
      $('.durationMinutes').val('59')
    }

    if ($('.durationMinutes').val() < 0) {
      $('.durationMinutes').val('0')
    }

    $('.durationMinutes').val(parseInt($('.durationMinutes').val()))
    mins = parseInt($('.durationMinutes').val())
  })







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




  $('#numberOfStudents').text(selectedStudentsId.length)









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


  $('#sendQuestionsBtn').on('click', function () {
    timelimit_in_secs = (hours * 60 * 60) + (mins * 60)


    var form = new FormData();
    form.append("name", test_name)
    form.append("description", $($("#summernote").summernote("code")).text())
    form.append("test_id", test_id)
    form.append("starttime", starttime)
    form.append("doe", doe)
    form.append("timelimit", timelimit_in_secs)
    form.append("students", "[" + selectedStudentsId + "]")
    // for (var key of form.entries()) {
    //   alert(key[1]);
    // }

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/codeEditor/editCodingTest',
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
          new Notify({
            title: 'Success',
            text: "Test Successfully Sent",
            autoclose: true,
            status: 'success',
            autotimeout: 3000
          });

          setTimeout(function () {
            window.location.href = "index.html";
          }, 3000);
        }
        else {
          new Notify({
            title: 'Error',
            text: "Fill All Details",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
          });
        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });



  })
})
