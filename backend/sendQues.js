$(document).ready(function () {
  // Check if User is logged in
  let $user = "";
  if (isLoggedIn()) {
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }


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

  //alert(subSemId)




  // $('#selectStudents').on('change', '.selectAll', function () {
  //   const tab = $(this).data('tab');
  //   const checkBoxes = $(`#t${tab} .single input:checkbox`);
  //   if ($(this).prop('checked')) {
  //     checkBoxes.prop("checked", true);
  //   } else {
  //     checkBoxes.prop("checked", false);
  //   }
  // });

  Date.prototype.addHours = function (h) {
    this.setTime(this.getTime() + (h * 60 * 60 * 1000));
    return this;
  }
  var checkPastTimeS = function (inputDateTime) {
    if (typeof (inputDateTime) != "undefined" && inputDateTime !== null) {
      var current = new Date();

      //check past year and month
      if (inputDateTime.getFullYear() < current.getFullYear()) {
        $('#starttime').datetimepicker('reset');
        alert("Sorry! Past date time not allow.");
      } else if ((inputDateTime.getFullYear() == current.getFullYear()) && (inputDateTime.getMonth() < current.getMonth())) {
        $('#starttime').datetimepicker('reset');
        alert("Sorry! Past date time not allow.");
      }

      // 'this' is jquery object datetimepicker
      // check input date equal to todate date
      if (inputDateTime.getDate() == current.getDate()) {
        if (inputDateTime.getHours() < current.getHours()) {
          $('#starttime').datetimepicker('reset');
        }
      } else {
        this.setOptions({
          minTime: false
        });
        // $('#endtime').datetimepicker('option', 'minDate', $(this).val());
      }
      // $('#endtime').datetimepicker('option', 'minDate', $(this).val());
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ minDate: $('#starttime').data('xdsoft_datetimepicker').getValue() });
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ maxDate: new Date($('#starttime').data('xdsoft_datetimepicker').getValue()).addHours(3) });
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ minTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 'h' });
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ maxTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 3 + 'h' });
    }
  };

  var checkPastTimeE = function (inputDateTime) {
    if (typeof (inputDateTime) != "undefined" && inputDateTime !== null) {
      var current = new Date();

      //check past year and month
      if (inputDateTime.getFullYear() < current.getFullYear()) {
        $('#starttime').datetimepicker('reset');
        alert("Sorry! Past date time not allow.");
      } else if ((inputDateTime.getFullYear() == current.getFullYear()) && (inputDateTime.getMonth() < current.getMonth())) {
        $('#starttime').datetimepicker('reset');
        alert("Sorry! Past date time not allow.");
      }

      // 'this' is jquery object datetimepicker
      // check input date equal to todate date
      console.log(this);
      if (inputDateTime.getDate() == current.getDate()) {
        if (inputDateTime.getHours() < current.getHours()) {
          $('#starttime').datetimepicker('reset');
        }
      } else {
        this.setOptions({
          minTime: false
        });
        // $('#endtime').datetimepicker('option', 'minDate', $(this).val());
      }
      // $('#endtime').datetimepicker('option', 'minDate', $(this).val());
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ minDate: $('#starttime').data('xdsoft_datetimepicker').getValue() });
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ maxDate: new Date($('#starttime').data('xdsoft_datetimepicker').getValue()).addHours(3) });
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ minTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 'h' });
      $('#endtime').data('xdsoft_datetimepicker').setOptions({ maxTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 3 + 'h' });
    }
  };

  var currentYear = new Date();
  var startTime = $('#starttime').datetimepicker({
    format: 'Y-m-d H:i:s',
    minDate: 0,
    yearStart: currentYear.getFullYear(), // Start value for current Year selector
    onChangeDateTime: checkPastTimeS,
    onShow: checkPastTimeS,
  });
  //console.log(startTime.data("datetimepicker"));
  var endTime = $('#endtime').datetimepicker({
    format: 'Y-m-d H:i:s',
    minDate: 0,
    yearStart: currentYear.getFullYear(), // Start value for current Year selector
    onChangeDateTime: checkPastTimeE,
    onShow: checkPastTimeE,
  });

  $("#starttime").on("dp.change", function (e) {
    $('#endtime').data('xdsoft_datetimepicker').setOptions({ minDate: $('#starttime').data('xdsoft_datetimepicker').getValue('minDate') });
  });

  $("#endtime").on("dp.change", function (e) {
    $('#starttime').data('xdsoft_datetimepicker').setOptions({ maxDate: $('#endtime').data('xdsoft_datetimepicker').getValue('maxDate') });
  });

  // let tabNumber = 1;
  // let selectNumber = 0;
  // let first = true;


  // Get faculty data function
  // const facultyData = () => {
  //   return new Promise((resolve, reject) => {
  //     try {
  //       $.ajax({
  //         url: `https://stagingfacultypython.edwisely.com/getFacultyCourses`,
  //         type: 'GET',
  //         contentType: 'application/json',
  //         headers: {
  //           'Authorization': `Bearer ${$user.token}`
  //         },
  //         success: function (result) {
  //           // alert(result.status);
  //           resolve(result);
  //         },
  //         error: function (error) {
  //           console.log(error);
  //           reject(error);
  //         }
  //       });
  //     } catch (error) {
  //       console.log(error);
  //     }
  //   });
  // }



  //   const getStudents = (id) => {
  //     return new Promise((resolve, reject) => {
  //       try {
  //         var form = new FormData();
  //         form.append("college_department_section_id", id);
  //         $.ajax({
  //           url: 'https://stagingfacultypython.edwisely.com/common/getCollegeDepartmentSectionStudents',
  //           type: 'POST',
  //           dateType: 'json',
  //           data: form,
  //           contentType: false,
  //           processData: false,
  //           headers: {
  //             'Authorization': `Bearer ${$user.token}`
  //           },
  //           success: function (result) {
  //             // alert(result.status);
  //             console.log(result);
  //             resolve(result);
  //           },
  //           error: function (error) {
  //             alert(error);
  //             reject(error);
  //           }
  //         });
  //       } catch (error) {
  //         console.log(error);
  //         reject(error);
  //       }
  //     });
  //   }

  //   const createSectionTab = (section) => {
  //     $('#myTab').append(`<li class="nav-item">
  //                             <a class="nav-link ${first ? 'active' : ''}" id="t${tabNumber}-tab" data-toggle="tab" href="#t${tabNumber}" role="tab" aria-controls="t${tabNumber}" aria-selected="true">${section.name}</a>
  //                           </li>`);
  //     $('#selectStudents').append(`<div class="tab-pane fade ${first ? 'show active' : ''}" id="t${tabNumber}" role="tabpanel" aria-labelledby="t${tabNumber}-tab"></div>`);
  //     $(`#t${tabNumber}`).append(`<div class="form-check">
  // 		<label class="form-check-label" for="select${tabNumber}">SELECT ALL</label>
  // 		<input style="float: right;right: 0px;" name="selectAll" data-tab=${tabNumber} type="checkbox" class="form-check-input selectAll" id="select${tabNumber}">
  // 		</div>`)
  //     $.each(section.students.data, (index, student) => {
  //       $(`#t${tabNumber}`).append(`<div class="form-check single my-2">
  // 	                                  <label class="form-check-label" for="exampleCheck${selectNumber}">${student.roll_number} - ${student.name}</label>
  // 	                                  <input style="float: right;right: 0px;" name="students[]" value="${student.id}" type="checkbox" class="form-check-input" id="exampleCheck${selectNumber++}">
  // 	                                </div>`)
  //     });
  //     tabNumber++;
  //     first = false;
  //   }

  //   const getSections = async (data) => {
  //     return new Promise(async (resolve, reject) => {
  //       try {
  //         let track = {};
  //         let sections = [];
  //         await $.each(data, async (index, course) => {
  //           await $.each(course.sections, async (i, section) => {
  //             let name = `${section.department_name} - ${section.name}`;
  //             if (!(name in track)) {
  //               track[name] = 1;
  //               alert(section.id)
  //               let students = await getStudents(section.id);
  //               createSectionTab({
  //                 name: name,
  //                 students: students
  //               });
  //             }
  //           });
  //         });
  //       } catch (error) {
  //         console.log(error);
  //       }
  //     });
  //   }



  //   try {
  //     let faculty = await facultyData();
  //     let sections = await getSections(faculty.data);
  //   } catch (error) {
  //     console.log(error);
  //   }
  // });

  // $('.submit').on('click', function(e) {
  // 	e.preventDefault();
  // 	$('#formdata').submit();
  // })




  // $('#formdata').submit(function (e) {
  //   e.preventDefault();
  //   console.log(this);
  //   var formData = new FormData();
  //   formData.append('title', $('#title').val());
  //   formData.append('description', $("#description").val());
  //   formData.append('start_time', $("#starttime").val());
  //   formData.append('end_time', $("#endtime").val());
  //   var values = $("input[name='students[]']:checked")
  //     .map(function () { return $(this).val(); }).get();
  //   formData.append('students', JSON.stringify(values));
  //   for (var pair of formData.entries()) {
  //     console.log(pair[0] + ', ' + pair[1]);
  //   }
  //   $.ajax({
  //     url: `https://stagingfacultypython.edwisely.com/college/createVC`,
  //     type: 'POST',
  //     dateType: 'json',
  //     data: formData,
  //     contentType: false,
  //     processData: false,
  //     headers: {
  //       'Authorization': `Bearer ${$user.token}`
  //     },
  //     success: function (data) {
  //       console.log(data);
  //       window.location.replace("index.html?status=success&message=liveclass");
  //     },
  //     error: function (error) {
  //       console.log(error);
  //     }
  //   });
  // })



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
        //alert(result.status);
        //alert(subSemId)
        //console.log(result.data)
        $('.sectionsList').empty();

        if (result.status == 200 && result.data) {
          //let div = ""
          //alert(result.status)
          $.each(result.data, function (key, value) {
            //console.log(value);

            if (value.id == subSemId) {
              //console.log(true)
              //console.log(value)
              for (let i = 0; i < value.sections.length; i++) {
                //console.log(value.sections[i].id)
                $('.sectionsList').append("<li class='sectionsListLi'><input type='radio' class='sectionsListInput' value='" + value.sections[i].id + "'data-department='" + value.sections[i].department_name + "' data-id='" + value.sections[i].id + "' data-section='" + JSON.stringify(value.sections[i]) + "' name='sectionsListAdd' id='sectionsListAdd" + value.sections[i].id + "' /><label for='sectionsListAdd" + value.sections[i].id + "' class='sectionsListLabel'>" + value.sections[i].name + "</label></li>")
              }
            }

          });
        }
        else {
          $('#sectionsList').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Sections in this Course</h5></div</div>");
        }

        // let first_unit = "sectionsListAdd" + unitsIds[0]
        // //console.log(unitsIds)
        // //console.log(first_unit)
        // if (unitsIds.length !== 0) {
        //   $("#" + first_unit).attr('checked', true)
        //   unit = $(".sectionsListInput:checked").val();
        //   subTopicsId = []
        //   topicsId = []
        //   grandTopicsId = []
        //   getTopics()
        //}

      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  getStudents()
  function getStudents() {
    var form = new FormData();
    form.append("college_department_section_id", 660);


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

        if (result.status == 200) {
          //console.log(result.data)

          //$('.selectStudents').append(`<label class="form-check-label" for="select1">SELECT ALL</label><input style="float: right;right: 0px;" name="selectAll" data-tab=1 type="checkbox" class="form-check-input selectAll" id="select1">`)
          $('.selectAllDiv').append(`<label for='selectAll'>SELECT ALL</label><input style='float:right;' class='mt-1 mr-3' name='selectAll' type='checkbox' id='selectAll' />`)

          $.each(result.data, function (key, value) {
            $('.selectStudents').append(`<li class='py-1 px-3'><div class='profileAvatar px-1 mr-2' style='background-color:#1B658C;'>${value.name[0]}</div>${value.name}<input style='float:right;' class='mt-1 mr-3' name='selectAll' type='checkbox' data-roll_number='${value.roll_number}' id='select${value.id}' /></li>`)
          })


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