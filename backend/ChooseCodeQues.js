

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
  //alert(`${$user.token}`);

  let searchParams = new URLSearchParams(window.location.search);
  let subject_id = 0;
  let test_id = 0
  let test_name = ""

  if (searchParams.has('id')) {
    test_id = searchParams.get('id');

  }




  //for modals
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })


  //toasts


  let i = 0;


  //arrays to store topic ids
  let subTopicsId = []
  let topicsId = []
  let grandTopicsId = []


  //arrays for selected questions
  let selectedQuestions = []
  let selectedQuestionsId = []

  //for all question values
  let questions_values = []

  //for pre Added QUestions
  let preAddedQues = []
  let preAddedQuesId = []

  //for questions which are pre added but for sending/saving (only marks and id)
  let existingQuestionsId = []
  let existingQuestions = []

  getpreAddedQuestions()


  function getpreAddedQuestions() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/codeEditor/getCodingTestDetails?test_id=' + test_id,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result)
        if (result.status == 200) {
          subject_id = result.data.subject_id

          $.each(result.data.problems, function (key, value) {
            preAddedQues.push(value);
            preAddedQuesId.push(value.id)
            let question = {}
            question.id = value.id;
            question.marks = value.marks
            existingQuestions.push(question)
            existingQuestionsId.push(value.id)

          });

          test_name = result.data.name
          $('#courseName').text(result.data.name);
          loadList()
          getUnits();

          console.log(existingQuestions)

        }
        else {
          new Notify({
            title: 'Error',
            text: result.message,
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

  function loadList() {
    $(".addingQues").empty();
    let i = 1;
    console.log(preAddedQues)
    if (preAddedQues.length == 0) {
      $('.addingQues').append("<div class='text-center'>Add Questions</div>")
    } else {
      $.each(preAddedQues, function (key, value) {



        $('.addingQues').append("<div class='row'>" +
          "<div class='col-2 pl-2 pt-4 chosenQuestions'>" + i++ + ").</div>" +

          "<div class='col-10 chosenQuestions py-2 pr-4' data-toggle='modal' data-target='.chosenQuestionModal" + value.id + "' data-question='" + value + "'>" +
          value.name + "</div>" +

          "<div class='modal fade chosenQuestionModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
          "<div class='modal-dialog' role='document'>" +
          "<div class='modal-content'>" +

          "<div class='modal-body'>" +
          "<div class='pb-4'><b>Question: </b>" + value.name + "</div>" +
          "<div class='pb-4'><b>Description: </b>" + value.body + "</div>" +
          "<div class='pb-4'><b>Marks: </b>" + value.marks + "</div>" +
          "<div class='pt-3 pb-1'> <b>Test Cases<b></div>" +
          (value.test_cases[0] ? "<div class='row py-0' style='height:auto; border:none;'><div class='col-6 text-center'>" + value.test_cases[0].input + "</div><div class='col-6 text-center'>" + value.test_cases[0].output + "</div></div>" : "<div></div>") +
          (value.test_cases[1] ? "<div class='row py-0' style='height:auto; border:none;'><div class='col-6 text-center'>" + value.test_cases[1].input + "</div><div class='col-6 text-center'>" + value.test_cases[1].output + "</div></div>" : "<div></div>") +
          (value.test_cases[2] ? "<div class='row py-0' style='height:auto; border:none;'><div class='col-6 text-center'>" + value.test_cases[2].input + "</div><div class='col-6 text-center'>" + value.test_cases[2].output + "</div></div>" : "<div></div>") +
          (value.test_cases[3] ? "<div class='row py-0' style='height:auto; border:none;'><div class='col-6 text-center'>" + value.test_cases[3].input + "</div><div class='col-6 text-center'>" + value.test_cases[3].output + "</div></div>" : "<div></div>") +
          (value.test_cases[4] ? "<div class='row py-0' style='height:auto; border:none;'><div class='col-6 text-center'>" + value.test_cases[4].input + "</div><div class='col-6 text-center'>" + value.test_cases[4].output + "</div></div>" : "<div></div>") +

          (value.source == 'faculty' || value.source == 'Faculty' ? "<div class='pb-3' style='text-align:center;'><button class='btn btn-primary'><a style='color:white; text-decoration:none' href='addCodeQues.html?id=" + test_id + "'>Edit</a></button></div>" : "<div></div>") +
          "</div>" +

          "</div>" +
          "</div>" +
          "</div>" +
          "</div>")
      });
    }
  }



  function getUnits() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getUnits?subject_id=' + subject_id + '&university_degree_department_id=' + `${$user.university_degree_department_id}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result);
        if (result.status == 200) {
          $('#selectUnit').empty();
          $.each(result.data, function (key, value) {
            $('#selectUnit').append("<option value='" + value.id + "'>" + value.name + "</option>");
          });
        }
        else {
          new Notify({
            title: 'Error',
            text: result.message,
            autoclose: true,
            status: 'error',
            autotimeout: 3000
          });
        }

        $("#selectUnit").val($("#selectUnit option:first").val());
        console.log($("#selectUnit option:first").val())
        getTopics($("#selectUnit option:first").val())

      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });

  }


  $('#selectUnit').on('change', function () {
    let unit = $(this).find(':selected').val()
    console.log(unit)
    subTopicsId = []
    topicsId = []
    grandTopicsId = []
    i = 1;
    $('.chooseQues').empty();
    $('.chooseQues').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Questions</h5></div</div>");
    getTopics(unit)
  })




  function getTopics(unit) {
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
              //console.log(value);
              $.each(value.topic, function (key, unitTopic) {
                // console.log(unitTopic)
                if (unitTopic.type === "GSubtopic") {
                  subTopicsId.push(unitTopic.topic_id)
                }
                else if (unitTopic.type === "GTopic") {
                  topicsId.push(unitTopic.topic_id)
                }
                else {
                  grandTopicsId.push(unitTopic.topic_id)
                }
                $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + unitTopic.topic_id + "' data-type='" + unitTopic.type + "'data-id='" + unitTopic.topic_id + "' data-code='" + unitTopic.topic_code + "' name='topicTagAdd' id='topicTagAdd" + unitTopic.topic_id + "' checked/><label for='topicTagAdd" + unitTopic.topic_id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i>" + unitTopic.topic_name + "</label></li>");
              })
            });
            // console.log(topicsId)
            // console.log(subTopicsId)
            // console.log(grandTopicsId)
            getAllQuestions(unit)
          }
        }
        else {
          $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }




  $(document).on('change', '.topicTagsInput', function () {

    if ($(this).data('type') === "GSubtopic") {
      if ($(this).is(':checked')) {
        if (!subTopicsId.includes($(this).data('id'))) {
          subTopicsId.push($(this).data('id'))
        }
      }
      else {
        subTopicsId.splice(subTopicsId.indexOf($(this).data('id')), 1)
      }
    }

    else if ($(this).data('type') === "GTopic") {
      if ($(this).is(':checked')) {
        if (!topicsId.includes($(this).data('id'))) {
          topicsId.push($(this).data('id'))
        }
      }
      else {
        topicsId.splice(topicsId.indexOf($(this).data('id')), 1)
      }
    }

    else {
      if ($(this).is(':checked')) {
        if (!grandTopicsId.includes($(this).data('id'))) {
          grandTopicsId.push($(this).data('id'))
        }
      }
      else {
        grandTopicsId.splice(grandTopicsId.indexOf($(this).data('id')), 1)
      }
    }

    console.log(topicsId)
    console.log(subTopicsId)
    console.log(grandTopicsId)

    //getAllQuestions()


  })




  function getAllQuestions(unit) {
    //$('.addingQues').empty()
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/codeEditor/getUnitCodingProblems?unit_id=' + unit + '&grand_topic_ids=' + grandTopicsId + '&topic_ids=' + topicsId + '&sub_topic_ids=' + subTopicsId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        $('.chooseQues').empty();
        console.log(result)
        if (result.status == 200 && result.data) {



          //pushing question values
          $.each(result.data, function (key, value) {
            if (!questions_values.find(x => x.id === value.id)) {
              questions_values.push(value)
            }

            let marks = ""
            preAddedQues.forEach(function (ques) {
              if (ques.id == value.id) {
                if (ques.marks == "None") {
                  marks = 0;
                }
                else {
                  marks = Number(ques.marks)
                }

              }
            });
            console.log(value)


            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><div class='row no-gutters'><div class='col-9'>" + i + ".) " + value.name +
              "</div><div class='col-2' style:'color:green'><input type='text' placeholder='Enter marks' class='marksInput' id='marks" + value.id + "' value='" + marks + "' /></div><div class='col-1'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.code + "'" +
              " name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ ></div>" +


              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' " +
              ">View More</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-1'><b>Question: </b>" + value.name + "</div>" +
              "<div class='pb-1'><b>Description: </b>" + value.body + "</div>" +
              "<div class='pt-3 pb-1'> <b>Test Cases<b></div>" +
              (value.test_cases[0] ? "<div class='row'><div class='col-6 text-center'>" + value.test_cases[0].input + "</div><div class='col-6 text-center'>" + value.test_cases[0].output + "</div></div>" : "<div></div>") +
              (value.test_cases[1] ? "<div class='row'><div class='col-6 text-center'>" + value.test_cases[1].input + "</div><div class='col-6 text-center'>" + value.test_cases[1].output + "</div></div>" : "<div></div>") +
              (value.test_cases[2] ? "<div class='row'><div class='col-6 text-center'>" + value.test_cases[2].input + "</div><div class='col-6 text-center'>" + value.test_cases[2].output + "</div></div>" : "<div></div>") +
              (value.test_cases[3] ? "<div class='row'><div class='col-6 text-center'>" + value.test_cases[3].input + "</div><div class='col-6 text-center'>" + value.test_cases[3].output + "</div></div>" : "<div></div>") +
              (value.test_cases[4] ? "<div class='row'><div class='col-6 text-center'>" + value.test_cases[4].input + "</div><div class='col-6 text-center'>" + value.test_cases[4].output + "</div></div>" : "<div></div>") +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );

            i++;

          });

          $('.chooseQuestionsInput').each(function () {
            if (preAddedQuesId.includes($(this).data('id'))) {
              $(this).prop('checked', true)
            }
          })







        }
        else {
          $('.chooseQues').append("<div class='row pl-5'><div class='col-sm-12'><h5 class='text-center'>No Questions</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  //updating the index of the question
  i++;






  // //selecting Questions on checking of checkbox



  $(document).on('change', '.chooseQuestionsInput', function (e) {
    let currQues = {}

    currId = $(this).data('id')
    let marks = $("#marks" + currId).val()
    if (marks == "") {
      new Notify({
        title: 'Error',
        text: "Enter Marks First",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
      (e.target.checked) ? (e.target.checked) = false : (e.target.checked) = true
    }
    else {
      questions_values.forEach(function (ques) {
        if (ques.id == currId) {
          currQues.id = ques.id
          currQues.marks = marks
        }
      })
      console.log(currQues);
      (e.target.checked) ? selectedQuestions.push(currQues) : (selectedQuestions.splice(selectedQuestions.findIndex(function (x) { return x.id == currId }), 1));
      (e.target.checked) ? selectedQuestionsId.push($(this).data('id')) : (selectedQuestionsId.splice(selectedQuestionsId.indexOf($(this).data('id')), 1))
      console.log(selectedQuestionsId)
      console.log(selectedQuestions)
    }
  });





  $('#btnSave').on('click', function () {
    let qc = 0;
    qc = selectedQuestions.length + existingQuestions.length

    selectedQuestions.forEach(function (ques) {
      if (ques.marks == "None") {
        ques.marks = 0;
      }
      else {
        ques.marks = Number(ques.marks)
      }
    })

    if (selectedQuestions.length == 0 && existingQuestions.length == 0) {
      new Notify({
        title: 'Error',
        text: "Choose Questions First",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }
    else if (selectedQuestions.length == 0 && existingQuestions > 0) {
      var form = new FormData();
      form.append("test_id", test_id);
      form.append("problems", JSON.stringify(existingQuestions));
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }



      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/addCodingProblemsToTest',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          console.log(result);


          if (result.status == 200) {
            new Notify({
              title: 'Success',
              text: "Questions Added Successfully",
              autoclose: true,
              status: 'success',
              autotimeout: 3000
            });

            setTimeout(() => {
              window.location.href = `codingQuestions.html?id=${test_id}&fname=${test_name}&qc=${qc}`
            }, 2000)
          }
          else {
            new Notify({
              title: 'Error',
              text: "Error",
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

      console.log(JSON.stringify(selectedQuestions))
      var form = new FormData();
      form.append("test_id", test_id);
      form.append("problems", JSON.stringify(selectedQuestions));
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }



      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/addCodingProblemsToTest',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          console.log(result);


          if (result.status == 200) {
            new Notify({
              title: 'Success',
              text: "Questions Added Successfully",
              autoclose: true,
              status: 'success',
              autotimeout: 3000
            });

            setTimeout(() => {
              window.location.href = `codingQuestions.html?id=${test_id}&fname=${test_name}&qc=${qc}`
            }, 2000)
          }
          else {
            new Notify({
              title: 'Error',
              text: "Error",
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

  })


  //save and send btn

  $('#btnSaveSend').on('click', function () {
    console.log(selectedQuestions)
    if (selectedQuestions.length === 0 && existingQuestions.length == 0) {
      new Notify({
        title: 'Error',
        text: "Choose Questions First",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }

    else if (selectedQuestions.length == 0 && existingQuestions > 0) {
      var form = new FormData();
      form.append("test_id", test_id);
      form.append("problems", JSON.stringify(existingQuestions));
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/addCodingProblemsToTest',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {


          if (result.status == 200) {
            new Notify({
              title: 'Success',
              text: "Successfully Added the Questions",
              autoclose: true,
              status: 'success',
              autotimeout: 3000
            });
            setTimeout(() => {
              window.location.href = `sendCodingAssessment.html?test_id=${test_id}&test_name=${test_name}`
            }, 2000)
          }
          else {
            new Notify({
              title: 'Error',
              text: "Error",
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
      var form = new FormData();
      form.append("test_id", test_id);
      form.append("problems", JSON.stringify(selectedQuestions));
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/addCodingProblemsToTest',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {


          if (result.status == 200) {
            new Notify({
              title: 'Success',
              text: "Successfully Added the Questions",
              autoclose: true,
              status: 'success',
              autotimeout: 3000
            });
            setTimeout(() => {
              window.location.href = `sendCodingAssessment.html?test_id=${test_id}&test_name=${test_name}`
            }, 2000)
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



