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
  let description = ""
  let objective = false
  let question_count = 0
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
    tname = searchParams.get('tname');
    question_count = searchParams.get('qc');
    description = searchParams.get('desc')
    objective = searchParams.get('isObj')
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
        //alert(result.status);
        //alert(subSemId)
        //console.log(result.data)
        $('.getUnits').empty();

        if (result.status == 200 && result.data) {
          //let div = ""
          $.each(result.data, function (key, value) {
            //console.log(value);
            unitsIds.push(value.id)
            //$('.getUnits').append(`<div class='unitsDiv' data-id=' ${value.id} ' data-description=' ${value.description} ' data-subject_semester=' ${value.subject_semester} '> ${value.name} </div>`);
            $('.getUnits').append("<li class='getUnitsLi'><input type='radio' class='getUnitsInput' value='" + value.id + "' data-description='" + value.description + "'data-id='" + value.id + "' name='getUnitsAdd' id='getUnitsAdd" + value.id + "' /><label for='getUnitsAdd" + value.id + "' class='getUnitsLabel'>" + value.name + "</label></li>");

          });
          //$('.getUnits').append(div)
        }
        else {
          $('#getUnits').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Units in this Course</h5></div</div>");
          //alert("here");
        }

        let first_unit = "getUnitsAdd" + unitsIds[0]
        //console.log(unitsIds)
        //console.log(first_unit)
        if (unitsIds.length !== 0) {
          $("#" + first_unit).attr('checked', true)
          unit = $(".getUnitsInput:checked").val();
          subTopicsId = []
          topicsId = []
          grandTopicsId = []
          getTopics()
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


  //arrays for selected questions
  let selectedQuestions = []
  let selectedQuestionsId = []


  //changing unit on selecting of radio
  let unit = 0
  $(document).on('click', '.getUnitsInput', function () {
    //alert("hello")
    unit = $(".getUnitsInput:checked").val();
    selectedQuestionsId = []
    selectedQuestions = []
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

          if (result.data == "") {
            $('#topicTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No topics to fetch</h5></div</div>");

          } else {

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
    //$('.addingQues').empty()
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
        //$('.addingQues').empty()
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {

            //console.log(value)


            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "' data-value='" + JSON.stringify(value) +
              "' name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ >" + value.name +
              "<div class='answers pt-2 pl-4' style='background-color: transparent;'>Answer:  " +
              (value.questions_options[0] ? value.questions_options[0].is_answer == 1 ? "<span>" + value.questions_options[0].name + "</span>" : "" : "") +
              (value.questions_options[1] ? value.questions_options[1].is_answer == 1 ? "<span>" + value.questions_options[1].name + "</span>" : "" : "") +
              (value.questions_options[2] ? value.questions_options[2].is_answer == 1 ? "<span>" + value.questions_options[2].name + "</span>" : "" : "") +
              (value.questions_options[3] ? value.questions_options[3].is_answer == 1 ? "<span>" + value.questions_options[3].name + "</span>" : "" : "") +
              (value.questions_options[4] ? value.questions_options[4].is_answer == 1 ? "<span>" + value.questions_options[4].name + "</span>" : "" : "") +


              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' data-question='" + JSON.stringify(value) +
              "'>viewMore</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-4'>" + value.name + "</div>" +
              (value.question_img == " " ? "" : "<img src='" + value.question_img + "' alt='img' style='width:100px; height:75px;'></img>") +
              (value.questions_options[0] ? "<div style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.stringify(value.questions_options[0].name) + "</div>" : "") +
              (value.questions_options[0] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[1] ? "<div style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.stringify(value.questions_options[1].name) + "</div>" : "") +
              (value.questions_options[1] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[2] ? "<div style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.stringify(value.questions_options[2].name) + "</div>" : "") +
              (value.questions_options[2] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[3] ? "<div style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.stringify(value.questions_options[3].name) + "</div>" : "") +
              (value.questions_options[3] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[4] ? "<div style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.stringify(value.questions_options[4].name) + "</div>" : "") +
              (value.questions_options[4] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

              (value.hint ? "<div style='font-size:12px;'>Hint :" + value.hint + "</div>" : "") +
              (value.hint_image ? "<img src='" + value.hint_image + "' alt='img' style='width:100px; height:75px;'></img>" : "") +
              (value.solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + value.solution + "</div>") +
              (value.solution_image == "" ? "" : "<img src='" + value.solution_image + "' alt='img' style='width:100px; height:75px;'></img>") +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );



          });

          //$('.addingQues').empty()
          questionsOfTest()
          MathJax.typesetPromise();
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


            if (value.blooms_level == blooms_lvl) {
              $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
                "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "' data-value=`" + JSON.stringify(value) +
                "` name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ >" + value.name +
                "<div class='answers pt-2 pl-4' style='background-color: transparent;'>Answer:  " +
                (value.questions_options[0] ? value.questions_options[0].is_answer == 1 ? "<span>" + value.questions_options[0].name + "</span>" : "" : "") +
                (value.questions_options[1] ? value.questions_options[1].is_answer == 1 ? "<span>" + value.questions_options[1].name + "</span>" : "" : "") +
                (value.questions_options[2] ? value.questions_options[2].is_answer == 1 ? "<span>" + value.questions_options[2].name + "</span>" : "" : "") +
                (value.questions_options[3] ? value.questions_options[3].is_answer == 1 ? "<span>" + value.questions_options[3].name + "</span>" : "" : "") +
                (value.questions_options[4] ? value.questions_options[4].is_answer == 1 ? "<span>" + value.questions_options[4].name + "</span>" : "" : "") +


                " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' data-question='" + JSON.stringify(value) +
                "'>viewMore</button></div></li>" +


                "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
                "<div class='modal-dialog' role='document'>" +
                "<div class='modal-content'>" +

                "<div class='modal-body'>" +
                "<div class='pb-4'>" + value.name + "</div>" +
                (value.question_img == " " ? "" : "<img src='" + value.question_img + "' alt='img' style='width:100px; height:75px;'></img>") +
                (value.questions_options[0] ? "<div style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.stringify(value.questions_options[0].name) + "</div>" : "") +
                (value.questions_options[0] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[1] ? "<div style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.stringify(value.questions_options[1].name) + "</div>" : "") +
                (value.questions_options[1] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[2] ? "<div style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.stringify(value.questions_options[2].name) + "</div>" : "") +
                (value.questions_options[2] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[3] ? "<div style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.stringify(value.questions_options[3].name) + "</div>" : "") +
                (value.questions_options[3] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[4] ? "<div style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.stringify(value.questions_options[4].name) + "</div>" : "") +
                (value.questions_options[4] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

                (value.hint ? "<div style='font-size:12px;'>Hint :" + value.hint + "</div>" : "") +
                (value.hint_image ? "<img src='" + value.hint_image + "' alt='img' style='width:100px; height:75px;'></img>" : "") +
                (value.solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + value.solution + "</div>") +
                (value.solution_image == "" ? "" : "<img src='" + value.solution_image + "' alt='img' style='width:100px; height:75px;'></img>") +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
              );
            }
          });
          //$('.addingQues').empty()
          questionsOfTest()
          MathJax.typesetPromise();

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
    selectedQuestionsId = []
    selectedQuestions = []
    getAllQuestions()
    $('#navAll').css({ "color": "black", "font-weight": "bolder" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })


  $('#navRemember').on('click', function () {
    selectedQuestionsId = []
    selectedQuestions = []
    getBloomQuestions(1)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "black", "font-weight": "bolder" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })

  $('#navUnderstand').on('click', function () {
    selectedQuestionsId = []
    selectedQuestions = []
    getBloomQuestions(2)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "black", "font-weight": "bolder" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })

  $('#navApply').on('click', function () {
    selectedQuestionsId = []
    selectedQuestions = []
    getBloomQuestions(3)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "black", "font-weight": "bolder" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal" })
  })

  $('#navAnalyze').on('click', function () {
    selectedQuestionsId = []
    selectedQuestions = []
    getBloomQuestions(4)
    $('#navAll').css({ "color": "gray", "font-weight": "normal" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal" })
    $('#navAnalyze').css({ "color": "black", "font-weight": "bolder" })
  })





  //adding pre addded questions

  function questionsOfTest() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestQuestions?test_id=' + tId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        // alert(result.message);

        if (result.status == 200 && result.data) {
          $('.addingQues').empty()

          $.each(result.data, function (key, value) {
            // alert(value.id);
            //console.log(selectedQuestionsId)
            if (!selectedQuestionsId.includes(value.id)) {
              selectedQuestionsId.push(value.id);
              //console.log(selectedQuestionsId)
            }
            if (!selectedQuestions.includes(value)) {
              selectedQuestions.push(value);
            }
            console.log(selectedQuestionsId)

            $('.chooseQuestionsInput').each(function () {
              if (selectedQuestionsId.includes($(this).data('id'))) {
                $(this).prop('checked', true)
              }
            })

          });

          //$('.addingQues').empty()
          //alert("hello")
          //displaying the already selected questions
          for (let i = 0; i < selectedQuestions.length; i++) {



            //console.log(selectedQuestions[i].questions_options[0].name)
            $('.addingQues').append("<div class='chosenQuestions my-2 p-2' style='background:#e6e6e6;border-radius: 10px;cursor:pointer;' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
              selectedQuestions[i].name + "</div>" +

              "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-4'>" + selectedQuestions[i].name + "</div>" +
              (selectedQuestions[i].questions_options[0] ? "<div style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[0].name) + "</div>" : "<div></div>") +
              (selectedQuestions[i].questions_options[1] ? "<div style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[1].name) + "</div>" : "<div></div>") +
              (selectedQuestions[i].questions_options[2] ? "<div style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[2].name) + "</div>" : "<div></div>") +
              (selectedQuestions[i].questions_options[3] ? "<div style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[3].name) + "</div>" : "<div></div>") +
              (selectedQuestions[i].questions_options[4] ? "<div style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + JSON.stringify(selectedQuestions[i].questions_options[4].name) + "</div>" : "<div></div>") +
              "</div>" +

              "</div>" +
              "</div>" +
              "</div>")

          }


          //console.log(selectedQuestions)

        }
        MathJax.typesetPromise();
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }






  //selecting Questions on checking of checkbox



  $(document).on('change', '.chooseQuestionsInput', function (e) {
    //add Questions to a array which are selected
    (e.target.checked) ? selectedQuestions.push($(this).data('value')) : (selectedQuestions.splice(selectedQuestions.indexOf($(this).data('value')), 1));
    (e.target.checked) ? selectedQuestionsId.push($(this).data('id')) : (selectedQuestionsId.splice(selectedQuestionsId.indexOf($(this).data('id')), 1))
    console.log(selectedQuestions)
  });


  $('.addChosenQuestions').on('click', function () {
    displaySelectedQuestions()
  })

  function displaySelectedQuestions() {

    //console.log(selectedQuestions)
    if (selectedQuestions.length === 0) {
      $('.addingQues').empty()
      $('.addingQues').append("Add Questions to this Assignment")
    }
    else {
      $('.addingQues').empty()
      for (let i = 0; i < selectedQuestions.length; i++) {


        //console.log(selectedQuestions[i].questions_options[0].name)
        $('.addingQues').append("<div class='chosenQuestions my-2 p-2' style='background:#e6e6e6;border-radius: 10px;cursor:pointer;' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
          selectedQuestions[i].name + "</div>" +

          "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
          "<div class='modal-dialog' role='document'>" +
          "<div class='modal-content'>" +

          "<div class='modal-body'>" +
          "<div class='pb-4'>" + selectedQuestions[i].name + "</div>" +
          (selectedQuestions[i].question_img == " " ? "" : "<img src='" + selectedQuestions[i].question_img + "' alt='img' style='width:100px; height:75px;'></img>") +
          (selectedQuestions[i].questions_options[0] ? "<div style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.stringify(selectedQuestions[i].questions_options[0].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[0] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[1] ? "<div style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.stringify(selectedQuestions[i].questions_options[1].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[1] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[2] ? "<div style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.stringify(selectedQuestions[i].questions_options[2].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[2] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[3] ? "<div style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.stringify(selectedQuestions[i].questions_options[3].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[3] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[4] ? "<div style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.stringify(selectedQuestions[i].questions_options[4].name) + "</div>" : "") +
          (selectedQuestions[i].questions_options[4] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

          (selectedQuestions[i].hint ? "<div style='font-size:12px;'>Hint :" + selectedQuestions[i].hint + "</div>" : "") +
          (selectedQuestions[i].hint_image ? "<img src='" + selectedQuestions[i].hint_image + "' alt='img' style='width:100px; height:75px;'></img>" : "") +
          (selectedQuestions[i].solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + selectedQuestions[i].solution + "</div>") +
          (selectedQuestions[i].solution_image == "" ? "" : "<img src='" + selectedQuestions[i].solution_image + "' alt='img' style='width:100px; height:75px;'></img>") +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
        )
        MathJax.typesetPromise();

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


  //save and send btn

  $('#saveSendBtn').on('click', function () {
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
            window.location.href = `sendQuestionsPage.html?id=${subSemId}&tid=${tId}&tname=${tname}&desc=${description}&isObj=${objective}&qc=${question_count}`
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



