$(document).ready(function () {

    $user = "";
    if (isLoggedIn()) {
      // console.log(isLoggedIn(), 'yes');
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTests',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // alert(result.status);
          $('#objectiveassessmentList').empty();
          if (result.status == 200 && result.data) {
            // displayCards(result.data, true);


            let div = "";

            $.each(result.data, function (key, value) {

            // let endDateString = "";
            // let endDate;
            // if (value.start_time) endDate = new Date(value.start_time.toLocaleString().replace(/\s/, 'T'));
            // else endDate = new Date(value.created_at.toLocaleString().replace(/\s/, 'T'));
            // if(value.start_time) console.log(endDate)
            // if (!isObj && value.start_time) {
            //     endDate.setMinutes(endDate.getMinutes() + value.timelimit);
            //     endDateString = endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' + ('0' + endDate.getDate()).slice(-2) + ' ' + endDate.getHours() + ':' + ('0' + (endDate.getMinutes())).slice(-2) + ':' + ('0' + (endDate.getSeconds())).slice(-2);
            // }
            // else if (!isObj && value.created_at) endDate.setMinutes(endDate.getMinutes() + value.timelimit);

            let endDateString = "";
            // if(value.doe) 

            div = div + "<div class='col-sm-6 assessment'>";
            div = div + "<div class='card mb-3 objCard text-left' style='cursor:auto;'>";
            div = div + "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5>";
            div = div + "<p class='pl-3 condCardDesc'>" + value.description + "</p>";
            div = div + "<div class='card-body pl-1 pb-0 align-bottom pl-3'>";
            if (value.start_time) {
                if (!isObj)
                div = div + "<h6 class='font-weight-bold'>" + value.start_time + "  -  " + endDateString + "</h6>";
                else
                div = div + "<h6 class='font-weight-bold'>" + value.start_time + "  -  " + value.doe + "</h6>";
            }
            else {
                if (!isObj)
                div = div + "<h6 class='font-weight-bold'>" + value.created_at + "  -  " + endDateString + "</h6>";
                else
                div = div + "<h6 class='font-weight-bold'>" + value.created_at + "  -  " + value.doe + "</h6>";
            }
            if(endDate < new Date()){
                div += "<button class='btn btn-primary text-white pl-4 pr-4 assBtn condLink' data-id='" + value.id + "' data-test='" + value.test_completed + "'>View Result</button>";
            }
            else{
                console.log(endDate);
            }
            div = div + "</div><div class='px-3 text-muted card-footer' style='height:45px'>";
            div = div + "<div class='row'>";
            div = div + "<div class='col-sm-4'>";
            div = div + "Questions: <span class='font-weight-bold'>" + value.questions_count + "</span>";
            div = div + "</div>";
            div = div + "<div class='col-sm-4'>";
            div = div + "Sent To: <span class='font-weight-bold'>" + value.students_count + "</span>";
            div = div + "</div>";
            div = div + "<div class='col-sm-4'>";
            div = div + "Answered: <span class='font-weight-bold'>" + value.test_completed + "</span>";
            div = div + "</div></div></div></div></div>";
            });
            console.log(new Date());

            if (isObj)
            $('#condObjAssessmentList').append(div);
            else
            $('#condSubAssessmentList').append(div);




          }
          else
            $('#objectiveassessmentList').append(`<div class='col-sm-12 py-5 objCard card'><h5><i>"Learners need endless feedback than they need endless teaching"</i> -Grant Wiggins<br><br> Create your assessments and provide the necessary feedback to learners </h5></div>`);
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

});