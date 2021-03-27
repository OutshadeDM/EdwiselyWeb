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
        url: 'https://stagingfacultypython.edwisely.com/survey/getSurveys',
        type: 'GET',
        contentType: 'application/json',
        headers: {
          'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
          // console.log(result.data);
          $('#feedbackList').empty();
          if (result.status == 200 && result.data) {

            let div = "";

            $.each(result.data, function (key, value) {

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
                div += "<div class='col-4'><a class='btn btn-primary text-white px-4 assBtn' href='sendFeedback.html?id=" + value.id + "'>Send</a></div>";
              else
                div += "<div class='col-4'><button class='btn btn-primary text-white px-4 assBtn' data-id='" + value.id + "' data-name='"+value.name+"' data-toggle='modal' data-target='#statModal'>View Stats</button></div>";
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
        const name = button.data('name');
        $('#statModalLabel').text(name);
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
              $row = $('<div></div>').addClass('row my-3 survey-charts');
              modal.find('.modal-body').html($row);
              $.each(result.data, (index, surveyResult) => {
                const col = `
                  <div class="col-12 mb-4 d-flex justify-content-center">
                    <div class="mt-3 position-relative mb-4" style='height:300px;width:600px'>
                      <canvas id="surveyChart${surveyResult.id}"></canvas>
                      <div id="no-data${surveyResult.id}" style="text-align: center; display: none; width: 100%; height: 100%; position: absolute; right: 0; top: 100px; z-index: 20;">
                        <b>No One Voted Till Now</b>
                      </div>
                    </div>
                  </div>
                `;
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
                let sum = 0;
                $.each(surveyResult.options, (index, option) => {
                  sum += option.selected_count;
                  option_names.push(`${option.name} - ${option.selected_count}`);
                  data.push(option.selected_count);
                });
                if(sum > 0)
                  modal.find('.modal-body .row.survey-charts').append(col);
                else
                  modal.find('.modal-body .row.survey-charts').append("<p class='text-center w-100'> No one voted till now")
			          
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
                      position: 'bottom',
                    },
                    title: {
                      display: true,
                      fontSize: 20,
                      fontStyle: 'bold',
                      text: surveyResult.name
                    },
                    animation: {
                      animateScale: true,
                      animateRotate: true,
                      onComplete: function(animation) {
                        var firstSet = animation.chart.config.data.datasets[0].data,
                          dataSum = firstSet.reduce((accumulator, currentValue) => accumulator + currentValue);
                      
                        if (typeof firstSet !== "object" || dataSum === 0){
                          document.getElementById(`no-data${surveyResult.id}`).style.display = 'block';
                          // document.getElementById(`surveyChart${surveyResult.id}`).style.display = 'none';
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