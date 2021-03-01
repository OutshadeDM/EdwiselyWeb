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
        url: 'https://stagingfacultypython.edwisely.com/survey/getSurveys',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          console.log(result.data);
          $('#feedbackList').empty();
          if (result.status == 200 && result.data) {

            let div = "";

            $.each(result.data, function (key, value) {

            // let endDateString = "";
            // let endDate = value.doe;
            // if (value.start_time) endDate = new Date(value.start_time.toLocaleString().replace(/\s/, 'T'));
            // else endDate = new Date(value.created_at.toLocaleString().replace(/\s/, 'T'));
            // if(value.start_time) console.log(endDate)
            // if (!isObj && value.start_time) {
            //     endDate.setMinutes(endDate.getMinutes() + value.timelimit);
            //     endDateString = endDate.getFullYear() + '-' + ('0' + (endDate.getMonth() + 1)).slice(-2) + '-' + ('0' + endDate.getDate()).slice(-2) + ' ' + endDate.getHours() + ':' + ('0' + (endDate.getMinutes())).slice(-2) + ':' + ('0' + (endDate.getSeconds())).slice(-2);
            // }
            // else if (!isObj && value.created_at) endDate.setMinutes(endDate.getMinutes() + value.timelimit);

            // let endDateString = "";
            // if(value.doe) 

            // div = div + "<div class='col-sm-6 assessment'>";
            // div = div + "<div class='card mb-3 objCard text-left' style='cursor:auto;'>";
            // div = div + "<h5 class='font-weight-bold pl-3 pt-2 pr-3'>" + value.name + "</h5>";
            // div = div + "<p class='pl-3 condCardDesc'>" + value.description + "</p>";
            // div = div + "<div class='card-body pl-1 pb-0 align-bottom pl-3'>";
            // // if (value.start_time) {
            // //     div = div + "<h6 class='font-weight-bold'>" + value.start_time + "  -  " + value.doe + "</h6>";
            // // }
            // // else {
            // //     div = div + "<h6 class='font-weight-bold'>" + value.created_at + "  -  " + value.doe + "</h6>";
            // // }
            // if(value.sent){
            //     div += "<button class='btn btn-primary text-white px-4 assBtn' data-id='" + value.id + "' data-toggle='modal' data-target='#statModal'>View Stats</button>";
            // }
            // else{
            //   div += "<a class='btn btn-primary text-white px-4 assBtn' href='sendFeedbacks.html?id=" + value.id + "&tname=" + value.name + "&qc=" + value.questions_count + "'>Send</a>";
            // }
            // div = div + "</div><div class='px-3 text-muted card-footer' style='height:45px'>";
            // div = div + "<div class='row'>";
            // div = div + "<div class='col-sm-4'>";
            // div = div + "Questions: <span class='font-weight-bold'>" + value.questions_count + "</span>";
            // div = div + "</div>";
            // div = div + "<div class='col-sm-4'>";
            // div = div + "Sent To: <span class='font-weight-bold'>" + value.students_count + "</span>";
            // div = div + "</div>";
            // div = div + "</div></div></div></div>";

              div = div + "<div class='col-sm-6 assessment'>";
              div = div + "<div class='card mb-3 objCard text-left'>";
              div = div + "<h5 class='font-weight-bold pl-3 pt-2 pr-5'>" + value.name + "</h5>";
              if (!value.sent)
                div = div + "<a class='btn editBtn' href='feedbackQuestions.html?id=" + value.id + "&fname=" + value.name + "&qc=" + value.questions_count + "'><i class='fas fa-pen'></i></a>";
              div = div + "<div class='card-body pl-0'>";
              div = div + "<p class='card-text pl-3'>" + value.description + "</p>";
              div = div + "</div>";
              div = div + "<div class='p-1 pl-3 pr-3 text-muted card-footer row no-gutters' style='height:45px'>";
              div += "<div class='col-4'>";
              div = div + "Questions: " + value.questions_count;
              div += "</div>";
              div += "<div class='col-4'>";
              div = div + "Sent To: " + value.students_count;
              div += "</div>";
              if (!value.questions_count)
                div = div + "<div class='col-4'><a href='feedbackQuestions.html?id=" + value.id + "&fname=" + value.name + "&qc=" + value.questions_count + "' class='btn btn-primary text-white pl-4 pr-4 assBtn'>Add</a></div>";
              else if (value.questions_count > 0 && !value.sent)
                div += "<div class='col-4'><a class='btn btn-primary text-white px-4 assBtn' href='sendFeedback.html?id=" + value.id+ ">Send</a></div>";
              else
                div += "<div class='col-4'><button class='btn btn-primary text-white px-4 assBtn' data-id='" + value.id + "' data-toggle='modal' data-target='#statModal'>View Stats</button></div>";
              div = div + "</div></div></div>";

            });
            // console.log(new Date());
            $('#feedbackList').append(div);

          }
          else
            $('#feedbackList').append(`<div class='col-sm-12 py-5 objCard card'><h5><i>"Learners need endless feedback than they need endless teaching"</i> -Grant Wiggins<br><br> Create your assessments and provide the necessary feedback to learners </h5></div>`);
        },
        error: function (error) {
          alert("Request Failed with status: " + error.status);
        }
      });

      $('#statModal').on('show.bs.modal', function (event) {
        const button = $(event.relatedTarget); // Button that triggered the modal
        const id = button.data('id'); // Extract info from data-* attributes
        const modal = $(this);

        $.ajax({
          url: 'https://stagingfacultypython.edwisely.com/survey/getSurveyStats?survey_id=' + id,
          type: 'GET',
          contentType: 'application/json',
          headers: {
            'Authorization': `Bearer ${$user.token}`
          },
          success: function (result) {
            if (result.status == 200 && result.data) {

              // $col1 = $('<div></div>').addClass('col-2 mt-1').append($img);
              // $col2 = $('<div></div>').addClass('col-10 pl-0 desc m-0').text(text);
              $row = $('<div></div>').addClass('row my-3 survey-charts');
              modal.find('.modal-body').html($row);
              $.each(result.data, (index, surveyResult) => {
                const col = `
                  <div class="col-12 mt-2">
                    <div class="mt-3 position-relative">
                      <canvas id="surveyChart${surveyResult.id}"></canvas>
                      <div id="no-data${surveyResult.id}" style="text-align: center; display: none; width: 100%; height: 100%; position: absolute; right: 0; top: 100px; z-index: 20;">
                        <b>No One Voted Till Now</b>
                      </div>
                    </div>
                  </div>
                `;
                modal.find('.modal-body .row.survey-charts').append(col);
                let option_names = []
                let data = [];
                let colors = [
                  '#4D4D4D',
                  '#5DA5DA',
                  '#FAA43A',
                  '#60BD68',
                  '#F17CB0',
                  '#B2912F',
                  '#B276B2',
                  '#DECF3F',
                  '#F15854'
                ];
                $.each(surveyResult.options, (index, option) => {
                  option_names.push(`${option.name} - ${option.selected_count}`);
                  data.push(option.selected_count);
                });
                var ctx = document.getElementById(`surveyChart${surveyResult.id}`).getContext('2d');
                var myChart = new Chart(ctx, {
                  type: 'doughnut',
                  data: {
                    labels: option_names,
                    datasets: [{
                      label: surveyResult.name,
                      data: data,
                      backgroundColor: colors.splice(0, surveyResult.options.length),
                      borderWidth: 1
                    }]
                  },
                  options: {
                    responsive: true,
                    legend: {
                      position: 'left',
                    },
                    title: {
                      display: true,
                      fontSize: 15,
                      fontStyle: 'bold',
                      text: surveyResult.name
                    },
                    animation: {
                      animateScale: true,
                      animateRotate: true,
                      onComplete: function(animation) {
                        var firstSet = animation.chart.config.data.datasets[0].data,
                          dataSum = firstSet.reduce((accumulator, currentValue) => accumulator + currentValue);
                      
                        if (typeof firstSet !== "object" || dataSum === 0) {
                          document.getElementById(`no-data${surveyResult.id}`).style.display = 'block';
                        }
                      }
                    }
                  }
                });			
              });
              
            }
          },
          error: function (error) {
            alert("Request Failed with status: " + error.status);
          }
        });

      })

});