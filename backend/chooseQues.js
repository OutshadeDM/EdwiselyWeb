$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }
  //alert(`${$user.token}`);

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


  //setting the name of test
  $('#courseName').append(tname)



  //for modals
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })




  //units fetching

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
        //alert(result.status);
        //alert(subSemId)
        //console.log(result.data)
        $('.getUnits').empty();

        if (result.status == 200 && result.data) {
          //let div = ""
          $.each(result.data, function (key, value) {
            //console.log(value);
            //$('.getUnits').append(`<div class='unitsDiv' data-id=' ${value.id} ' data-description=' ${value.description} ' data-subject_semester=' ${value.subject_semester} '> ${value.name} </div>`);
            $('.getUnits').append("<li class='getUnitsLi'><input type='radio' class='getUnitsInput' value='" + value.id + "' data-description='" + value.description + "'data-id='" + value.id + "' name='getUnitsAdd' id='getUnitsAdd" + value.id + "' /><label for='getUnitsAdd" + value.id + "' class='getUnitsLabel'>" + value.name + "</label></li>");

          });
          //$('.getUnits').append(div)
        }
        else {
          $('#getUnits').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Units in this Course</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }




  //arrays to store topic ids
  let subTopicsId = []
  let topicsId = []
  let grandTopicsId = []



  //changing unit on selecting of radio
  let unit = 0
  $(document).on('click', '.getUnitsInput', function () {
    //alert("hello")
    unit = $(".getUnitsInput:checked").val();
    subTopicsId = []
    topicsId = []
    grandTopicsId = []
    getTopics()
  });




  //get unit topics

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
        //alert(result.status);
        //alert(subSemId)

        $('#topicTags').empty();
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {
            // console.log(value);
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

          //fillTopics()
          getAllQuestions()

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

    getAllQuestions()


  })



  //getting the selectedQuestions api

  getAllQuestions()
  function getAllQuestions() {
    //alert("fnjmf")
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getTopicsQuestions?grand_topic_ids=' + grandTopicsId + '&topic_ids=' + topicsId + '&sub_topic_ids=' + subTopicsId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert(result.status);
        //alert(subSemId)

        $('.chooseQues').empty();
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {

            let displayedQues = ""
            if (value.name.length > 110) {
              displayedQues = value.name.substr(0, 110)
            }

            else {
              displayedQues = value.name
            }

            //console.log(value.name)

            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "' data-value='" + JSON.stringify(value) +
              "' name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/>" + displayedQues +
              "<div class='answers pt-2 pl-4' style='background-color: transparent;'>Answers:  " + value.questions_options.length +
              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' data-question='" + JSON.stringify(value) +
              "'>viewMore</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-4'>" + value.name + "</div>" +
              (value.questions_options[0] ? "<div style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(value.questions_options[0].name) + "</div>" : "") +
              (value.questions_options[1] ? "<div style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(value.questions_options[1].name) + "</div>" : "") +
              (value.questions_options[2] ? "<div style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(value.questions_options[2].name) + "</div>" : "") +
              (value.questions_options[3] ? "<div style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(value.questions_options[3].name) + "</div>" : "") +
              (value.questions_options[4] ? "<div style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(value.questions_options[4].name) + "</div>" : "") +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );

          });

        }
        else {
          $('.chooseQues').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Questions</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  //get selectedQuestions bloom wise

  function getBloomQuestions(blooms_lvl) {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getTopicsQuestions?grand_topic_ids=' + grandTopicsId + '&topic_ids=' + topicsId + '&sub_topic_ids=' + subTopicsId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert(result.status);
        //alert(subSemId)

        $('.chooseQues').empty();
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {

            let displayedQues = ""
            if (value.name.length > 110) {
              displayedQues = value.name.substr(0, 110)
            }

            else {
              displayedQues = value.name
            }
            // let answer;
            // console.log(value.questions_options.length)
            // for (let i = 0; i < value.questions_options.length; i++) {


            // }

            if (value.blooms_level == blooms_lvl) {
              $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
                "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "' data-value='" + JSON.stringify(value) +
                "' name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/>" + displayedQues +
                "<div class='answers pt-2 pl-4' style='background-color: transparent;'>Answers:  " + value.questions_options.length +
                " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal' data-question='" + JSON.stringify(value) +
                "'>viewMore</button></div></li>"

              );
            }
          });

        }
        else {
          $('.chooseQues').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Questions</h5></div</div>");
          //alert("here");
        }


      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  $('#navAll').css({ "color": "black", "font-weight": "bolder" })



  $('#navAll').on('click', function () {
    getAllQuestions()
    $('#navAll').css({ "color": "black", "font-weight": "bolder" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })


  $('#navRemember').on('click', function () {
    getBloomQuestions(1)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "black", "font-weight": "bolder" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })

  $('#navUnderstand').on('click', function () {
    getBloomQuestions(2)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "black", "font-weight": "bolder" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })

  $('#navApply').on('click', function () {
    getBloomQuestions(3)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "black", "font-weight": "bolder" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })

  $('#navAnalyze').on('click', function () {
    getBloomQuestions(4)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "black", "font-weight": "bolder" })
  })












  //selecting Questions on checking of checkbox

  let selectedQuestions = []
  let selectedQuestionsId = []

  $(document).on('change', '.chooseQuestionsInput', function (e) {
    //add Questions to a array which are selected

    (e.target.checked) ? selectedQuestions.push($(this).data('value')) : (selectedQuestions.splice(selectedQuestions.indexOf($(this).data('value')), 1));
    (e.target.checked) ? selectedQuestionsId.push($(this).data('id')) : (selectedQuestionsId.splice(selectedQuestionsId.indexOf($(this).data('id')), 1))

  });


  $('.addChosenQuestions').on('click', function () {
    displaySelectedQuestions()
  })

  function displaySelectedQuestions() {

    console.log(selectedQuestions)
    if (selectedQuestions.length === 0) {
      $('.addingQues').empty()
      $('.addingQues').append("Add Questions to this Assignment")
    }
    else {
      $('.addingQues').empty()
      for (let i = 0; i < selectedQuestions.length; i++) {


        console.log(selectedQuestions[i].questions_options[0].name)
        $('.addingQues').append("<div class='chosenQuestions my-2 p-2' style='background:#e6e6e6;border-radius: 10px;cursor:pointer;' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
          selectedQuestions[i].name.substr(0, 110) + "</div>" +

          "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
          "<div class='modal-dialog' role='document'>" +
          "<div class='modal-content'>" +

          "<div class='modal-body'>" +
          "<div class='pb-4'>" + selectedQuestions[i].name + "</div>" +
          (selectedQuestions[i].questions_options[0] ? "<div style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[0].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[1] ? "<div style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[1].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[2] ? "<div style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[2].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[3] ? "<div style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[3].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[4] ? "<div style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[4].name) + "</div>" : "") +
          "</div>" +

          "</div>" +
          "</div>" +
          "</div>")

      }
    }
  }

  $('#saveQuestionsBtn').on('click', function () {
    if (selectedQuestions.length === 0) {
      alert("Choose Questions First !")
    }


    else {

      var form = new FormData();
      form.append("test_id", tId);
      form.append("questions", "[" + selectedQuestionsId.join(',') + "]");
      form.append("units", "[" + unit + "]")
      // for (var key of form.entries()) {
      //   alert(key[1]);
      // }


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
          //console.log('4') 

          if (result.status == 200) {
            alert(result.message)

            //   setInterval(function () {
            //     window.location.replace('myAssessment.html');
            //   }, 2000)

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



