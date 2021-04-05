$(document).ready(function () {
  //alert("hello")

  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    $("#greetingNav").html($user.name);
  } else {
    window.location.replace("login.html");
  }


  let searchParams = new URLSearchParams(window.location.search);
  let objective = false
  let i = 1
  let tId = 0;
  const old_sections = [];
  if (searchParams.has('isObj')) {
    objective = searchParams.get('isObj')
  }
  if (searchParams.has('id')) {
    tId = searchParams.get('id')
    getTestDetails()
  }
  else
    getSubjects(0)

  function getTestDetails() {
    $.ajax({
      url: `https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTestDetails?test_id=${tId}`,
      type: 'GET',
      contentType: 'application/json',
      headers: {
        'Authorization': `Bearer ${$user.token}`
      },
      success: function (result) {
        console.log(result)
        if (result.status == 200 && result.data) {
          $(".sections").empty();
          $('#courseName').text(result.data.name);
          i=0;
          $('#title-objective').val(result.data.name)
          $("#summernote").summernote("code",result.data.description)
          getSubjects(result.data.subject_id)
          $.each(result.data.sections, function (key, value) {
            i++;
            $(".sections").append("<div class='section mt-4' id='section"+i+"'>"+
              "<div class='row mb-4'>"+
                "<div class='col-4'>"+
                  "<label>Name</label>"+
                  "<input class='form-control form-control-lg' type='text' id='section_name"+i+"' value='"+value.name+"'>"+
                "</div>"+
                "<div class='col-4'>"+
                  "<label>Marks</label><br>"+
                  "<select id='section_marks"+i+"' class='form-control' style='width=200px'>"+
                  "<option value='0.5'>0.5</option>"+
                  "<option value='1'>1.0</option>"+
                  "<option value='1.5'>1.5</option>"+
                  "<option value='2'>2.0</option>"+
                  "<option value='2.5'>2.5</option>"+
                  "<option value='3'>3.0</option>"+
                  "<option value='3.5'>3.5</option>"+
                  "<option value='4'>4.0</option>"+
                  "<option value='4.5'>4.5</option>"+
                  "<option value='5'>5.0</option>"+
                  "<option value='5.5'>5.5</option>"+
                  "<option value='6'>6.0</option>"+
                  "<option value='6.5'>6.5</option>"+
                  "<option value='7'>7.0</option>"+
                  "<option value='7.5'>7.5</option>"+
                  "<option value='8'>8.0</option>"+
                  "<option value='8.5'>8.5</option>"+
                  "<option value='9'>9.0</option>"+
                  "<option value='9.5'>9.5</option>"+
                  "<option value='10'>10.0</option>"+
                  "</select>"+
                "</div>"+
              "</div>"+
              "<label>Instructions</label>"+
              "<div id='summernote"+i+"'></div>"+
            "</div>");
            $('#section_marks'+i).val(value.marks)
            $('#summernote'+i).summernote({
              placeholder: 'Instruction',
              tabsize: 2,
              height: 200
            });
            $("#summernote"+i).summernote("code",value.instructions);
            old_sections.push(value);
          });
        }        
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }


  function getSubjects(subject_id){
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
          if(subject_id){
            $('#subject').val(subject_id);
            $("#subject").prop('disabled',true);
          }

        }
      },
      error: function (error) {
        alert("Request Failed with status: " + error.status);
      }
    });
  }
  
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
          "<option value='1'>1.0</option>"+
          "<option value='1.5'>1.5</option>"+
          "<option value='2'>2.0</option>"+
          "<option value='2.5'>2.5</option>"+
          "<option value='3'>3.0</option>"+
          "<option value='3.5'>3.5</option>"+
          "<option value='4'>4.0</option>"+
          "<option value='4.5'>4.5</option>"+
          "<option value='5'>5.0</option>"+
          "<option value='5.5'>5.5</option>"+
          "<option value='6'>6.0</option>"+
          "<option value='6.5'>6.5</option>"+
          "<option value='7'>7.0</option>"+
          "<option value='7.5'>7.5</option>"+
          "<option value='8'>8.0</option>"+
          "<option value='8.5'>8.5</option>"+
          "<option value='9'>9.0</option>"+
          "<option value='9.5'>9.5</option>"+
          "<option value='10'>10.0</option>"+
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
    console.log(i)
    if(i > 1){
      $('#section'+i).remove();
      i--;
    }
  });

  $('#createAssessmentBtn').on('click', function () {

    const title = $('#title-objective').val()
    const desc = $("#summernote").summernote("code").replace(/<\/?[^>]+(>|$)/g, "")
    const subject = $("#subject").find(":selected").val()

    const section_name1 = $('#section_name1').val();
    const section_marks1 = $('#section_marks1').find(":selected").val();
    const section_instr1 = $("#summernote1").summernote("code").replace(/<\/?[^>]+(>|$)/g, "");

    // console.log(title,desc,subject,section_name1,section_marks1,section_instr1);
    
    if (title && desc && subject && section_name1 && section_marks1) {

      if (objective == 'true') {
        const form = new FormData();
        form.append("name", title);
        form.append("description", desc);
        // for (var key of form.entries()) {
        //   console.log(key[1]);
        // }
        if(tId){
          const sections = []
          sections.push({id:old_sections[0].id,name:section_name1,marks:section_marks1,instructions:section_instr1,upload_rough_sheets:0});
          let index = 2;
          while (index <= i){
            const sname = $('#section_name'+index).val()
            const smarks = $('#section_marks'+index).find(":selected").val();
            if(sname && smarks){
              if(old_sections[index-1])
                sections.push({id:old_sections[index-1].id,name:sname,marks:smarks,instructions: $("#summernote"+index).summernote("code").replace(/<\/?[^>]+(>|$)/g, ""),upload_rough_sheets:0});
              else
                sections.push({name:sname,marks:smarks,instructions: $("#summernote"+index).summernote("code").replace(/<\/?[^>]+(>|$)/g, ""),upload_rough_sheets:0});
            }
            index++;
          }          
          form.append("test_id",tId)
          form.append("sections", JSON.stringify(sections));
          // console.log(sections);
          // for (var key of form.entries()) {
          //   console.log(key[1]);
          // }

          $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/editObjectiveTestDetails',
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
                    text : "Successfully Updated the Test",
                    autoclose: true,
                    status: 'success',
                    autotimeout: 3000
                });
                setTimeout(() => {
                  window.location.href = "addQuestionsPage.html?tid=" + result.test_id +"&tname="+result.test_name+"&ca=0";
                }, 2000)
              }
            },
            error: function (error) {
              alert("Request Failed with status: " + error.status);
            }
          });
        }
        else{
          const sections = []
          sections.push({name:section_name1,marks:section_marks1,instructions:section_instr1});
          let index = 2;
          while (index <= i){
            if($('#section_name'+index).val() && $('#section_marks'+index).find(":selected").val()){
              sections.push({name:$('#section_name'+index).val(),marks:$('#section_marks'+index).find(":selected").val(),instructions: $($("#summernote"+index).summernote("code")).text()});
            }
            index++;
          }
          form.append("sections", JSON.stringify(sections));
          form.append("subject_id", subject);
          // console.log(sections);

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
              if (result.status == 200) {
                new Notify ({
                    title: 'Success',
                    text : "Successfully created the Test",
                    autoclose: true,
                    status: 'success',
                    autotimeout: 3000
                });
                setTimeout(() => {
                  window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id;
                }, 2000)
              }
            },
            error: function (error) {
              alert("Request Failed with status: " + error.status);
            }
          });
        }
      }
      else if (objective == 'false') {
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
            alert(result.message);
            if (result.status == 200) {
              new Notify ({
                  title: 'Success',
                  text : "Successfully created the Test",
                  autoclose: true,
                  status: 'success',
                  autotimeout: 3000
              });
              setTimeout(() => {
                window.location.href = "addQuestionsPage.html?ca=0&tid=" + result.test_id + "&tname="+result.name;
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