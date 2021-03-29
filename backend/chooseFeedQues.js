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

  //for modals
  $('#myModal').on('shown.bs.modal', function () {
    $('#myInput').trigger('focus')
  })



  let searchParams = new URLSearchParams(window.location.search);

  //basic paarmeters


  //variables used
  let j = 1;
  let preAddedQuestions = [];
  let preAddedQuestionsId = [];
  let questions_values = []
  let selectedQuestions = []
  let selectedQuestionsId = []






  //assigning values
  let feedback_name = searchParams.get('fname');
  let feedback_id = searchParams.get('id');
  let question_count = searchParams.get('qc');
  let category = searchParams.get('category');
  let template = searchParams.get('template');


  console.log(feedback_name)

  //selecting the category
  $('#feedbackCategory option[value=' + category + ']').prop('selected', true)




  //on selecting templates and categories
  $('#feedbackCategory').on('change', function () {
    category = this.value;
    console.log(category)
    getTemplates(category)
  })

  $('#feedbackTemplate').on('change', function () {
    template = this.value;
    console.log(template)
    j = 1;
    getTemplateQuestions(template)
  })




  getTemplates(category)
  preAddedFeedbackQuestions()
  getTemplateQuestions(template)






  function getTemplates(category) {

    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/survey/getFeedbackTemplates?survey_category_id=' + category,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result.message);

        if (result.status == 200 && result.data) {

          //template = null
          $.each(result.data, function (key, value) {
            //console.log(value)
            $('#feedbackTemplate').append('<option value=' + value.id + '>' + value.name + '</option>');
          });
        }

        $('#feedbackTemplate option[value=' + template + ']').prop('selected', true)



      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });

  }




  function preAddedFeedbackQuestions() {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyQuestions?survey_id=' + feedback_id,
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

            preAddedQuestionsId.push(value.id);
            selectedQuestionsId.push(value.id);
            preAddedQuestions.push(value);
            selectedQuestions.push(value)


            $('.chooseQuestionsInput').each(function () {
              if (preAddedQuestionsId.includes($(this).data('id'))) {
                $(this).prop('checked', true)
              }
            })

          });

          for (let i = 0; i < preAddedQuestions.length; i++) {

            $('.addingQues').append("<div class='row'>" +
              "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q" + (i + 1) + ").</div>" +

              "<div class='col-10 chosenQuestions py-2 pr-4' data-toggle='modal' data-target='.chosenQuestionModal" + preAddedQuestions[i].id + "' data-question='" + preAddedQuestions[i] + "'>" +
              preAddedQuestions[i].name + "</div>" +

              "<div class='modal fade chosenQuestionModal" + preAddedQuestions[i].id + "' tabindex='-1' role='dialog' aria-labelledby='chosenModalLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-4'>" + preAddedQuestions[i].name + "</div>" +
              (preAddedQuestions[i].questions_options[0] ? "<div class='py-1'>" + "1.) " + JSON.parse(JSON.stringify(preAddedQuestions[i].questions_options[0].name)) + "</div>" : "") +
              (preAddedQuestions[i].questions_options[1] ? "<div class='py-1'>" + "2.) " + JSON.parse(JSON.stringify(preAddedQuestions[i].questions_options[1].name)) + "</div>" : "") +
              (preAddedQuestions[i].questions_options[2] ? "<div class='py-1'>" + "3.) " + JSON.parse(JSON.stringify(preAddedQuestions[i].questions_options[2].name)) + "</div>" : "") +
              "</div>" +
              "<div class='pb-3' style='text-align:center;'><button class='btn btn-primary'><a style='color:white; text-decoration:none' href='addFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "'>Edit</a></button></div>" +
              "</div>" +
              "</div>" +
              "</div>" +
              "</div>")

          }

        }
        // MathJax.typesetPromise();
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }




  function getTemplateQuestions(template) {
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/survey/getFeedbackTemplateQuestions?template_id=' + template,
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
            console.log(value)

            if (!questions_values.find(x => x.id === value.id)) {
              questions_values.push(value)
            }

            $('.chooseQues').append("<li class='chooseQuestionsLi pl-3 pr-2 py-2'><div class='row no-gutters'><div class='col-11 pb-2'>Q " + j + ".) " + value.name +
              "</div><div class='col-1'><input type='checkbox' class='chooseQuestionsInput px-3 mr-4' value='" + value.id +
              "'data-id='" + value.id + "' " +
              " name='chooseQuestionsAdd' id='chooseQuestionsAdd" + value.id + "'/ ></div>" +

              " <button class='viewMoreBtn' style='background-color: transparent;' data-toggle='modal' data-target='.viewMoreModal" + value.id + "' " +
              ">View More</button></div></li>" +


              "<div class='modal fade viewMoreModal" + value.id + "' tabindex='-1' role='dialog' aria-labelledby='viewMoreLabel' aria-hidden='true'>" +
              "<div class='modal-dialog' role='document'>" +
              "<div class='modal-content'>" +

              "<div class='modal-body'>" +
              "<div class='pb-1'>" + value.name + "</div>" +
              (value.questions_options[0] ? "<div class='py-1' style='" + (value.questions_options[0].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "1.) " + JSON.parse(JSON.stringify(value.questions_options[0].name)) + "</div>" : "") +
              (value.questions_options[1] ? "<div class='py-1' style='" + (value.questions_options[1].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "2.) " + JSON.parse(JSON.stringify(value.questions_options[1].name)) + "</div>" : "") +
              (value.questions_options[2] ? "<div class='py-1' style='" + (value.questions_options[2].is_answer == 1 ? "background-color:#B4F7D6" : "background-color:#FFFFFF") + "'>" + "3.) " + JSON.parse(JSON.stringify(value.questions_options[2].name)) + "</div>" : "") +

              "</div>" +
              "</div>" +
              "</div>" +
              "</div>"
            );

            j++;
            //MathJax.typesetPromise();

          });


          $('.chooseQuestionsInput').each(function () {
            if (selectedQuestionsId.includes($(this).data('id')) || preAddedQuestionsId.includes($(this).data('id'))) {
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


  //on selecting the questions
  $(document).on('change', '.chooseQuestionsInput', function (e) {
    console.log("hello")
    //add Questions to a array which are selected
    let currQues = {}

    currId = $(this).data('id')


    questions_values.forEach(function (ques) {
      //console.log(ques.id)
      if (ques.id == currId) {
        currQues = ques
        //console.log(ques)
      }
    });
    console.log(currQues);
    (e.target.checked) ? selectedQuestions.push(currQues) : (selectedQuestions.splice(selectedQuestions.findIndex(function (x) { return x.id == currId }), 1));
    (e.target.checked) ? selectedQuestionsId.push($(this).data('id')) : (selectedQuestionsId.splice(selectedQuestionsId.indexOf($(this).data('id')), 1))
    console.log(selectedQuestionsId)
    console.log(selectedQuestions)
  });



  //save button

  $('#btnSave').on('click', function () {
    if (selectedQuestions.length == 0) {
      new Notify({
        title: 'Error',
        text: "Choose Questions First",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }
    else {
      saveQuestions(0)
    }

  })

  $('#btnSaveSend').on('click', function () {
    if (selectedQuestions.length == 0) {
      new Notify({
        title: 'Error',
        text: "Choose Questions First",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }
    else {
      saveQuestions(1)
    }

  })



  function saveQuestions(redirect) {
    var form = new FormData();
    form.append("survey_id", feedback_id);
    form.append("questions", "[" + selectedQuestionsId.join(',') + "]");
    // for (var key of form.entries()) {
    //   alert(key[1]);
    // }


    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/survey/addSurveyTemplateQuestions',
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
            text: "Questions Added Successfully",
            autoclose: true,
            status: 'success',
            autotimeout: 3000
          });


          if (redirect == 0) {
            //redirect to home screen
            setTimeout(() => {
              window.location.href = "myFeedbacks.html"
            }, 2000)
          }
          else {
            //redirect to send page
            setTimeout(() => {
              window.location.href = `sendFeedback.html?id=${feedback_id}`
            }, 2000)

          }

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



