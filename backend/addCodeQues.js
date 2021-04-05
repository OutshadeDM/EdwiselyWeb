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

  let questions = [];
  let questions_id = {}
  let topics = []
  let subject_id = "0";
  let test_name = "test";
  // let

  const searchParams = new URLSearchParams(window.location.search);
  let cid = "0";
  if (searchParams.has('id')) {
    cid = searchParams.get('id');
  }

  // $('#fifthOption').hide();
  $('#editBtn').hide();
  $('#deleteBtn').hide();
  $('#status3').prop('checked', false);
  $('#status4').prop('checked', false);
  $('#status5').prop('checked', false);
  getQuestions(true);

  function getQuestions(functionCall) {
    $("#addquesDiv").empty();
    $('#addquesDiv').append("<div class='loader-wrapper'><div class='loader'></div></div>");
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/codeEditor/getCodingTestDetails?test_id=' + cid,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result)
        if (result.status == 200) {
          questions = []
          questions_id = []
          subject_id = result.data.subject_id
          test_name = result.data.name
          $('#courseName').text(test_name);
          if (functionCall) {
            getUnits();
          }
          $.each(result.data.problems, function (key, value) {
            questions.push(value);
            questions_id.push({ id: value.id, marks: value.marks })
          });
          loadList();
        }
        else {
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
        alert("Request Failed with status: " + error.status);
      }
    });
  }

  function loadList() {
    $("#addquesDiv").empty();
    let i = 1;

    $.each(questions, function (key, value) {
      $('#addquesDiv').append("<div class='row'>" +
        "<div class='col-2 pl-2 pt-4 chosenQuestions'>" + i++ + ").</div>" +
        "<div class='col-10 chosenQuestions py-2 pr-2 questions' id='p" + value.id + "' data-id='" + value.id + "' style='cursor:pointer;'>" + value.name.replace('<pre>', '') + "</div>");
    });
  }

  function getUnits() {
    // console.log('here');
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/questionnaire/getUnits?subject_id=' + subject_id + '&university_degree_department_id=' + `${$user.university_degree_department_id}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        // console.log(result);
        if (result.status == 200) {
          $('#selectUnit').empty();
          $('#selectUnit').append("<option value='0' selected disabled>Unit</option>");
          $.each(result.data, function (key, value) {
            $('#selectUnit').append("<option value='" + value.id + "'>" + value.name + "</option>");
          });
        }
        else {
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
        alert("Request Failed with status: " + error.status);
      }
    });

  }

  $('#selectUnit').on('change', function () {
    const unit = $(this).find(':selected').val()
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
                $('#topicTags').append("<li class='topicTagsLi'><input type='checkbox' class='topicTagsInput' value='" + unitTopic.topic_id + "' data-type='" + unitTopic.type + "'data-id='" + unitTopic.topic_id + "' data-code='" + unitTopic.topic_code + "' name='topicTagAdd' id='topicTagAdd" + unitTopic.topic_id + "'/><label for='topicTagAdd" + unitTopic.topic_id + "' class='topicTagsLabel show1'><i class='fas fa-check' style='display: none;'></i>" + unitTopic.topic_name + "</label></li>");
              })
            });
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

  $(document).on('click', '.topicTagsInput', function () {

    let value = $(this).data('type');
    let id = parseInt($(this).val());

    if (!topics.includes(value)) {
      topics.push({ "id": id, "type": value });
    }

    if ($(this).prop('checked') == false) {
      topics = topics.filter(function (e) {
        return e.id != id;
      });
    }

  });

  function clearAll() {
    $('#title').val("");
    $('#selectUnit').val(0);
    $('#selectUnit').prop("disabled",false);
    $('#selectTopic').val(0);
    topics = []
    $('#topicTags').empty();
    $('#topicTags').append("Select Unit First");
    $('#selectLang').val(0);
    $('#input1').val("");
    $('#output1').val("");
    $('#input2').val("");
    $('#output2').val("");
    $('#input3').val("");
    $('#output3').val("");
    $('#input4').val("");
    $('#output4').val("");
    $('#input5').val("");
    $('#output5').val("");
    $("#summernote").summernote("code","")
    $('#marks').val("");
    $('#questionId').val("");

    $('#status1').prop('checked', true);
    $('#status2').prop('checked', true);
    $('#status3').prop('checked', false);
    $('#status4').prop('checked', false);
    $('#status5').prop('checked', false);

    $('#editBtn').hide();
    $('#deleteBtn').hide();
    $('#doneBtn').show();
  }

  $(document).on('click', '.questions', function () {

    if ($(this).data('id') != $('#questionId').val()) {
      clearAll();
      let questionId = $(this).data('id');

      $('#editBtn').show();
      $('#doneBtn').hide();
      $('#deleteBtn').show();
      $('#questionId').val(questionId);

      const question = questions.filter(question1 => questionId == question1.id)[0];
      console.log(question);

      $('#selectUnit').val("0");
      $('#selectUnit').prop("disabled",true);
      $('#topicTags').empty();
      $('#topicTags').html("Select Unit First");

      topics.push({id:question.topic_id,type: question.topic_type});
      // $('#topicTagAdd' + question.topic_id).prop('checked', true);

      // $.each(value.topics_details, function (key, value) {
      //   if (question_type1) {
      //     $('#topicTagAdd' + value.id).prop('checked', true);
      //   }
      //   else {
      //     // $('#topicsDiv').append("<span class='badge badge-pill'>" + value.id + "</span><br>");
      //     $('#addNewBtn').show();
      //   }
      // });
      // topics = value.topics_details;

      $('#title').val(question.name);
      $('#marks').val(question.marks);
      $("#summernote").summernote("code",question.body)

      $("#selectLang").val(question.language_id)

      $('#input1').val(question.test_cases[0].input);
      $('#output1').val(question.test_cases[0].output);
      if (question.test_cases[0].active) $('#status1').prop('checked', true);
      else $('#status1').prop('checked', false);

      $('#input2').val(question.test_cases[1].input);
      $('#output2').val(question.test_cases[1].output);
      if (question.test_cases[0].active) $('#status2').prop('checked', true);
      else $('#status2').prop('checked', false);

      if (question.test_cases[2]) {
        $('#input3').val(question.test_cases[2].input);
        $('#output3').val(question.test_cases[2].output);
        if (question.test_cases[0].active) $('#status3').prop('checked', true);
        else $('#status3').prop('checked', false);
      }

      if (question.test_cases[3]) {
        $('#input4').val(question.test_cases[3].input);
        $('#output4').val(question.test_cases[3].output);
        if (question.test_cases[0].active) $('#status4').prop('checked', true);
        else $('#status4').prop('checked', false);
      }

      if (question.test_cases[4]) {
        $('#input5').val(question.test_cases[4].input);
        $('#output5').val(question.test_cases[4].output);
        if (question.test_cases[0].active) $('#status5').prop('checked', true);
        else $('#status5').prop('checked', false);
      }

      if(question.college_account_id != $user.user_id){
        $('#editBtn').hide();
        $('#doneBtn').hide();
        $('#deleteBtn').hide();

        $('#input1').prop('disabled', true);
        $('#input2').prop('disabled', true);
        $('#input3').prop('disabled', true);
        $('#input4').prop('disabled', true);
        $('#input5').prop('disabled', true);
        
        $('#output1').prop('disabled', true);
        $('#output2').prop('disabled', true);
        $('#output3').prop('disabled', true);
        $('#output4').prop('disabled', true);
        $('#output5').prop('disabled', true);

        $('#status1').prop('disabled', true);
        $('#status2').prop('disabled', true);
        $('#status3').prop('disabled', true);
        $('#status4').prop('disabled', true);
        $('#status5').prop('disabled', true);

        $('#title').prop('disabled', true);
        $('#marks').prop('disabled', true);
        $('#summernote').summernote('disable');
      }
      else{
        $('#input1').prop('disabled', false);
        $('#input2').prop('disabled', false);
        $('#input3').prop('disabled', false);
        $('#input4').prop('disabled', false);
        $('#input5').prop('disabled', false);
        
        $('#output1').prop('disabled', false);
        $('#output2').prop('disabled', false);
        $('#output3').prop('disabled', false);
        $('#output4').prop('disabled', false);
        $('#output5').prop('disabled', false);

        $('#status1').prop('disabled', false);
        $('#status2').prop('disabled', false);
        $('#status3').prop('disabled', false);
        $('#status4').prop('disabled', false);
        $('#status5').prop('disabled', false);

        $('#title').prop('disabled', false);
        $('#marks').prop('disabled', false);
        $('#summernote').summernote('enable');
      }

    }
  });

  $('#doneBtn').on('click', function () {
    const title = $('#title').val();
    const marks = $('#marks').val();
    const desc = $("#summernote").summernote("code").replace(/<\/?[^>]+(>|$)/g, "");
    const unit = $("#selectUnit").find(":selected").val();
    const language = $("#selectLang").find(":selected").val();
    const input1 = $("#input1").val();
    const input2 = $("#input2").val();
    const output1 = $("#output1").val();
    const output2 = $("#output2").val();

    if (title && desc && marks && unit && unit != "0" && topics.length > 0 && language && language != "0" && input1 && input2 && output1 && output2) {
      
      $('#doneBtn').html("<i class='fa fa-spinner fa-spin'></i> Please Wait");
      const test_cases = [];
      test_cases.push(objectCreator(input1, output1))
      test_cases.push(objectCreator(input2, output2))

      if ($("#input3").val() && $("#output3").val()) test_cases.push(objectCreator($("#input3").val(), $("#output3").val()))
      if ($("#input4").val() && $("#output4").val()) test_cases.push(objectCreator($("#input4").val(), $("#output4").val()))
      if ($("#input5").val() && $("#output5").val()) test_cases.push(objectCreator($("#input5").val(), $("#output5").val()))

      // console.log(topics)
      const form = new FormData();
      form.append("name", title);
      form.append("body", desc);
      form.append("topics", JSON.stringify(topics));
      form.append("test_id", cid);
      form.append("marks", marks);
      form.append("language_id", language);
      form.append("test_cases", JSON.stringify(test_cases))

      // for (var key of form.entries()) {
      //   console.log(key[1]);
      // }

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/addCodingProblem',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          $('#doneBtn').html('Done');
          console.log(result);
          if (result.status == 200) {
            new Notify ({
                title: 'Success',
                text : result.message,
                autoclose: true,
                status: 'success',
                autotimeout: 3000
            });
            clearAll();
            getQuestions(false);
          }
          else {
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
          $('#doneBtn').html('Done');
          alert("Request Failed with status: " + error.status);
        }
      });

    }
    else {
      if (!title)
        new Notify ({
            title: 'Error',
            text : "Please enter valid title",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!input1 || !output1 || !input2 || !output2)
        new Notify ({
            title: 'Error',
            text : "Min 2 test cases are mandatory",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!unit || unit == '0')
        new Notify ({
            title: 'Error',
            text : "Plese Select Unit",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (topics.length <= 0)
        new Notify ({
            title: 'Error',
            text : "Plese Select Topics",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!marks)
        new Notify ({
            title: 'Error',
            text : "Plese Enter Marks",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else
        new Notify ({
            title: 'Error',
            text : "Plese enter valid details",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
    }
  });

  function objectCreator(input1, output1) {
    return {
      input: input1,
      output: output1
    }
  }

  $('#deleteBtn').on('click', function () {
    // console.log(questions_id);
    const questionId = $('#questionId').val();
    if (questionId) {
      const updated_questions = questions_id.filter(question => question.id != questionId);

      $('#deleteBtn').html("<i class='fa fa-spinner fa-spin'></i> Please Wait");
      const form = new FormData();
      form.append("test_id", cid);
      form.append("problems", JSON.stringify(updated_questions));

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/editCodingTestProblems',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          //   console.log(result);
        $('#deleteBtn').html("Delete");
          if (result.status == 200) {
            new Notify ({
                title: 'Success',
                text : result.message,
                autoclose: true,
                status: 'success',
                autotimeout: 3000
            });
            clearAll();
            getQuestions(false);
          }
          else {
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
          $('#deleteBtn').html("Delete");
          alert("Request Failed with status: " + error.status);
        }
      });
    }
  })

  $('#editBtn').on('click', function () {
    const title = $('#title').val();
    const marks = $('#marks').val();
    const desc = $("#summernote").summernote("code").replace(/<\/?[^>]+(>|$)/g, "");
    const language = $("#selectLang").find(":selected").val()
    const problem_id = $("#questionId").val();

    if (title && marks && desc && topics.length > 0 && problem_id && language) {
      $('#editBtn').html("<i class='fa fa-spinner fa-spin'></i> Please Wait");
      const updated_question = questions.filter(question => question.id == problem_id)[0];
      // console.log(updated_question);

      const form = new FormData();
      form.append("name", title);
      form.append("body", desc);
      form.append("topics", JSON.stringify(topics));
      form.append("test_id", cid);
      form.append("marks", marks);
      form.append("language_id", language);
      form.append("problem_id", problem_id);

      $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/codeEditor/editCodingProblem',
        type: 'POST',
        dataType: 'json',
        data: form,
        contentType: false,
        processData: false,
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          $('#editBtn').html("Edit");
          // console.log(result);
          if (result.status == 200) {
            new Notify ({
                title: 'Success',
                text : result.message,
                autoclose: true,
                status: 'success',
                autotimeout: 3000
            });
            
            if(updated_question.test_cases[0].input != $("#input1").val() || updated_question.test_cases[0].output != $("#output1").val())
              updateTestCases(updated_question.id,updated_question.test_cases[0].id,$("#input1").val(),$("#output1").val(),$('#status1').prop('checked'))
            
            if(updated_question.test_cases[1].input != $("#input2").val() || updated_question.test_cases[1].output != $("#output2").val())
              updateTestCases(updated_question.id,updated_question.test_cases[1].id,$("#input2").val(),$("#output2").val(),$('#status2').prop('checked'))
            
            if(updated_question.test_cases[2] && (updated_question.test_cases[2].input != $("#input3").val() || updated_question.test_cases[2].output != $("#output3").val()))
              updateTestCases(updated_question.id,updated_question.test_cases[2].id,$("#input3").val(),$("#output3").val(),$('#status3').prop('checked'))

            if(updated_question.test_cases[3] && (updated_question.test_cases[3].input != $("#input4").val() || updated_question.test_cases[3].output != $("#output4").val()))
              updateTestCases(updated_question.id,updated_question.test_cases[3].id,$("#input4").val(),$("#output4").val(),$('#status4').prop('checked'))
            
            if(updated_question.test_cases[4] && (updated_question.test_cases[4].input != $("#input5").val() || updated_question.test_cases[4].output != $("#output5").val()))
              updateTestCases(updated_question.id,updated_question.test_cases[4].id,$("#input5").val(),$("#output5").val(),$('#status5').prop('checked'))
            
            if(!updated_question.test_cases[2] && $("#input3").val() && $("#output3").val())
              addTestCase(updated_question.id,$("#input3").val(),$("#output3").val(),$('#status3').prop('checked'))

            if(!updated_question.test_cases[3] && $("#input4").val() && $("#output4").val())
              addTestCase(updated_question.id,$("#input4").val(),$("#output4").val(),$('#status4').prop('checked'))

            if(!updated_question.test_cases[4] && $("#input5").val() && $("#output5").val())
              addTestCase(updated_question.id,$("#input5").val(),$("#output5").val(),$('#status5').prop('checked'))

            clearAll();
            getQuestions(false);
          }
          else {
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
          $('#editBtn').html("Edit");
          alert("Request Failed with status: " + error.status);
        }
      });
    }
    else {
      if (!title || !marks || !desc)
        new Notify ({
            title: 'Error',
            text : "Please enter valid title, marks and description",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      // else if (!input1 || !output1 || !input2 || output2)
      //   new Notify ({
      //       title: 'Error',
      //       text : "Min 2 test cases are mandatory",
      //       autoclose: true,
      //       status: 'error',
      //       autotimeout: 3000
      //   });
      else if (!unit || unit == '0')
        new Notify ({
            title: 'Error',
            text : "Plese Select Unit",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (topics.length <= 0)
        new Notify ({
            title: 'Error',
            text : "Plese Select Topics",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else if (!language)
        new Notify ({
            title: 'Error',
            text : "Plese Select Language",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
      else
        new Notify ({
            title: 'Error',
            text : "Plese enter valid details",
            autoclose: true,
            status: 'error',
            autotimeout: 3000
        });
    }
  });

  function updateTestCases(problem_id,test_case_id,input,output,active){
    const form = new FormData();
    form.append("test_id",cid);
    form.append("problem_id",problem_id);
    form.append("test_case_id",test_case_id);
    form.append("input",input);
    form.append("output",output);
    form.append("active",active ? 1:0);
    // for (var key of form.entries()) {
    //     console.log(key[1]);
    //   }
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/codeEditor/editCodingProblemTestcase',
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
        if (result.status != 200) {
          new Notify ({
              title: 'Error',
              text : "Test Case Updation Failed",
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

  function addTestCase(problem_id,input,output,active){
    const form = new FormData();
    form.append("test_id",cid);
    form.append("problem_id",problem_id);
    form.append("input",input);
    form.append("output",output);
    form.append("active",active ? 1:0);
    // for (var key of form.entries()) {
    //     console.log(key[1]);
    //   }
    $.ajax({
      url: 'https://stagingfacultypython.edwisely.com/codeEditor/addCodingProblemTestcase',
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
        if (result.status != 200) {
          new Notify ({
              title: 'Error',
              text : "Test Case Addition Failed",
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

  $('#addNewBtn').on('click', function () {
    clearAll();
    $('#selectUnit').prop("disabled",false);
  });
  
  $('#btnSave').on('click', function () {
    window.location.replace("codingQuestions.html?id=" + cid + "&fname=" + test_name);
  });

  $('#btnSaveSend').on('click', function () {
    window.location.href = `sendCodingAssessment.html?test_id=${cid}&test_name=${test_name}`
  });

});