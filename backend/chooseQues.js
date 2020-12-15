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
  let unit_id = "";
  // let units = [];
  if (searchParams.has('id') && searchParams.has('tid')) {
    subSemId = searchParams.get('id');
    tId = searchParams.get('tid');
  }
  if (searchParams.has('uid')) {
    unit_id = searchParams.get('uid');
  }



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


  //changing unit on selecting of radio
  let unit = 0
  $(document).on('click', '.getUnitsInput', function () {
    //alert("hello")
    unit = $(".getUnitsInput:checked").val();
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
              $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + unitTopic.topic_id + "' data-type='" + unitTopic.type + "'data-id='" + unitTopic.topic_id + "' data-code='" + unitTopic.topic_code + "' name='topicTagAdd' id='topicTagAdd" + unitTopic.topic_id + "' checked/><label for='topicTagAdd" + unitTopic.topic_id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i>" + unitTopic.topic_name + "</label></li>");
            })
          });

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




  //getting the questions api


  getQuestions();
  function getQuestions() {

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getTopicsQuestions?grand_topic_ids=&topic_ids=13779,13780,13781,13782&sub_topic_ids=15835,15836,15837,15838,15839,15840,15844,15845,15846,15847,15848,15849',
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
            //console.log(value);
            //$.each(value.topic, function (key, unitTopic) {
            //console.log(unitTopic)

            //$('.chooseQues').append("<li class='chooseQuestionsLi'><input type='checkbox' class='chooseQuestionsInput' value='" + value.id + "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.code + "' name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/><label for='chooseQuestionsAdd" + value.id + "' class='chooseQuestionssLabel show1'>" + displayQues + "</label></li>");

            let displayedQues = ""
            if (value.name.length > 110) {
              displayedQues = value.name.substr(0, 110)
            }

            else {
              displayedQues = value.name
            }
            //console.log(displayedQues)
            //$('.chooseQues').append("<li class='chooseQuestionsLi px-1 py-2'><input type='checkbox' class='chooseQuestionsInput px-2' value='" + value.id + "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.code + "' name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/><label for='chooseQuestionsAdd" + value.id + "' class='chooseQuestionssLabel show1' style='background-color: transparent;'>" + displayedQues + "</label><div class='answers' style='background-color: transparent;'>Answers <button class='viewMoreBtn' style='background-color: transparent;'>viewMore</button></div></li>");

            let answer;
            //console.log(value.questions_options.length)
            for (let i = 0; i < value.questions_options.length; i++) {
              //for (let j = 0; j < value.questions_options.length; j++) {
              //console.log(value.questions_options[i])
              // if (value.questions_options[j].is_answer === 1) {
              //   answer = value.questions_options[i].name
              // }
              // break
              //}

            }


            $('.chooseQues').append("<li class='chooseQuestionsLi px-1 py-2'><input type='checkbox' class='chooseQuestionsInput px-3' value='" + value.id +
              "' data-type='" + value.type + "'data-id='" + value.id + "' data-code='" + value.type_code + "' data-value='" + JSON.stringify(value) +
              "' name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/>" + displayedQues +
              "<div class='answers' style='background-color: transparent;'>Answers:" + answer +
              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal' data-question='" + JSON.stringify(value) +
              "'>viewMore</button></div></li>"

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


  //selecting questions on checking of checkbox

  //selected questions

  let questions = []


  $(document).on('change', '.chooseQuestionsInput', function (e) {
    //add questions to a array which are selected

    (e.target.checked) ? questions.push($(this).data('value')) : (questions.splice(questions.indexOf($(this).data('value')), 1))

    //(e.target.checked) ? console.log('hello') : console.log("bye")
    //questions.push($(this).data('value'))
    console.log(questions)

  });


  $('.addChosenQuestions').on('click', function () {
    displaySelectedQuestions()
  })

  function displaySelectedQuestions() {

    if (questions.length === 0) {
      $('.addingQues').empty()
      $('.addingQues').append("Add Questions to this Assignment")
    }
    else {
      $('.addingQues').empty()
      for (let i = 0; i < questions.length; i++) {
        //$('.addingQues').append(`<div class="chosenQuestions my-2 p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;'><p data-question='` + questions[i] + `'>` + questions[i].name + `</p></div>`)
        $('.addingQues').append(`
        <div class="chosenQuestions my-2 p-2" style='background:#e6e6e6;border-radius: 10px;cursor:pointer;' data-toggle="modal" data-target=".chosenQuestionModal" data-question=${questions[i]}>
          ${questions[i].name.substr(0, 110)}
        </div>
        
        <div class="modal fade chosenQuestionModal" tabindex="-1" role="dialog" aria-labelledby="chosenModalLabel" aria-hidden="true">
          <div class="modal-dialog" role="document">
            <div class="modal-content">
              
              <div class="modal-body">
                <div class='pb-4'>${questions[i].name}</div>
                <div style="${questions[i].questions_options[0].is_answer == 1 ? 'background-color:#B4F7D6' : 'background-color:#FFFFFF'} ">${JSON.stringify(questions[i].questions_options[0].name)}</div>
                <div style="${questions[i].questions_options[1].is_answer == 1 ? 'background-color:#B4F7D6' : 'background-color:#FFFFFF'} ">${JSON.stringify(questions[i].questions_options[1].name)}</div>
                <div style="${questions[i].questions_options[2].is_answer == 1 ? 'background-color:#B4F7D6' : 'background-color:#FFFFFF'} ">${JSON.stringify(questions[i].questions_options[2].name)}</div>
                <div style="${questions[i].questions_options[3].is_answer == 1 ? 'background-color:#B4F7D6' : 'background-color:#FFFFFF'} ">${JSON.stringify(questions[i].questions_options[3].name)}</div>
              </div>
              
            </div>
          </div>
        </div>`)
      }
    }
  }



  $(document).on('click', '.chosenQuestions', function () {

  })










})



