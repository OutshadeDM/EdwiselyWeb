$(document).ready(function () {

    $user = "";
    if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
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

    $('#fifthOption').hide();
    $('#editBtn').hide();
    $('#deleteBtn').hide();
    getQuestions(true);

    function getQuestions(functionCall){
        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/codeEditor/getCodingTestDetails?test_id=' + cid,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                // console.log(result)
                if (result.status == 200) {
                    questions = []
                    questions_id = []
                    subject_id = result.data.subject_id
                    test_name = result.data.name
                    $('#courseName').text(test_name);
                    if(functionCall){
                        getUnits();
                    }
                    $.each(result.data.problems, function (key, value) {
                        questions.push(value);
                        questions_id.push({id:value.id,marks:value.marks})
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
                alert("Request Failed with status: "+error.status);
            }
        });
    }

    function loadList() {
        $("#addquesDiv").empty();
        let i = 1;
    
        $.each(questions, function (key, value) {
          $('#addquesDiv').append("<div class='row m-0'>" +
            "<div class='col-2 pl-2 pt-4 chosenQuestions'>Q"+ i++ +").</div>" +
            "<div class='col-10 chosenQuestions py-2 pr-2 questions' id='p" + value.id + "' data-id='" + value.id + "' style='cursor:pointer;'>" + value.name.replace('<pre>', '') + "</div>");
        });
      }

    function getUnits(){
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
                alert("Request Failed with status: "+error.status);
            }
        });

    }

    $('#selectUnit').on('change', function () {
        const unit = $(this).find(':selected').val()
        // console.log(unit)
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

    $('#addBtn').on('click', function () {
        $('#addBtn').hide();
        $('#fifthOption').show();
    });

    function clearAll() {
        $('#title').val("");
        $('#selectUnit').val(0);
        $('#selectTopic').val(0);
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
        $('#descInput').val("");
        $('#marks').val("");
        $('#questionId').val("");

        $('#status1').prop('checked',true);
        $('#status2').prop('checked',true);
        $('#status3').prop('checked',true);
        $('#status4').prop('checked',true);
        $('#status5').prop('checked',true);

        $('#fifthOption').hide();
        $('#addBtn').show();
        
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
            // console.log(question);
    
            $('#title').val(question.name);
            $('#marks').val(question.marks);
            $('#descInput').val(question.body);
    
            $('#input1').val(question.test_cases[0].input);
            $('#output1').val(question.test_cases[0].output);
            if(question.test_cases[0].active) $('#status1').prop('checked',true);
            else $('#status1').prop('checked',false);

            $('#input2').val(question.test_cases[1].input);
            $('#output2').val(question.test_cases[1].output);
            if(question.test_cases[0].active) $('#status2').prop('checked',true);
            else $('#status2').prop('checked',false);

            if (question.test_cases[2]) {
                $('#input3').val(question.test_cases[2].input);
                $('#output3').val(question.test_cases[2].output);
                if(question.test_cases[0].active) $('#status3').prop('checked',true);
                else $('#status3').prop('checked',false);
            }

            if (question.test_cases[3]) {
                $('#input4').val(question.test_cases[3].input);
                $('#output4').val(question.test_cases[3].output);
                if(question.test_cases[0].active) $('#status4').prop('checked',true);
                else $('#status4').prop('checked',false);
            }

            if (question.test_cases[4]) {
                $("#addBtn").hide();
                $("#fifthOption").show();
                $('#input5').val(question.test_cases[4].input);
                $('#output5').val(question.test_cases[4].output);
                if(question.test_cases[0].active) $('#status5').prop('checked',true);
                else $('#status5').prop('checked',false);
            }
            
          }
      });

    $('#addBtn').on('click', function() {
        clearAll();
    });

    $('#doneBtn').on('click', function () {
        const title = $('#title').val()
        const marks = $('#marks').val()
        const desc = $('#descInput').val()
        const unit = $("#selectUnit").find(":selected").val()
        const input1 = $("#input1").val()
        const input2 = $("#input2").val()
        const output1 = $("#output1").val()
        const output2 = $("#output2").val()
        
        // console.log(topics);
    
        if (title && desc && marks && unit && unit != "0" && topics.length > 0 && input1 && input2 && output1 && output2) {
    
            const test_cases = [];
            test_cases.push(objectCreator(input1,output1))
            test_cases.push(objectCreator(input2,output2))

            if($("#input3").val() && $("#output3").val()) test_cases.push(objectCreator($("#input3").val(),$("#output3").val()))
            if($("#input4").val() && $("#output4").val()) test_cases.push(objectCreator($("#input4").val(),$("#output4").val()))
            if($("#input5").val() && $("#output5").val()) test_cases.push(objectCreator($("#input5").val(),$("#output5").val()))

            console.log(topics)
            const form = new FormData();
            form.append("name", title);
            form.append("body", desc);
            form.append("topics", JSON.stringify(topics));
            form.append("test_id",cid);
            form.append("marks",marks);
            form.append("test_cases",JSON.stringify(test_cases))
            
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
                  if (result.status == 200) {
                    new Notify ({
                      title: 'Success',
                      text : result.message,
                      autoclose: true,
                      status: 'success',
                      autotimeout: 3000
                    });
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
                  alert("Request Failed with status: " + error.status);
                }
             });

        }
        else{
            if (!title)
                new Notify ({
                    title: 'Error',
                    text : "Please enter valid title, marks and description",
                    autoclose: true,
                    status: 'error',
                    autotimeout: 3000
                });
            else if (!input1 || !output1 || !input2 || output2)
                new Notify ({
                    title: 'Error',
                    text : "2 test cases are mandatory",
                    autoclose: true,
                    status: 'error',
                    autotimeout: 3000
                });
            else if (!unit || unit == '0' || !topic || topic == '0')
                new Notify ({
                    title: 'Error',
                    text : "Plese Select Unit and Topic",
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

    function objectCreator(input1,output1){
        return {
            input : input1,
            output : output1
        }
    }

    $('#deleteBtn').on('click', function(){
        // console.log(questions_id);
        questionId = $('#questionId').val();
        if(questionId){
            const updated_questions = questions_id.filter(question=> question.id !=questionId);

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
                  alert("Request Failed with status: " + error.status);
                }
            });
        }
    })

    $('#editBtn').on('click', function() {
        const title = $('#title').val()
        const marks = $('#marks').val()
        const desc = $('#descInput').val()
        const topic = $("#selectTopic").find(":selected").val()
        const problem_id = $("'#questionId").val();

        if(title && marks && desc && topic && topic !="0" && problem_id){
            const finalTopic = [{
                id : topic,
                type : $("#selectTopic").find(':selected').data('type')
            }];

            const form = new FormData();
            form.append("name", title);
            form.append("body", desc);
            form.append("topics", JSON.stringify(finalTopic));
            form.append("test_id",cid);
            form.append("marks",marks);
            form.append("problem_id",problem_id);

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
                  console.log(result);
                  if (result.status == 200) {
                    new Notify ({
                        title: 'Success',
                        text : result.message,
                        autoclose: true,
                        status: 'success',
                        autotimeout: 3000
                    });
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
                  alert("Request Failed with status: " + error.status);
                }
            });
        }
        else{
            if (!title)
                new Notify ({
                    title: 'Error',
                    text : "Please enter valid title, marks and description",
                    autoclose: true,
                    status: 'error',
                    autotimeout: 3000
                });
            else if (!input1 || !output1 || !input2 || output2)
                new Notify ({
                    title: 'Error',
                    text : "2 test cases are mandatory",
                    autoclose: true,
                    status: 'error',
                    autotimeout: 3000
                });
            else if (!unit || unit == '0' || !topic || topic == '0')
                new Notify ({
                    title: 'Error',
                    text : "Plese Select Unit and Topic",
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

    $('btnSave').on('click', function(){
        window.location.replace("codingQuestions.html?id="+cid+"&fname="+test_name);
    });

    $('btnSaveSend').on('click', function(){
        window.location.href = `sendCodingAssessment.html?test_id=${cid}&test_name=${test_name}`
    });

});