$(document).ready(function () {
  //   alert("ok");
  $.ajax({
    url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTests',
    type: 'GET',
    contentType: 'application/json',
    headers: {
      'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
    },
    success: function (result) {
      // alert(result.status);
      $('#assessmentList').empty();
      if (result.status == 200) {
        $.each(result.data, function (key, value) {
          /*  $.each(value.stars , function(k , v ){
              alert(v)
          });    */
          //  alert(value.name);
          if (value.questions_count)
            $('#assessmentList').append("<div class='col-sm-6 assessment' data-subSemId='" + value.subject_id + "'><div class='card mb-3 text-left'><h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description + "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions:" + value.questions_count + "<button class='btn btn-primary text-white pl-4 pr-4 assBtn'>Add</button></div></div>");
          else
            $('#assessmentList').append("<div class='col-sm-6 assessment' data-subSemId='" + value.subject_id + "'><div class='card mb-3 text-left'><h5 class=' font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5><div class='card-body pl-0'><p class='card-text pl-3'>" + value.description + "</p></div><div class='p-1 pl-3 pr-3 text-muted card-footer'>Questions:" + value.questions_count + "<button class='btn btn-primary text-white pl-4 pr-4 assBtn'>Send</button></div></div>");
        });
      }
      else
        $('#assessmentList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
    },
    error: function (error) {
      alert(result.message);
    }
  });

  $(document).on('click', '.assBtn', function () {

    // if($(".assBtn").innerHTML ===)

    let id = $(this).data('subsemid');
    if (id)
      window.location.href = "courseDetails.html?id=" + id;
    // alert(id);
  });




  //different  tab




});