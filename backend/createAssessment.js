$(document).ready(function () {
  //alert("hello")

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }


  let searchParams = new URLSearchParams(window.location.search);
  let objective = false
  let i = 1
  // let units = [];
  if (searchParams.has('isObj')) {
    objective = searchParams.get('isObj')
  }


  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': `Bearer ${$user.token}`
    },
    success: function (result) {
      //alert(result.status);
      $('#courseTags').empty();
      if (result.status == 200 && result.data) {
        $.each(result.data, function (key, value) {
          // alert(value);
          $('#subject').append("<option value='" + value.id + "'>" + value.name + "</option>");
        });

      }
    },
    error: function (error) {
      alert("Request Failed with status: " + error.status);
    }
  });
  
  $('#btnAdd').on('click',function(){
    i++;
    $(".sections").append("<div class='section mt-4' id='section"+i+"'>"+
    "<div class='row mb-4'>"+
      "<div class='col-4'>"+
        "<label>Name</label>"+
        "<input class='form-control form-control-lg' type='text' id='section_name"+i+"'>"+
      "</div>"+
      "<div class='col-4'>"+
        "<label>Marks</label><br>"+
        "<select id='section_marks"+i+"' class='form-control' style='width=200px'>"+
          "<option value='0.5'>0.5</option>"+
          "<option value='1.0'>1.0</option>"+
          "<option value='1.5'>1.5</option>"+
          "<option value='2.0'>2.0</option>"+
          "<option value='2.5'>2.5</option>"+
          "<option value='3.0'>3.0</option>"+
          "<option value='3.5'>3.5</option>"+
          "<option value='4.0'>4.0</option>"+
          "<option value='4.5'>4.5</option>"+
          "<option value='5.0'>5.0</option>"+
        "</select>"+
      "</div>"+
    "</div>"+
    "<label>Instructions</label>"+
    "<div id='summernote"+i+"'></div>"+
  "</div>");
    $('#summernote'+i).summernote({
      placeholder: 'Instruction',
      tabsize: 2,
      height: 200
    });
  });

  $('#btnDeleteSection').on('click', function(){
    if(i != 1){
      $('#section'+i).remove();
      i--;
    }
  });

  $('#createAssessmentBtn').on('click', function () {

    const title = $('#title-objective').val()
    const desc = $($("#summernote").summernote("code")).text()
    const subject = $("#subject").find(":selected").val()

    const section_name1 = $('#section_name1').val();
    const section_marks1 = $('#section_marks1').find(":selected").val();
    const section_instr1 = $($("#summernote1").summernote("code")).text();

    if (title && desc && subject && section_name1 && section_marks1 && section_instr1) {

      if (objective == 'true') {
        //alert(objective)
        const sections = []
        sections.push({name:section_name1,marks:section_marks1,instructions:section_instr1});
        let index = 2;
        while (index <= i){
          sections.push({name:$('#section_name'+index).val(),marks:$('#section_marks'+index).find(":selected").val(),instructions: $($("#summernote"+index).summernote("code")).text()});
          index++;
        }
        console.log(sections);
        var form = new FormData();
        form.append("name", title);
        form.append("description", desc);
        form.append("subject_id", subject);
        form.append("sections", JSON.stringify(sections));
        // for (var key of form.entries()) {
        //   alert(key[1]);
        // }
        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/createObjectiveTest',
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
            //console.log('4') 

            if (result.status == 200) {
              new Notify ({
                  title: 'Success',
                  text : "Successfully created the Test",
                  autoclose: true,
                  status: 'success',
                  autotimeout: 3000
              });
              setTimeout(() => {
                window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id
              }, 2000)
            }
          },
          error: function (error) {
            alert("Request Failed with status: " + error.status);
          }
        });
      }
      if (objective == 'false') {
        var form = new FormData();
        form.append("name", title);
        form.append("description", desc);
        form.append("subject_id", subject);
        // for (var key of form.entries()) {
        //   alert(key[1]);
        // }
        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/createSubjectiveTest',
          type: 'POST',
          dataType: 'json',
          data: form,
          contentType: false,
          processData: false,
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            //alert(result.message);
            //console.log('4') 

            if (result.status == 200) {
              new Notify ({
                  title: 'Success',
                  text : "Successfully created the Test",
                  autoclose: true,
                  status: 'success',
                  autotimeout: 3000
              });
              setTimeout(() => {
                window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id
              }, 2000)
            }
          },
          error: function (error) {
            new Notify ({
                title: 'Error',
                text : result.message,
                autoclose: true,
                status: 'error',
                autotimeout: 3000
            });
          }
        });
      }


    }
    else {
      new Notify ({
          title: 'Error',
          text : "Fill all fields",
          autoclose: true,
          status: 'error',
          autotimeout: 3000
      });
    }

  })

})