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
    let sId = "669";
    let sName = "Add Questions";
    if (searchParams.has('id') && searchParams.has('sname')) {
        sId = searchParams.get('sid');
        sName = searchParams.get('sname');
        $('#courseName').text(sName);
    }

    let questions = [];
    let catagory = "1";
    
    let option1 = ''
    let option2 = ''
    let option3 = ''
    let option4 = ''
    let option5 = ''

    $('#fifth').hide();
    $('#editBtn').hide();

  $('#fifthOptionBtn').on('click', function () {
    $('#fifthOptionBtn').hide();
    $('#fifth').show();
  })

  //textboxes and dropdowns
  $('#quesInput').on('change', function () {
    question = $('#quesInput').val()
  })
  $('.bloomSelect').on('change', function () {
    bloom_level = $('.bloomSelect').val()
  })
  $('.levelSelect').on('change', function () {
    difficulty_level = $('.levelSelect').val()
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

  function getQuestions(){
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
            //   questionsList.push(value.id);
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
    console.log(questions);
    $("#addquesDiv").empty();
    let i = 1;

    $.each(questions, function (key, value) {
      $('#addquesDiv').append("<div class='row m-0'>" +
        "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q"+ i++ +").</div>" +
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

    $('#fifth').hide();
    $('#fifthOptionBtn').show();
    $('.uploadedques').click();
    
    $('#editBtn').hide();
    $('#plusBtn').show();
  }

  $('#addNewBtn').click(function() {
    clearAll();
  });

  $('#plusBtn').click(function(){
    clearAll();
    const newOptions = [];
    newOptions.push(option1,option2);
    if(option3) newOptions.push(option3);
    if(option4) newOptions.push(option4);
    if(option5) newOptions.push(option5);

    if(question && option1 && option2 && catagory != "0" && catagory){

      const form = new FormData();
      form.append("survey_id", sId);
      form.append("question", question);
      form.append("options", newOptions);
      form.append("survey_category_id", "1");
      form.append("field_type", "1")

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
          if (result.status == 200) {
            $('#successToastBody').text(result.message);
            $('#successToast').toast('show');
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
            setTimeout(function () {
              if(!isSend)
                window.location.href = "myAssessment.html";
              else
                window.location.href = "sendQuestionsPage.html?id="+subSemId+"&tid="+tId+"&tname="+tname+"&uid="+unit_id+"&isObj=true&qc="+questions.length;
            }, 2000);
          }
          else {
            $('#loadingDiv').remove();
            $("input.custom-control-input").attr("disabled", false);
            $('#errorToastBody').text(result.message);
            $('#errorToast').toast('show');
          }
        },
        error: function (error) {
          $('#loadingDiv').remove();
          $("input.custom-control-input").attr("disabled", false);
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      if (!option1 || !option2)
        $('#errorToastBody').text("2 Options are Mandatory");
      else if (!bloom_level || !difficulty_level)
        $('#errorToastBody').text("Please Select Catagory");
      else if (!question)
        $('#errorToastBody').text("Please enter Question");
      else if (!option1 || !option2 || !catagory || !question)
        $('#errorToastBody').text("Some fields are mandatory");
      $('#errorToast').toast('show');
    }
  });

  $(document).on('click', '.questions', function () {

    if ($(this).data('id') != $('#questionId').val()) {
        clearAll();
        let questionId = $(this).data('id');

        $('#editBtn').show();
        $('#plusBtn').hide();
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
        if (value.category_name) {
            $('#selectCatagory').val(value.category_name);
            category_name = value.category_name;
        }
        
      }
    });

});