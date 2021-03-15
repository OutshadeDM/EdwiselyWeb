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
    let section = 0;
    let selectedStudentsId = [];
    let preSelectedStudentsIds = [];
  
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
  
    getStudents();
  
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
  
            // console.log(selectedStudentsId)
  
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
  
  
  
    
  
  })