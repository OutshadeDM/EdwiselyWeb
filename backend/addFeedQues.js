$(document).ready(function () {

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  const searchParams = new URLSearchParams(window.location.search);
  let sId = "";
  let sName = "";
  if (searchParams.has('id') && searchParams.has('fname')) {
    sId = searchParams.get('id');
    sName = searchParams.get('fname');
    $('#courseName').text(sName);
  }
  else {
    window.location.replace("myFeedbacks.html");
  }

  let questions = [];
  const questionsList = [];
  let catagory = "";

  let option1 = '';
  let option2 = '';
  let option3 = '';
  let option4 = '';
  let option5 = '';

  $('#fifth').hide();
  $('#editBtn').hide();
  $('#deleteBtn').hide();

  $('#fifthOptionBtn').on('click', function () {
    $('#fifthOptionBtn').hide();
    $('#fifth').show();
  })

  //textboxes and dropdowns
  $('#quesInput').on('change', function () {
    question = $('#quesInput').val()
  })
  $('#selectCatagory').on('change', function () {
    catagory = $('#selectCatagory').val()
  })
  $('#firstOption').on('change', function () {
    option1 = $('#firstOption').val()
  })
  $('#secondOption').on('change', function () {
    option2 = $('#secondOption').val()
  })
  $('#thirdOption').on('change', function () {
    option3 = $('#thirdOption').val()
  })
  $('#fourthOption').on('change', function () {
    option4 = $('#fourthOption').val()
  })
  $('#fifthOption').on('change', function () {
    option5 = $('#fifthOption').val()
  })


  getQuestions();

  function getQuestions() {
    questions = [];
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyQuestions?survey_id=' + sId,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        if (result.status == 200 && result.data) {
          $('.initData').remove();
          $.each(result.data, function (key, value) {
            questionsList.push(value.id);
            questions.push(value);
          });
          loadList();
        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  function loadList() {
    $("#addquesDiv").empty();
    let i = 1;

    $.each(questions, function (key, value) {
      $('#addquesDiv').append("<div class='row'>" +
        "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q" + i++ + ").</div>" +
        "<div class='col-10 chosenQuestions py-2 pr-2 questions' id='p" + value.id + "' data-id='" + value.id + "' style='cursor:pointer;'>" + value.name.replace('<pre>', '') + "</div>");
    });
  }

  function clearAll() {
    question = '';
    catagory = "";
    field_type = 1;
    options = [];
    option1 = '';
    option2 = '';
    option3 = '';
    option4 = '';
    option5 = '';

    $('#quesInput').val("");
    $('#selectCatagory').val("1");
    $('#firstOption').val("");
    $('#secondOption').val("");
    $('#thirdOption').val("");
    $('#fourthOption').val("");
    $('#fifthOption').val("");
    $('#questionId').val("");
    $('#selectCatagory').val(0);

    $('#fifth').hide();
    $('#fifthOptionBtn').show();
    $('.uploadedques').click();

    $('#editBtn').hide();
    $('#deleteBtn').hide();
    $('#plusBtn').show();
  }

  $('#addNewBtn').on('click', function () {
    clearAll();
  });

  $('#plusBtn').on('click', function () {
    if (question && option1 && option2 && catagory != "0" && catagory) {

      const newOptions = [];
      newOptions.push("\"" + option1 + "\"", "\"" + option2 + "\"");
      if (option3) newOptions.push("\"" + option3 + "\"");
      if (option4) newOptions.push("\"" + option4 + "\"");
      if (option5) newOptions.push("\"" + option5 + "\"");

      const form = new FormData();
      form.append("survey_id", sId);
      form.append("question", question);
      form.append("options", "[" + newOptions + "]");
      form.append("survey_category_id", catagory);
      form.append("field_type", "1");

      // for (var pair of form.entries()) {
      //   console.log(pair[0]+ ', ' + pair[1]); 
      // }
      $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "#fff",
        opacity: 0.7
      }).appendTo($("#abcd").css('position', 'relative'));

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/survey/addSurveyQuestion',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // console.log(result);
          if (result.status == 200) {
            new Notify ({
                title: 'Success',
                text : result.message,
                autoclose: true,
                status: 'success',
                autotimeout: 3000
            });
            $('#loadingDiv').remove();
            clearAll();
            getQuestions();
          }
          else {
            new Notify ({
                title: 'Error',
                text : result.message,
                autoclose: true,
                status: 'error',
                autotimeout: 3000
            });
            $('#loadingDiv').remove();
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      if (!option1 || !option2)
        new Notify ({
            title: 'Error',
            text : "2 Options are Mandatory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!catagory)
        new Notify ({
            title: 'Error',
            text : "Please Select Catagory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!question)
        new Notify ({
            title: 'Error',
            text : "Please enter Question",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!option1 || !option2 || !catagory || !question)
        new Notify ({
            title: 'Error',
            text : "Some fields are mandatory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
    }
  });

  $('#btnSave,#btnSaveSend').on('click', function () {
    const isSend = $(this).data('send') == "1" ? true : false;
    console.log(isSend)
    if (isSend && questionsList.length > 0) {
      window.location.href = "sendFeedback.html?id=" + sId;
    }
    else if (!isSend) {
      window.location.href = "myFeedbacks.html";
    }
    else{
      new Notify ({
          title: 'Error',
          text : "Please Add Questions",
          autoclose: true,
          status: 'error',
          autotimeout: 3000
      });
    }
  });

  function createOption(id, name, questionId) {
    const option = {
      name: name,
      questions_id: Number.parseInt(questionId)
    }
    if (id) option.id = id;
    return option;
  }

  $('#editBtn').click(function () {
    const questionId = $('#questionId').val();
    const isTemplate = questions.filter(question1 => questionId == question1.id)[0].has_template_id == 1 ? true : false;
    if (questionId && question && option1 && option2 && catagory != "0" && catagory) {

      if (isTemplate) {
        const oldOptions = questions.filter(question1 => questionId == question1.id)[0].questions_options;
        let newOptions = [];

        newOptions[0] = createOption(oldOptions[0].id, option1, questionId);
        newOptions[1] = createOption(oldOptions[1].id, option2, questionId);
        if (option3) newOptions[2] = createOption(oldOptions[2] ? newOptions[2].id : null, option3, questionId);
        if (option4) newOptions[3] = createOption(oldOptions[3] ? newOptions[3].id : null, option4, questionId);
        if (option5) newOptions[4] = createOption(oldOptions[4] ? newOptions[4].id : null, option5, questionId);
        newOptions = newOptions.filter(option => option.name !== "" || !option.name);

        const newQuestion = {
          id: Number.parseInt(questionId),
          name: question,
          field_type: 1,
          survey_category_id: catagory,
          questions_options: newOptions
        }

        // console.log("old",questions.filter(question1 => questionId == question1.id)[0]);
        // console.log("new",JSON.stringify(newQuestion));

        const form = new FormData();
        form.append("survey_id", sId);
        form.append("question", JSON.stringify(newQuestion));

        // for (var pair of form.entries()) {
        //   console.log(pair[0]+ ', ' + pair[1]); 
        // }

        $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "#fff",
          opacity: 0.7
        }).appendTo($("#abcd").css('position', 'relative'));

        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/survey/updateSurveyTemplateQuestion',
          type: 'POST',
          dataType: 'json',
          data: form,
          contentType: false,
          processData: false,
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            // console.log(result);
            if (result.status == 200) {
              new Notify ({
                  title: 'Success',
                  text : result.message,
                  autoclose: true,
                  status: 'success',
                  autotimeout: 3000
              });
              $('#loadingDiv').remove();
              getQuestions();
              clearAll();
            }
            else {
              $('#loadingDiv').remove();
              new Notify ({
                  title: 'Error',
                  text : result.message,
                  autoclose: true,
                  status: 'error',
                  autotimeout: 3000
              });
            }
          },
          error: function (error) {
            $('#loadingDiv').remove();
            alert("Request Failed with status: " + error.status);
          }
        });

      }
      else {
        const newOptions = [];
        newOptions.push("\"" + option1 + "\"", "\"" + option2 + "\"");
        if (option3) newOptions.push("\"" + option3 + "\"");
        if (option4) newOptions.push("\"" + option4 + "\"");
        if (option5) newOptions.push("\"" + option5 + "\"");

        const form = new FormData();
        form.append("question_id", questionId);
        form.append("question", question);
        form.append("options", "[" + newOptions + "]");
        form.append("survey_category_id", catagory);
        form.append("field_type", "1");

        // for (var pair of form.entries()) {
        //   console.log(pair[0]+ ', ' + pair[1]); 
        // }

        $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
          position: "absolute",
          width: "100%",
          height: "100%",
          background: "#fff",
          opacity: 0.7
        }).appendTo($("#abcd").css('position', 'relative'));

        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/survey/editSurveyQuestion',
          type: 'POST',
          dataType: 'json',
          data: form,
          contentType: false,
          processData: false,
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            // console.log(result);
            if (result.status == 200) {
              new Notify ({
                  title: 'Success',
                  text : result.message,
                  autoclose: true,
                  status: 'success',
                  autotimeout: 3000
              });
              $('#loadingDiv').remove();
              getQuestions();
              clearAll();
            }
            else {
              $('#loadingDiv').remove();
              new Notify ({
                  title: 'Error',
                  text : result.message,
                  autoclose: true,
                  status: 'error',
                  autotimeout: 3000
              });
            }
          },
          error: function (error) {
            $('#loadingDiv').remove();
            alert("Request Failed with status: " + error.status);
          }
        });
      }
    }
    else {
      if (!option1 || !option2)
        new Notify ({
            title: 'Error',
            text : "2 Options are Mandatory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!catagory)
        new Notify ({
            title: 'Error',
            text : "Please Select Catagory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!question)
        new Notify ({
            title: 'Error',
            text : "Please enter Question",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!option1 || !option2 || !catagory || !question)
        new Notify ({
            title: 'Error',
            text : "Some fields are mandatory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
    }
  });

  $('#deleteBtn').on('click', function () {
    const questionId = $('#questionId').val();
    if (questionId) {
      const form = new FormData();
      form.append("question_id", questionId);
      form.append("survey_id", sId);

      $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='frontend/images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
        position: "absolute",
        width: "100%",
        height: "100%",
        background: "#fff",
        opacity: 0.7
      }).appendTo($("#abcd").css('position', 'relative'));

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/survey/deleteSurveyQuestion',
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
            new Notify ({
                title: 'Success',
                text : result.message,
                autoclose: true,
                status: 'success',
                autotimeout: 3000
            });
            $('#loadingDiv').remove();
            getQuestions();
            clearAll();
          }
          else {
            $('#loadingDiv').remove();
            new Notify ({
                title: 'Error',
                text : result.message,
                autoclose: true,
                status: 'error',
                autotimeout: 3000
            });
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      new Notify ({
          title: 'Error',
          text : "Error, try again later",
          autoclose: true,
          status: 'error',
          autotimeout: 3000
      });
    }
  });

  $(document).on('click', '.questions', function () {

    if ($(this).data('id') != $('#questionId').val()) {
      clearAll();
      let questionId = $(this).data('id');

      $('#editBtn').show();
      $('#plusBtn').hide();
      $('#deleteBtn').show();
      $('#questionId').val(questionId);

      const value = questions.filter(question1 => questionId == question1.id)[0];
      console.log(value);

      $('#quesInput').val(value.name);
      question = value.name;

      $('#firstOption').val(value.questions_options[0].name);
      option1 = value.questions_options[0].name;
      $('#secondOption').val(value.questions_options[1].name);
      option2 = value.questions_options[1].name;

      if (value.questions_options[2]) {
        $('#thirdOption').val(value.questions_options[2].name);
        option3 = value.questions_options[2].name;
      }
      if (value.questions_options[3]) {
        $('#fourthOption').val(value.questions_options[3].name);
        option4 = value.questions_options[3].name;
      }
      if (value.questions_options[4]) {
        $("#fifthOptionBtn").click();
        $('#fifthOption').val(value.questions_options[4].name);
        option5 = value.questions_options[4].name;
      }
      if (value.survey_category_id) {
        $('#selectCatagory').val(value.survey_category_id);
        catagory = value.survey_category_id;
      }

    }
  });


});