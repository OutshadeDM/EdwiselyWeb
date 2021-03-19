//https://stagingfacultypython.edwisely.com/questionnaire/getTopicsQuestions?question_ids=40498,40499,40500


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

  // $('#all').css({ "background-color": "orange" })

  // background-image: linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%);
  // border-radius: 56px; 
  // color: #FFFFFF !important;   
  //initial styling
  $('#navAll').css({ "background-image": "linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%)", "border-radius": "10px 0 0 0", "color": "white" })
  $('#all').css({ "background": "url('frontend/images/noteswhite.svg') no-repeat center" })
  $('#navRemember').css({ "color": "gray", "font-weight": "normal", "background-color": "white" })
  $('#navUnderstand').css({ "color": "gray", "font-weight": "normal", "background-color": "white" })
  $('#navApply').css({ "color": "gray", "font-weight": "normal", "background-color": "white" })
  $('#navAnalyze').css({ "color": "gray", "font-weight": "normal", "background-color": "white", "border-radius": "0 10px 0 0" })


  //toasts
  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 7000);
  });


  let blooms_lvl = 0
  let i = 0;


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

  //for all question values
  let questions_values = []

  //changing unit on selecting of radio
  let unit = 0
  $(document).on('click', '.getUnitsInput', function () {
    //alert("hello")
    unit = $(".getUnitsInput:checked").val();
    // selectedQuestionsId = []
    // selectedQuestions = []
    subTopicsId = []
    topicsId = []
    grandTopicsId = []
    getTopics()
    $('.chooseQues').empty();
    $('.chooseQues').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No Questions</h5></div</div>");
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


  // arrays for storing extra questions
  let moreQues = []
  let bloom_moreques = []
  let bloomlvl1_moreques = []
  let bloomlvl2_moreques = []
  let bloomlvl3_moreques = []
  let bloomlvl4_moreques = []



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
          bloom_moreques = []
          //getting the values of more questions
          $.each(result.question_ids, function (key, value) {
            moreQues.push(value)
          })

          //getting bloom lvl ques
          $.each(result.blooms_level_ids, function (key, value) {
            bloom_moreques.push(value)

          })
          //console.log(bloom_moreques)

          bloomlvl1_moreques = bloom_moreques[0]
          bloomlvl2_moreques = bloom_moreques[1]
          bloomlvl3_moreques = bloom_moreques[2]
          bloomlvl4_moreques = bloom_moreques[3]



          //pushing question values
          $.each(result.data, function (key, value) {
            if (!questions_values.find(x => x.id === value.id)) {
              questions_values.push(value)
            }


            //console.log(value)


            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><div class='row no-gutters'><div class='col-11'>Q " + i + ".) " + value.name +
              "</div><div class='col-1'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "'" +
              " name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ ></div>" +
              "</div><div class='answers pt-2 pl-4' style='background-color: transparent;'>Answer:  " +
              (value.questions_options[0] ? value.questions_options[0].is_answer == 1 ? "<span>" + value.questions_options[0].name + "</span>" : "" : "") +
              (value.questions_options[1] ? value.questions_options[1].is_answer == 1 ? "<span>" + value.questions_options[1].name + "</span>" : "" : "") +
              (value.questions_options[2] ? value.questions_options[2].is_answer == 1 ? "<span>" + value.questions_options[2].name + "</span>" : "" : "") +
              (value.questions_options[3] ? value.questions_options[3].is_answer == 1 ? "<span>" + value.questions_options[3].name + "</span>" : "" : "") +
              (value.questions_options[4] ? value.questions_options[4].is_answer == 1 ? "<span>" + value.questions_options[4].name + "</span>" : "" : "") +


              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' " +
              ">View More</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-1'>" + value.name + "</div>" +
              (value.question_img == " " ? "" : "<div class='text-center py-2'><img src='" + value.question_img + "' alt='img' style='width:200px;'></img></div>") +
              (value.questions_options[0] ? "<div class='py-1' style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(value.questions_options[0].name)) + "</div>" : "") +
              (value.questions_options[0] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:150px;' alt='img'></img>") : "") +
              (value.questions_options[1] ? "<div class='py-1' style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(value.questions_options[1].name)) + "</div>" : "") +
              (value.questions_options[1] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:150px;' alt='img'></img>") : "") +
              (value.questions_options[2] ? "<div class='py-1' style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(value.questions_options[2].name)) + "</div>" : "") +
              (value.questions_options[2] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:150px;' alt='img'></img>") : "") +
              (value.questions_options[3] ? "<div class='py-1' style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(value.questions_options[3].name)) + "</div>" : "") +
              (value.questions_options[3] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:150px;' alt='img'></img>") : "") +
              (value.questions_options[4] ? "<div class='py-1' style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(value.questions_options[4].name)) + "</div>" : "") +
              (value.questions_options[4] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:150px;' alt='img'></img>") : "") +

              (value.hint ? "<div style='font-size:12px;'>Hint :" + value.hint + "</div>" : "") +
              (value.hint_image ? "<div class='text-center py-2'><img src='" + value.hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
              (value.solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + value.solution + "</div>") +
              (value.solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + value.solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );

            i++;
            //MathJax.typesetPromise();

          });
          if (moreQues.length > 0) {
            $('.chooseQues').append("<button id='moreQuestions' class='moreQuesAll py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          //$('.addingQues').empty()
          //questionsOfTest()
          MathJax.typesetPromise();
          $('.chooseQuestionsInput').each(function () {
            if (selectedQuestionsId.includes($(this).data('id'))) {
              $(this).prop('checked', true)
            }
          })




          //console.log(questions_values)
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

  //updating the index of the question
  i++;

  //on click of the view more ques button
  $(document).on('click', '.moreQuesAll', function () {
    $('.moreQuesAll').remove()


    //storing the questions to display in an array
    let more_all_questions = []
    for (let i = 0; i < (moreQues.length < 31 ? moreQues.length : 30); i++) {
      console.log(more_all_questions)
      more_all_questions.push(moreQues.shift())
    }
    console.log(more_all_questions)


    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getTopicsQuestions?question_ids=' + more_all_questions,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert("hello")
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {
            if (!questions_values.find(x => x.id === value.id)) {
              questions_values.push(value)
            }

            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><div class='row no-gutters'><div class='col-11'> Q " + i + ".) " + value.name +
              "</div><div class='col-1'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "'" +
              " name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ ></div>" +
              "</div><div class='answers pt-2 pl-4' style='background-color: transparent;'>Answer:  " +
              (value.questions_options[0] ? value.questions_options[0].is_answer == 1 ? "<span>" + value.questions_options[0].name + "</span>" : "" : "") +
              (value.questions_options[1] ? value.questions_options[1].is_answer == 1 ? "<span>" + value.questions_options[1].name + "</span>" : "" : "") +
              (value.questions_options[2] ? value.questions_options[2].is_answer == 1 ? "<span>" + value.questions_options[2].name + "</span>" : "" : "") +
              (value.questions_options[3] ? value.questions_options[3].is_answer == 1 ? "<span>" + value.questions_options[3].name + "</span>" : "" : "") +
              (value.questions_options[4] ? value.questions_options[4].is_answer == 1 ? "<span>" + value.questions_options[4].name + "</span>" : "" : "") +


              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' " +
              ">View More</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-1'>" + value.name + "</div>" +
              (value.question_img == " " ? "" : "<img src='" + value.question_img + "' alt='img' style='width:100px; height:75px;'></img>") +
              (value.questions_options[0] ? "<div class='py-1' style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(value.questions_options[0].name)) + "</div>" : "") +
              (value.questions_options[0] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[1] ? "<div class='py-1' style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(value.questions_options[1].name)) + "</div>" : "") +
              (value.questions_options[1] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[2] ? "<div class='py-1' style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(value.questions_options[2].name)) + "</div>" : "") +
              (value.questions_options[2] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[3] ? "<div class='py-1' style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(value.questions_options[3].name)) + "</div>" : "") +
              (value.questions_options[3] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[4] ? "<div class='py-1' style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(value.questions_options[4].name)) + "</div>" : "") +
              (value.questions_options[4] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

              (value.hint ? "<div style='font-size:12px;'>Hint :" + value.hint + "</div>" : "") +
              (value.hint_image ? "<div class='text-center py-2'><img src='" + value.hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
              (value.solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + value.solution + "</div>") +
              (value.solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + value.solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );

            i++;

          })
          if (moreQues.length > 0) {
            $('.chooseQues').append("<button id='moreQuestions' class='moreQuesAll py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }

        }
        MathJax.typesetPromise();
        $('.chooseQuestionsInput').each(function () {
          if (selectedQuestionsId.includes($(this).data('id'))) {
            $(this).prop('checked', true)
          }
        })



      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });

  })




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

          bloom_moreques = []

          //getting the values of more questions
          $.each(result.question_ids, function (key, value) {
            moreQues.push(value)
          })

          //getting bloom lvl ques
          $.each(result.blooms_level_ids, function (key, value) {
            bloom_moreques.push(value)

          })
          //console.log(bloom_moreques)

          bloomlvl1_moreques = bloom_moreques[0]
          bloomlvl2_moreques = bloom_moreques[1]
          bloomlvl3_moreques = bloom_moreques[2]
          bloomlvl4_moreques = bloom_moreques[3]



          $.each(result.data, function (key, value) {
            // if (!questions_values.find(x => x.id === value.id)) {
            //   questions_values.push(value)
            // }

            if (value.blooms_level == blooms_lvl) {
              $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><div class='row no-gutters'><div class='col-11'>Q " + i + ".)  " + value.name +
                "</div><div class='col-1'><input type='checkbox' class='chooseQuestionsInput mx-3' value='" + value.id +
                "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "'" +
                " name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ ></div>" +
                "</div><div class='answers pt-2 pl-4' style='background-color: transparent;'>Answer:  " +
                (value.questions_options[0] ? value.questions_options[0].is_answer == 1 ? "<span>" + value.questions_options[0].name + "</span>" : "" : "") +
                (value.questions_options[1] ? value.questions_options[1].is_answer == 1 ? "<span>" + value.questions_options[1].name + "</span>" : "" : "") +
                (value.questions_options[2] ? value.questions_options[2].is_answer == 1 ? "<span>" + value.questions_options[2].name + "</span>" : "" : "") +
                (value.questions_options[3] ? value.questions_options[3].is_answer == 1 ? "<span>" + value.questions_options[3].name + "</span>" : "" : "") +
                (value.questions_options[4] ? value.questions_options[4].is_answer == 1 ? "<span>" + value.questions_options[4].name + "</span>" : "" : "") +


                " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' " +
                ">View More</button></div></li>" +


                "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
                "<div class='modal-dialog' role='document'>" +
                "<div class='modal-content'>" +

                "<div class='modal-body'>" +
                "<div class='pb-1'>" + value.name + "</div>" +
                (value.question_img == " " ? "" : "<div class='text-center py-2'><div class='text-center py-2'><img src='" + value.question_img + "' alt='img' style='width:100px; height:75px;'></img></div>") +
                (value.questions_options[0] ? "<div class='py-1' style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(value.questions_options[0].name)) + "</div>" : "") +
                (value.questions_options[0] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[1] ? "<div class='py-1' style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(value.questions_options[1].name)) + "</div>" : "") +
                (value.questions_options[1] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[2] ? "<div class='py-1' style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(value.questions_options[2].name)) + "</div>" : "") +
                (value.questions_options[2] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[3] ? "<div class='py-1' style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(value.questions_options[3].name)) + "</div>" : "") +
                (value.questions_options[3] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
                (value.questions_options[4] ? "<div class='py-1' style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(value.questions_options[4].name)) + "</div>" : "") +
                (value.questions_options[4] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

                (value.hint ? "<div style='font-size:12px;'>Hint :" + value.hint + "</div>" : "") +
                (value.hint_image ? "<div class='text-center py-2'><img src='" + value.hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
                (value.solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + value.solution + "</div>") +
                (value.solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + value.solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +
                "</div>" +
                "</div>" +
                "</div>" +
                "</div>"
              );
              //MathJax.typesetPromise();
              i++;
            }


          });

          if (blooms_lvl == 1) {
            $('.chooseQues').append("<button id='moreBloomQues1' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          else if (blooms_lvl == 2) {
            $('.chooseQues').append("<button id='moreBloomQues2' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          else if (blooms_lvl == 3) {
            $('.chooseQues').append("<button id='moreBloomQues3' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          else {
            $('.chooseQues').append("<button id='moreBloomQues4' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }



          //$('.addingQues').empty()
          //questionsOfTest()
          MathJax.typesetPromise();
          $('.chooseQuestionsInput').each(function () {
            if (selectedQuestionsId.includes($(this).data('id'))) {
              $(this).prop('checked', true)
            }
          })


          //on click of view more questoions button








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

  $(document).on('click', '.bloomQues', function () {
    $('.bloomQues').remove()

    //storing the questions to display in an array
    let more_bloom_questions = []

    if (blooms_lvl == 1) {
      for (let i = 0; i < (bloomlvl1_moreques.length < 31 ? bloomlvl1_moreques.length : 30); i++) {
        more_bloom_questions.push(bloomlvl1_moreques.shift())
      }
      console.log(more_bloom_questions)
    }
    else if (blooms_lvl == 2) {
      for (let i = 0; i < (bloomlvl2_moreques.length < 31 ? bloomlvl2_moreques.length : 30); i++) {
        more_bloom_questions.push(bloomlvl2_moreques.shift())
      }
      console.log(more_bloom_questions)
    }
    else if (blooms_lvl == 3) {
      for (let i = 0; i < (bloomlvl3_moreques.length < 31 ? bloomlvl3_moreques.length : 30); i++) {
        more_bloom_questions.push(bloomlvl3_moreques.shift())
      }
      console.log(more_bloom_questions)
    }
    else {
      for (let i = 0; i < (bloomlvl4_moreques.length < 11 ? bloomlvl4_moreques.length : 10); i++) {
        more_bloom_questions.push(bloomlvl4_moreques.shift())
      }
      console.log(more_bloom_questions)
    }



    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getTopicsQuestions?question_ids=' + more_bloom_questions,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        //alert("hello")
        if (result.status == 200 && result.data) {
          $.each(result.data, function (key, value) {
            if (!questions_values.find(x => x.id === value.id)) {
              questions_values.push(value)
            }

            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><div class='row no-gutters'> " +
              "<div class='col-11'> Q " + i + " .)  " + value.name +
              "</div><div class='col-1'><input type='checkbox' class='chooseQuestionsInput mx-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "'" +
              " name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ >" +
              "</div></div><div class='answers pt-2 pl-4' style='background-color: transparent;'>Answer:  " +
              (value.questions_options[0] ? value.questions_options[0].is_answer == 1 ? "<span>" + value.questions_options[0].name + "</span>" : "" : "") +
              (value.questions_options[1] ? value.questions_options[1].is_answer == 1 ? "<span>" + value.questions_options[1].name + "</span>" : "" : "") +
              (value.questions_options[2] ? value.questions_options[2].is_answer == 1 ? "<span>" + value.questions_options[2].name + "</span>" : "" : "") +
              (value.questions_options[3] ? value.questions_options[3].is_answer == 1 ? "<span>" + value.questions_options[3].name + "</span>" : "" : "") +
              (value.questions_options[4] ? value.questions_options[4].is_answer == 1 ? "<span>" + value.questions_options[4].name + "</span>" : "" : "") +


              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' " +
              ">View More</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-1'>" + value.name + "</div>" +
              (value.question_img == " " ? "" : "<div class='text-center py-2'><img src='" + value.question_img + "' alt='img' style='width:100px; height:75px;'></img></div>") +
              (value.questions_options[0] ? "<div class='py-1' style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(value.questions_options[0].name)) + "</div>" : "") +
              (value.questions_options[0] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[1] ? "<div class='py-1' style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(value.questions_options[1].name)) + "</div>" : "") +
              (value.questions_options[1] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[2] ? "<div class='py-1' style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(value.questions_options[2].name)) + "</div>" : "") +
              (value.questions_options[2] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[3] ? "<div class='py-1' style='" + (value.questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(value.questions_options[3].name)) + "</div>" : "") +
              (value.questions_options[3] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (value.questions_options[4] ? "<div class='py-1' style='" + (value.questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(value.questions_options[4].name)) + "</div>" : "") +
              (value.questions_options[4] ? (value.questions_options[0].option_img == " " ? "" : "<img src='" + value.questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

              (value.hint ? "<div style='font-size:12px;'>Hint :" + value.hint + "</div>" : "") +
              (value.hint_image ? "<div class='text-center py-2'><img src='" + value.hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
              (value.solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + value.solution + "</div>") +
              (value.solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + value.solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );

            i++;
          })
          if (blooms_lvl == 1) {
            $('.chooseQues').append("<button id='moreBloomQues1' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          else if (blooms_lvl == 2) {
            $('.chooseQues').append("<button id='moreBloomQues2' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          else if (blooms_lvl == 3) {
            $('.chooseQues').append("<button id='moreBloomQues3' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }
          else {
            $('.chooseQues').append("<button id='moreBloomQues4' class='bloomQues py-2 font-weight-bold'> MORE QUESTIONS</button>")
          }

        }
        MathJax.typesetPromise();
        $('.chooseQuestionsInput').each(function () {
          if (selectedQuestionsId.includes($(this).data('id'))) {
            $(this).prop('checked', true)
          }
        })



      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });

  })







  //CSS styling on click


  $('#navAll').css({ "color": "white", })



  $('#navAll').on('click', function () {
    //selectedQuestionsId = []
    //selectedQuestions = []
    //questions_values = []
    moreQues = []
    console.log(moreQues)
    i = 1
    getAllQuestions()
    $('#navAll').css({ "color": "white", "background-image": "linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%)", "border-radius": "10px 0 0 0" })
    $('#all').css({ "background": "url('frontend/images/noteswhite.svg') no-repeat center" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#rem').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#und').css({ "background": "url('frontend/images/Page-1.svg') no-repeat center" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#app').css({ "background": "url('frontend/images/startup.svg') no-repeat center" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#ana').css({ "background": "url('frontend/images/electric-light-bulb.svg') no-repeat center" })
  })


  $('#navRemember').on('click', function () {
    //selectedQuestionsId = []
    //selectedQuestions = []
    moreQues = []
    console.log(moreQues)
    blooms_lvl = 1
    i = 1
    getBloomQuestions(1)
    $('#navAll').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#all').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navRemember').css({ "color": "white", "background-image": "linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%)" })
    $('#rem').css({ "background": "url('frontend/images/noteswhite.svg') no-repeat center" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#und').css({ "background": "url('frontend/images/Page-1.svg') no-repeat center" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#app').css({ "background": "url('frontend/images/startup.svg') no-repeat center" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#ana').css({ "background": "url('frontend/images/electric-light-bulb.svg') no-repeat center" })
  })

  $('#navUnderstand').on('click', function () {
    //selectedQuestionsId = []
    //selectedQuestions = []
    moreQues = []
    console.log(moreQues)
    blooms_lvl = 2
    i = 1
    getBloomQuestions(2)
    $('#navAll').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#all').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#rem').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navUnderstand').css({ "color": "white", "background-image": "linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%)" })
    $('#und').css({ "background": "url('frontend/images/Page-1white.svg') no-repeat center" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#app').css({ "background": "url('frontend/images/startup.svg') no-repeat center" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#ana').css({ "background": "url('frontend/images/electric-light-bulb.svg') no-repeat center" })
  })

  $('#navApply').on('click', function () {
    //selectedQuestionsId = []
    //selectedQuestions = []
    moreQues = []
    console.log(moreQues)
    blooms_lvl = 3
    i = 1
    getBloomQuestions(3)
    $('#navAll').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#all').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#rem').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#und').css({ "background": "url('frontend/images/Page-1.svg') no-repeat center" })
    $('#navApply').css({ "color": "white", "background-image": "linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%)" })
    $('#app').css({ "background": "url('frontend/images/startupwhite.svg') no-repeat center" })
    $('#navAnalyze').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#ana').css({ "background": "url('frontend/images/electric-light-bulb.svg') no-repeat center" })
  })

  $('#navAnalyze').on('click', function () {
    //selectedQuestionsId = []
    //selectedQuestions = []
    moreQues = []
    console.log(moreQues)
    blooms_lvl = 4
    i = 1
    getBloomQuestions(4)
    $('#navAll').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#all').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navRemember').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#rem').css({ "background": "url('frontend/images/notes.svg') no-repeat center" })
    $('#navUnderstand').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#und').css({ "background": "url('frontend/images/Page-1.svg') no-repeat center" })
    $('#navApply').css({ "color": "gray", "font-weight": "normal", "background-image": "none" })
    $('#app').css({ "background": "url('frontend/images/startup.svg') no-repeat center" })
    $('#navAnalyze').css({ "color": "white", "background-image": "linear-gradient(131deg, #7175E0 0%, #4D50CB 33%, #E25BC8 100%)", "border-radius": "0 10px 0 0" })
    $('#ana').css({ "background": "url('frontend/images/electric-light-bulbwhite.svg') no-repeat center" })
  })





  //adding pre addded questions
  questionsOfTest()
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
            //console.log(selectedQuestionsId)

            $('.chooseQuestionsInput').each(function () {
              if (selectedQuestionsId.includes($(this).data('id'))) {
                $(this).prop('checked', true)
              }
            })

          });

          //$('.addingQues').empty()
          //alert("hello")
          //displaying the already selected questions
          //console.log(selectedQuestions)
          for (let i = 0; i < selectedQuestions.length; i++) {



            //console.log(selectedQuestions[i].questions_options[0].name)
            $('.addingQues').append("<div class='row'>" +
              "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q).</div>" +

              "<div class='col-10 chosenQuestions py-2 pr-4' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
              selectedQuestions[i].name + "</div>" +

              "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-4'>" + selectedQuestions[i].name + "</div>" +
              (selectedQuestions[i].question_img == "" ? "" : "<div class='text-center py-2'><img src='" + selectedQuestions[i].question_img + "' alt='img' style='width:100px; height:75px;'></img></div>") +
              (selectedQuestions[i].questions_options[0] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[0].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[0] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (selectedQuestions[i].questions_options[1] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[1].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[1] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (selectedQuestions[i].questions_options[2] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[2].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[2] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (selectedQuestions[i].questions_options[3] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[3].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[3] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
              (selectedQuestions[i].questions_options[4] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[4].name)) + "</div>" : "") +
              (selectedQuestions[i].questions_options[4] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

              (selectedQuestions[i].hint ? "<div style='font-size:12px;'>Hint :" + selectedQuestions[i].hint + "</div>" : "") +
              (selectedQuestions[i].hint_image ? "<div class='text-center py-2'><img src='" + selectedQuestions[i].hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
              (selectedQuestions[i].solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + selectedQuestions[i].solution + "</div>") +
              (selectedQuestions[i].solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + selectedQuestions[i].solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +
              "</div>" +

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
    //work on this part
    //(e.target.checked) ? selectedQuestions.push($(this).data('value')) : (selectedQuestions.splice(selectedQuestions.indexOf($(this).data('value')), 1));
    let currQues = {}

    currId = $(this).data('id')


    questions_values.forEach(function (ques) {
      //console.log(ques.id)
      //console.log($(this).data('id'))
      if (ques.id == currId) {
        currQues = ques
        //console.log(ques)
      }
    });
    (e.target.checked) ? selectedQuestions.push(currQues) : (selectedQuestions.splice(selectedQuestions.findIndex(function (x) { return x.id == currId }), 1));
    (e.target.checked) ? selectedQuestionsId.push($(this).data('id')) : (selectedQuestionsId.splice(selectedQuestionsId.indexOf($(this).data('id')), 1))
    console.log(selectedQuestionsId)
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
        $('.addingQues').append("<div class='row'>" +
          "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q).</div>" +

          "<div class='col-10 chosenQuestions py-2 pr-4' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
          selectedQuestions[i].name + "</div>" +

          "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
          "<div class='modal-dialog' role='document'>" +
          "<div class='modal-content'>" +

          "<div class='modal-body'>" +
          "<div class='pb-1'>" + selectedQuestions[i].name + "</div>" +
          (selectedQuestions[i].question_img == " " ? "" : "<div class='text-center py-2'><img src='" + selectedQuestions[i].question_img + "' alt='img' style='width:100px; height:75px;'></img></div>") +
          (selectedQuestions[i].questions_options[0] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[0].name)) + "</div>" : "") +
          (selectedQuestions[i].questions_options[0] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[1] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[1].name)) + "</div>" : "") +
          (selectedQuestions[i].questions_options[1] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[2] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[2].name)) + "</div>" : "") +
          (selectedQuestions[i].questions_options[2] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[3] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[3].name)) + "</div>" : "") +
          (selectedQuestions[i].questions_options[3] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          (selectedQuestions[i].questions_options[4] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[4].name)) + "</div>" : "") +
          (selectedQuestions[i].questions_options[4] ? (selectedQuestions[i].questions_options[0].option_img == " " ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

          (selectedQuestions[i].hint ? "<div style='font-size:12px;'>Hint :" + selectedQuestions[i].hint + "</div>" : "") +
          (selectedQuestions[i].hint_image ? "<div class='text-center py-2'><img src='" + selectedQuestions[i].hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
          (selectedQuestions[i].solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + selectedQuestions[i].solution + "</div>") +
          (selectedQuestions[i].solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + selectedQuestions[i].solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>" +
          "</div>"
        )
        MathJax.typesetPromise();

      }
    }
  }

  $('#btnSave').on('click', function () {
    if (selectedQuestions.length == 0) {
      $('#errorToastBody').text("Choose Questions First");
      $('#errorToast').toast('show');
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
            $('#successToastBody').text("Questions Updates Successfully");
            $('#successToast').toast('show');

            //   setInterval(function () {
            //     window.location.replace('myAssessment.html');
            //   }, 2000)
            setTimeout(() => {
              window.location.href = "myAssessment.html"
            }, 2000)
          }
          else {
            $('#errorToastBody').text("Error");
            $('#errorToast').toast('show');
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
    if (selectedQuestions.length === 0) {
      $('#errorToastBody').text("Choose Questions First");
      $('#errorToast').toast('show');
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
            $('#successToastBody').text("Successfully Updated the Questions");
            $('#successToast').toast('show');

            //   setInterval(function () {
            //     window.location.replace('myAssessment.html');
            //   }, 2000)
            setTimeout(() => {
              window.location.href = `sendQuestionsPage.html?id=${subSemId}&tid=${tId}&tname=${tname}&desc=${description}&isObj=${objective}&qc=${question_count}`
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



