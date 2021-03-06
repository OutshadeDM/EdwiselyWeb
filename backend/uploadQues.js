$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    $("#greetingNav").html($user.name);
  } else {
    window.location.replace("login.html");
  }
  // alert(`${$user.token}`);

  let searchParams = new URLSearchParams(window.location.search);
  let subSemId = 0;
  let tId = 0;
  let tname = "";
  let unit_id = "";
  let desc = ""
  let objective = false

  let sectionIds = []
  let section = '';
  let sectionMarks = 0;
  let marks = []



  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
    tname = searchParams.get('tname');
    desc = searchParams.get('desc')
    objective = searchParams.get('isObj')
    question_count = searchParams.get('qc')
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }

  if (searchParams.has('seid'))
    section = searchParams.get('seid');


  //variables
  let unit = 0
  let topics = []
  let uploaded_question = ""
  let selectedQuestions = []
  let selectedQuestionsId = []

  //setting the name of test
  $('#courseName').append(tname)





  $('.typeSelect').on('change', function () {
    const page = $('.typeSelect').val()
    if (page == 1) {
      window.location.href = `chooseQues.html?id=${subSemId}&tid=${tId}&tname=${tname}&uid=${unit_id}&desc=${desc}&isObj=true&qc=0&seid=${section}`
    }
    if (page == 3) {
      window.location.href = `addQues.html?id=${subSemId}&tid=${tId}&tname=${tname}&uid=${unit_id}&desc=${description}&isObj=true&qc=0&seid=${section}`
    }
  })




  //get test details

  getTestDetails(tId)
  function getTestDetails(id) {
    $.ajax({
      url: `https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestDetails?test_id=${id}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {

        console.log(result.data)

        if (result.status == 200 && result.data) {
          //let div = ""
          $.each(result.data.sections, function (key, value) {
            sectionIds.push(value.id)
            marks.push(value.marks)

            $('.sectionContainer').append('<div class="sectionDiv"><label class="sectionLabel" data-marks=' + value.marks + ' data-id=' + value.id + ' id="section' + value.id + '">' + value.name + '<img alt="tick" width="18px" src="/frontend/images/savedQuestions.svg" class="tick pl-1 pb-1" id="tick' + value.id + '" /></label></div>')

          });
          $('.sectionContainer').append('<i class="fas fa-edit pl-5 editTest"></i>')

          // section = sectionIds[0]
          if (!section || section == 0) {
            section = result.data.sections[0].id;
            sectionMarks = result.data.sections[0].marks;
          }
          else
            sectionMarks = $('#section' + section).data('marks');

          $('#section' + section).addClass('active')
          questionsOfTest(section)
          totalQuesMarks()
        }


        $('.tick').hide()



      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  $(document).on('click', '.sectionLabel', function () {
    $('#section' + section).removeClass('active')
    section = $(this).data('id');
    sectionMarks = $(this).data('marks')
    $('#section' + section).addClass('active')

    selectedQuestionsId = []
    selectedQuestions = []

    questionsOfTest(section)


  })


  $(document).on('click', '.editTest', function () {
    window.location.href = 'createAssessment.html?isObj=true&id=' + tId
  })







  //units fetching
  let unitsIds = []

  getUnits()
  function getUnits() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getUnits?subject_id=' + subSemId + '&university_degree_department_id=' + `${$user.university_degree_department_id}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {

        //console.log(result.data)
        $('.getUnits').empty();

        if (result.status == 200 && result.data) {
          //let div = ""
          $.each(result.data, function (key, value) {
            unitsIds.push(value.id)
            $('.getUnits').append("<li class='getUnitsLi'><input type='radio' class='getUnitsInput' value='" + value.id + "' data-description='" + value.description + "'data-id='" + value.id + "' name='getUnitsAdd' id='getUnitsAdd" + value.id + "' /><label for='getUnitsAdd" + value.id + "' class='getUnitsLabel'>" + value.name + "</label></li>");

          });
        }
        else {
          $('#getUnits').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Units in this Course</h5></div</div>");
        }

        let first_unit = "getUnitsAdd" + unitsIds[0]

        if (unitsIds.length !== 0) {
          $("#" + first_unit).attr('checked', true)
          unit = $(".getUnitsInput:checked").val();
          console.log(unit)
          getTopics()
        }

      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  getTopics();

  function getTopics() {


    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getUnitTopics?unit_ids=' + unit,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {

        $('#topicTags').empty();
        if (result.status == 200 && result.data) {
          if (result.data == "") {
            $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");

          } else {
            $.each(result.data, function (key, value) {
              $.each(value.topic, function (key, unitTopic) {
                $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + unitTopic.topic_id + "' data-type='" + unitTopic.type + "'data-id='" + unitTopic.topic_id + "' data-code='" + unitTopic.topic_code + "' name='topicTagAdd' id='topicTagAdd" + unitTopic.topic_id + "'/><label for='topicTagAdd" + unitTopic.topic_id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i>" + unitTopic.topic_name + "</label></li>");
              })
            });
          }
        }
        else {
          $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });




  }


  $(document).on('click', '.getUnitsInput', function () {
    unit = $(".getUnitsInput:checked").val();
    getTopics()
  });



  $(document).on('change', '.topicTagsInput', function (e) {
    //add Questions to a array which are selected

    (e.target.checked) ? topics.push({ "id": $(this).val(), "type": $(this).data('type') }) : (topics.splice(topics.indexOf({ "id": $(this).val(), "type": $(this).data('type') }), 1));
    console.log(JSON.stringify(topics))
  });






  $('.quesUploadFile').on('change', function () {
    uploaded_question = $(".quesUploadFile")[0].files[0];
    console.log(uploaded_question.name)
    $('#uploadedFileName').text(uploaded_question.name + " has been selected")
  })



  // total question and marks function 
  function totalQuesMarks() {
    $('.totalMarks').val(selectedQuestions.length * sectionMarks);
    $('.totalQuestions').val(selectedQuestions.length);
  }







  //getting the questions which are already present in the assessment

  function questionsOfTest(section) {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestQuestions?test_id=' + tId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //console.log(result);

        if (result.status == 200 && result.data) {

          $('.addingQues').empty()

          $.each(result.data, function (key, value) {
            if (value.section_id == section) {

              if (!selectedQuestionsId.includes(value.id)) {
                selectedQuestionsId.push(value.id);
              }

              if (!selectedQuestions.includes(value)) {
                selectedQuestions.push(value);
              }

              $('.chooseQuestionsInput').each(function () {
                if (selectedQuestionsId.includes($(this).data('id'))) {
                  $(this).prop('checked', true)
                }
              })

            }

          });
          $('.totalMarks').val(selectedQuestions.length * sectionMarks);
          $('.totalQuestions').val(selectedQuestions.length);

          //displaying the already selected questions
          let num = 1;
          for (let i = 0; i < selectedQuestions.length; i++) {



            $('.addingQues').append("<div class='row'>" +
              "<div class='col-2 pl-2 pt-4 chosenQuestions'>" + num++ + "</div>" +

              "<div class='col-10 chosenQuestions py-2 pr-4' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
              selectedQuestions[i].name + "</div>" +

              "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-4'>" + selectedQuestions[i].name + "</div>" +
              (selectedQuestions[i].question_img == " " ? "" : "<div class='text-center py-2'><a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].question_img + "&type=img'><img src='" + selectedQuestions[i].question_img + "' alt='img' style='width:100px; height:75px;'></img></a></div>") +
              (selectedQuestions[i].questions_options[0] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[0].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[0] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].questions_options[0].option_img + "&type=img'><img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img></a>") : "") +
              (selectedQuestions[i].questions_options[1] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[1].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[1] ? (selectedQuestions[i].questions_options[1].option_img == " " ? "" : "<a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].questions_options[1].option_img + "&type=img'><img src='" + selectedQuestions[i].questions_options[1].option_img + "' style='width:100px; height:75px;' alt='img'></img></a>") : "") +
              (selectedQuestions[i].questions_options[2] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[2].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[2] ? (selectedQuestions[i].questions_options[2].option_img == " " ? "" : "<a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].questions_options[2].option_img + "&type=img'><img src='" + selectedQuestions[i].questions_options[2].option_img + "' style='width:100px; height:75px;' alt='img'></img></a>") : "") +
              (selectedQuestions[i].questions_options[3] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[3].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[3] ? (selectedQuestions[i].questions_options[3].option_img == " " ? "" : "<a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].questions_options[3].option_img + "&type=img'><img src='" + selectedQuestions[i].questions_options[3].option_img + "' style='width:100px; height:75px;' alt='img'></img></a>") : "") +
              (selectedQuestions[i].questions_options[4] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[4].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[4] ? (selectedQuestions[i].questions_options[4].option_img == " " ? "" : "<a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].questions_options[4].option_img + "&type=img'><img src='" + selectedQuestions[i].questions_options[4].option_img + "' style='width:100px; height:75px;' alt='img'></img></a>") : "") +

              (selectedQuestions[i].hint ? "<div style='font-size:12px;'>Hint :" + selectedQuestions[i].hint + "</div>" : "") +
              (selectedQuestions[i].hint_image ? "<div class='text-center py-2'><a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].hint_image + "&type=img'><img src='" + selectedQuestions[i].hint_image + "' alt='img' style='width:100px; height:75px;'></img></a></div>" : "") +
              (selectedQuestions[i].solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + selectedQuestions[i].solution + "</div>") +
              (selectedQuestions[i].solution_image == "" ? "" : "<div class='text-center py-2'><a target='_blank' href='viewFile.html?url=" + selectedQuestions[i].solution_image + "&type=img'><img src='" + selectedQuestions[i].solution_image + "' alt='img' style='width:100px; height:75px;'></img></a></div>") +
              "</div>" +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>")

          }

        }

      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  questionsOfTest()


  // Upload api
  $('.saveToSectionBtn').click(function () {

    //console.log("jndsi")
    //alert("hello")

    if (uploaded_question && topics.length != 0) {



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
          //alert(result.status);
          if (result.status == 200) {

            //alert(result.message);
            $.each(result.data, function (key, value) {
              //console.log(value);
              questions.push(value.id)

            });


            //saving questions
            var form = new FormData();
            form.append("test_id", tId);
            form.append("questions", "[" + questions + "]");
            form.append("units", "[" + unit + "]")
            form.append("section_id", section)

            for (var key of form.entries()) {
              alert(key[1]);
            }


            $.ajax({
              url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editObjectiveTestQuestions',
              type: 'POST',
              dataType: 'json',
              data: form,
              contentType: false,
              processData: false,
              headers: {
                'Authorization': `Bearer ${$user.token}`
              },
              success: function (result) {
                // alert(result.message);

                if (result.status == 200) {
                  new Notify({
                    title: 'Success',
                    text: "Questions Uploaded Successfully",
                    autoclose: true,
                    status: 'success',
                    autotimeout: 3000
                  });

                }
                else {
                  alert("error!")
                }
                $('#tick' + section).show()
                totalQuesMarks()

              },
              error: function (error) {
                alert("Request Failed with status: " + error.status);
              }
            });

          }
          else if (result.status == 500) {
            new Notify({
              title: 'Error',
              text: result.message,
              autoclose: true,
              status: 'error',
              autotimeout: 3000
            });
          }
          else {
            new Notify({
              title: 'Error',
              text: "Fill the Details",
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
    }
    else {
      new Notify({
        title: 'Error',
        text: "Fill the Details",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }

  })


  $('#uploadExitBtn').click(function () {
    window.location.href = 'myAssessment.html'
  })


})