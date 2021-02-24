$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  let searchParams = new URLSearchParams(window.location.search);

  //basic paarmeters
  let feedback_id = 0
  let feedback_name = ""
  let question_count = 0

  //variables used
  let selectedQuestions = [];
  let selectedQuestionsId = [];





  if (searchParams.has('id')) {
    feedback_name = searchParams.get('fname');
    feedback_id = searchParams.get('id');
    question_count = searchParams.get('qc');
    feedbackQuestions()
  } else {
    alert("wrong !")
  }


  function feedbackQuestions() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyQuestions?survey_id=673',
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result.message);

        if (result.status == 200 && result.data) {
          $('.addingQues').empty()

          $.each(result.data, function (key, value) {
            console.log(value)

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

          });

          // for (let i = 0; i < selectedQuestions.length; i++) {



          //   //console.log(selectedQuestions[i].questions_options[0].name)
          //   $('.addingQues').append("<div class='row m-0'>" +
          //     "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q).</div>" +

          //     "<div class='col-10 chosenQuestions py-2 pr-4' data-toggle='modal' data-target='.chosenQuestionModal" + selectedQuestions[i].id + "' data-question='" + selectedQuestions[i] + "'>" +
          //     selectedQuestions[i].name + "</div>" +

          //     "<div class='modal fade chosenQuestionModal" + selectedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
          //     "<div class='modal-dialog' role='document'>" +
          //     "<div class='modal-content'>" +

          //     "<div class='modal-body'>" +
          //     "<div class='pb-4'>" + selectedQuestions[i].name + "</div>" +
          //     (selectedQuestions[i].question_img == "" ? "" : "<div class='text-center py-2'><img src='" + selectedQuestions[i].question_img + "' alt='img' style='width:100px; height:75px;'></img></div>") +
          //     (selectedQuestions[i].questions_options[0] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[0].name)) + "</div>" : "") +
          //     (selectedQuestions[i].questions_options[0] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          //     (selectedQuestions[i].questions_options[1] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[1].name)) + "</div>" : "") +
          //     (selectedQuestions[i].questions_options[1] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          //     (selectedQuestions[i].questions_options[2] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[2].name)) + "</div>" : "") +
          //     (selectedQuestions[i].questions_options[2] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          //     (selectedQuestions[i].questions_options[3] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[3].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "4.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[3].name)) + "</div>" : "") +
          //     (selectedQuestions[i].questions_options[3] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +
          //     (selectedQuestions[i].questions_options[4] ? "<div class='py-1' style='" + (selectedQuestions[i].questions_options[4].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "5.) " + JSON.parse(JSON.stringify(selectedQuestions[i].questions_options[4].name)) + "</div>" : "") +
          //     (selectedQuestions[i].questions_options[4] ? (selectedQuestions[i].questions_options[0].option_img == "" ? "" : "<img src='" + selectedQuestions[i].questions_options[0].option_img + "' style='width:100px; height:75px;' alt='img'></img>") : "") +

          //     (selectedQuestions[i].hint ? "<div style='font-size:12px;'>Hint :" + selectedQuestions[i].hint + "</div>" : "") +
          //     (selectedQuestions[i].hint_image ? "<div class='text-center py-2'><img src='" + selectedQuestions[i].hint_image + "' alt='img' style='width:100px; height:75px;'></img></div>" : "") +
          //     (selectedQuestions[i].solution == "" ? "" : "<br> Solution : <div style='font-size:12px;'>" + selectedQuestions[i].solution + "</div>") +
          //     (selectedQuestions[i].solution_image == "" ? "" : "<div class='text-center py-2'><img src='" + selectedQuestions[i].solution_image + "' alt='img' style='width:100px; height:75px;'></img></div>") +
          //     "</div>" +

          //     "</div>" +
          //     "</div>" +
          //     "</div>" +
          //     "</div>")

          // }


          //console.log(selectedQuestions)

        }
        // MathJax.typesetPromise();
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }






})



