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

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/assignment/getAllAssignments',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          console.log(result);
          if (result.status == 200 && result.data) {
            $('#assignmentList').empty();

            let currDate = parseInt(new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate().toString())
            let currMonth = parseInt(new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString())
            let currYear = parseInt(new Date().getFullYear().toString())
            let currHours = parseInt(new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours().toString())
            let currMins = parseInt(new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes().toString())

            let div = "";
          
            $.each(result.data, function (key, value) {

                let startTime = value.due_date;
                let testDate = parseInt(startTime.substring(8, 10))
                let testMonth = parseInt(startTime.substring(5, 7))
                let testYear = parseInt(startTime.substring(0, 4))
                let testHours = parseInt(startTime.substring(11, 13))
                let testMins = parseInt(startTime.substring(14, 16))
                // let testSecs = startTime.substr(17, 19) < 10 ? "0" + startTime.substr(17, 19) : startTime.substr(17, 19)

                // console.log(startTime)
                let isEdit = false;

                if (testYear == currYear) {
                    if (testMonth > currMonth)
                        isEdit = true;
                    else if (testMonth == currMonth) {
                        if (testDate > currDate)
                            isEdit = true;
                        else if (testDate == currDate) {
                            if (testHours > currHours)
                                isEdit = true;
                            else if (testHours == currHours && testMins > currMins)
                                isEdit = true;
                        }
                    }
                }
                else if (testYear > currYear) {
                    isEdit = true;
                }

                div += "<li class='list-group-item objective'>";
                div += "<div class='row no-gutters d-flex align-items-center justify-content-center'>";
                if (value.start_date)
                    div += "<div class='col-2'>" + value.start_date.substring(0, 10) + "</div>";
                else
                    div += "<div class='col-2'>" + value.created_at.substring(0, 10) + "</div>"
                if (value.name.length > 15)
                    div += "<div class='col-2 d-flex justify-content-center' data-toggle='tooltip' data-placement='top' title='" + value.name + "'>" + value.name.substr(0, 15) + "...&nbsp;<img src='frontend/images/info.svg' width='10' /></div>"
                else
                    div += "<div class='col-2 d-flex justify-content-center'>" + value.name + "</div>"
                if (value.description.length > 10)
                    div += "<div class='col-2 d-flex justify-content-center' data-toggle='tooltip' data-placement='top' title='" + value.description + "'>" + value.description.substr(0, 10) + "... &nbsp;<img src='frontend/images/info.svg' width='10' /></div>";
                else
                    div += "<div class='col-2 d-flex justify-content-center'>" + value.description + "</div>";
                // div += "<div class='col-2 d-flex justify-content-center' data-toggle='tooltip' data-placement='top' title='No of questions'>" + value.questions_count + "</div>";
                div += "<div class='col-2 d-flex justify-content-center'>" + value.subject_name + "</div>";
                
                if (!value.questions_count)
                    div += "<div class='col-2'></div>";
                else if (!value.sent && value.questions_count > 0)
                    div += "<div class='col-2 d-flex justify-content-center align-items-center' style='color:blue;'><a href='feedbackQuestions.html?id=" + value.id + "&fname=" + value.name + "&qc=" + value.questions_count + "'><i class='fas fa-edit'></i>&nbsp;Edit</a></div>";
                else
                    div += "<div class='col-2 d-flex justify-content-center'></div>";
                
                if (!value.questions_count)
                    div += "<div class='col-2 d-flex justify-content-center'><a href='feedbackQuestions.html?id=" + value.id + "&fname=" + value.name + "&qc=" + value.questions_count + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Add&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></a></div>";
                else if (!value.sent && value.questions_count > 0)
                    div += "<div class='col-2 d-flex justify-content-center'><a href='sendCodingAssessment.html?id=" + value.id + "&tname=" + value.name + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Send&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></a></div>";
                else
                    div += "<div class='col-2 d-flex justify-content-center'><button class='btn btn-primary text-white pl-4 pr-4 assBtn condLink' data-id='" + value.id + "' data-name='"+value.name+"' data-toggle='modal' data-target='#statModal'>View Stats&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></button></div>";

                // console.log(div)
            });
            // console.log(new Date());
            $('#assignmentList').append(div);
            $('[data-toggle="tooltip"]').tooltip();

          }
          else
            $('#assignmentList').append(`<div class='col-sm-12 py-5 objCard card'><h5><i>"Learners need endless feedback than they need endless teaching"</i> -Grant Wiggins<br><br> Create your assessments and provide the necessary feedback to learners </h5></div>`);
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

});