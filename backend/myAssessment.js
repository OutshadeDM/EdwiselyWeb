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
        url: 'https://stagingfacultypython.edwisely.com/questionnaireWeb/getObjectiveTests',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          console.log(result);
          $('#assessmentList').empty();
          if (result.status == 200 && result.data) {
            displayCards(result.data);
          }
          else
            $('#assessmentList').append(`<div class='col-sm-12 py-5 objCard card'><h5><i>"Learners need endless feedback than they need endless teaching"</i> -Grant Wiggins<br><br> Create your assessments and provide the necessary feedback to learners </h5></div>`);
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
    });

    function displayCards(data = []){
        let currDate = parseInt(new Date().getDate() < 10 ? "0" + new Date().getDate() : new Date().getDate().toString())
        let currMonth = parseInt(new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1).toString())
        let currYear = parseInt(new Date().getFullYear().toString())
        let currHours = parseInt(new Date().getHours() < 10 ? "0" + new Date().getHours() : new Date().getHours().toString())
        let currMins = parseInt(new Date().getMinutes() < 10 ? "0" + new Date().getMinutes() : new Date().getMinutes().toString())
        // let currSecs = new Date().getSeconds() < 10 ? "0" + new Date().getSeconds() : new Date().getSeconds().toString()

        let div = ""
        
        $.each(data, function (key, value) {
            // if(value.id == 2393)
            //     value.doe = "2020-04-01 12:00:00";

            let startTime = value.doe;
            let testDate = parseInt(startTime.substring(8, 10))
            let testMonth = parseInt(startTime.substring(5, 7))
            let testYear = parseInt(startTime.substring(0, 4))
            let testHours = parseInt(startTime.substring(11, 13))
            let testMins = parseInt(startTime.substring(14, 16))
            // let testSecs = startTime.substr(17, 19) < 10 ? "0" + startTime.substr(17, 19) : startTime.substr(17, 19)

            let isEdit = false;
            
            if (testYear == currYear) {                
                if (testMonth > currMonth) {
                    isEdit = true;
                }
                else if (testMonth == currMonth) {
                    if (testDate > currDate) {
                        isEdit = true;
                    }
                    else if (testDate == currDate) {
                        if (testHours > currHours) {
                            isEdit = true;
                        }
                        else if (testHours == currHours && testMins > currMins) {
                            isEdit = true;
                        }
                    }
                }
            }
            else if (testYear > currYear) {
                isEdit = true;
            }

            div = div + "<li class='list-group-item objective'>";
            div = div + "<div class='row no-gutters d-flex align-items-center justify-content-center'>";
            if(value.start_time)
                div += "<div class='col-2'>"+value.start_time+"</div>";
            else
                div += "<div class='col-2'>"+value.created_at+"</div>"
            if(value.name.length > 15)
                div += "<div class='col-2 d-flex justify-content-center' data-toggle='tooltip' data-placement='top' title='"+value.name+"'>"+value.name.substr(0,15)+"...&nbsp;<img src='frontend/images/info.svg' width='10' /></div>"
            else
                div += "<div class='col-2 d-flex justify-content-center'>"+value.name+"</div>"
            if(value.subject_name.length > 10)
                div += "<div class='col-2 d-flex justify-content-center' data-toggle='tooltip' data-placement='top' title='"+value.subject_name+"'>" + value.subject_name.substr(0, 10) + "... &nbsp;<img src='frontend/images/info.svg' width='10' /></div>";
            else
                div += "<div class='col-2 d-flex justify-content-center'>" + value.subject_name + "</div>";
            div += "<div class='col-2 d-flex justify-content-center'>"+value.questions_count+"&nbsp;<img class='img-responsive' src='frontend/images/info.svg'  data-toggle='tooltip' data-placement='top' title='Sent to - "+value.students_count+"'/></div>";
            // 5th column
            // console.log(isSmall)
            if (value.doe == "" && !value.sent && !value.questions_count)
                div += "<div class='col-2'></div>";
            else if (value.doe == "" && !value.sent && value.questions_count > 0)
                div += "<div class='col-2 d-flex justify-content-center align-items-center' style='color:blue;'><a href='addQuestionsPage.html?id=" + value.subject_id + "&tid=" + value.id + "&tname=" + value.name + "&desc=" + value.description + "&isObj=true&qc=" + value.questions_count + "'><i class='fas fa-edit'></i>&nbsp;Edit</a></div>";
            else if (value.doe != "" && value.questions_count > 0 && isEdit)
                div += "<div class='col-2 d-flex justify-content-center' style='color:blue;'>Awaiting Result</div>";
            else if (value.doe != "" && value.questions_count > 0 && !isEdit)
                div += "<div class='col-2 d-flex justify-content-center' style='color:blue;'><img class='img-responsive' src='frontend/images/assessment-result.svg'/>&nbsp;Result</div>";
            
            // 6th column
            if (value.doe == "" && !value.sent && !value.questions_count)
                div += "<div class='col-2 d-flex justify-content-center'><a href='addQuestionsPage.html?id=" + value.subject_id + "&tid=" + value.id + "&tname=" + value.name + "&desc=" + value.description + "&isObj=true&qc=" + value.questions_count + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Add&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></a></div>";
            else if (value.doe == "" && !value.sent && value.questions_count > 0)
                div += "<div class='col-2 d-flex justify-content-center'><a href='sendQuestionsPage.html?id=" + value.subject_id + "&tid=" + value.id + "&tname=" + value.name + "&desc=" + value.description + "&isObj=true&qc=" + value.questions_count + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Send&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></a></div>";
            else if (value.doe != "" && value.questions_count > 0 && isEdit)
            div += "<div class='col-2 d-flex justify-content-center'><button class='btn btn-primary text-white pl-4 pr-4 assBtn condLink' style='cursor:not-allowed;' disabled>View Result&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></button></div>";
                // div += "<div class='col-2 d-flex justify-content-center'><a href='sendQuestionsPage.html?id=" + value.subject_id + "&tid=" + value.id + "&tname=" + value.name + "&desc=" + value.description + "&isObj=true&qc=" + value.questions_count + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Re-Send&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></a></div>";
            else if (value.doe != "" && value.questions_count > 0 && !isEdit)
                div += "<div class='col-2 d-flex justify-content-center'><button class='btn btn-primary text-white pl-4 pr-4 assBtn condLink' data-id='" + value.id + "' data-test='" + value.test_completed + "'>View Result&nbsp;<img class='img-responsive pb-1' src='frontend/images/right-arrow-white.svg'/></button></div>";
        });

        $("#assessmentList").append(div);
        $('[data-toggle="tooltip"]').tooltip();
    }

    $(document).on('click', '.condLink', function () {
        let test_id = $(this).data('id');
        let test_completed = $(this).data('test');
        console.log(test_completed);
        if (test_completed > 0) {
          let link = document.createElement('a');
          link.href = "https://develop.createtest.edwisely.com/facaltytestdashboard?test_id=" + test_id + "&token=" + `${$user.token}`;
          link.target = "_blank";
          link.dispatchEvent(new MouseEvent('click'));
        }
    });
    
});