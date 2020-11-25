$(document).ready(function(){
    // alert("ok");
    let searchParams = new URLSearchParams(window.location.search);
    let subSemId;
    if(searchParams.has('id')){
        subSemId = searchParams.get('id');
        // alert(subSemId);

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id='+subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                $('#courseClass').empty();
                if(result.status == 200){

                    $("#courseName").text(result.data.subject_name);
                    $("#courseDesc").text("No Description Available");
                    $("#courseObjc").text("No Objectives Available");
                    $("#courseOutc").text("No Outcomes Available");
                    
                    if(result.data.description)
                        $("#courseDesc").text(result.data.description);

                    if(result.data.objectives){
                        $("#courseObjc").empty();
                        $("#courseObjc").append("<ul>");
                        $.each(result.data.objectives , function(key , value){
                            $("#courseObjc").append("<li>" + value + "</li>");
                        });
                        $("#courseObjc").append("</ul>");
                    }

                    if(result.data.outcomes){
                        $("#courseOutc").empty();
                        $("#courseOutc").append("<ul>");
                        $.each(result.data.outcomes , function(key , value){
                            $("#courseOutc").append("<li>" + value + "</li>");
                        });
                        $("#courseOutc").append("</ul>");
                    }

                    if(result.data.image)
                        $("#courseImg").attr("src",result.data.image);

                    if(result.data.sections){
                        $("#courseClass").empty();
                        $("#courseClass").append("<ul>");
                        $.each(result.data.sections , function(key , value){
                            // alert(value);
                            $("#courseClass").append("<li>" + value.name + "</li>");
                        });
                        $("#courseClass").append("</ul>");
                    }
                }
                else{
                    alert(result.message+" Please Login again");
                    window.location.href = "Loginpage.html";
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });

    }
    else 
        window.location.href = "courses.html";
    // alert(subSemId);

    $("#nav-syllabus-tab").click(function(){
        // alert("The paragraph was clicked.");
        
        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id='+subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                $('#courseSyllabus').empty();
                if(result.status == 200 && result.data){
                    $.each(result.data , function(key , value){
                        // alert(value);
                        let div = "";
                        div = div + "<div class='row p-3 mb-2'>";
                        div = div + "<div class='col-sm-8'>";
                        div = div + "<p class='mt-1'><strong>" + value.name + "</strong></p>";
                        div = div + "<div class='my-auto'>";
                        div = div + "<p><span>Objectives</span><ul>";
                        $.each(value.objectives , function(key , value){
                            div = div + "<li>" + value + "</li>";
                        });
                        div = div + "</ul></p>";
                        div = div + "<p class='mt-2'><span>Outcome</span><ul>";
                        $.each(value.outcomes , function(key , value){
                            div = div + "<li>" + value + "</li>";
                        });
                        div = div + "</ul></p>";
                        div = div + "</div></div>";
                        div = div + "<div class='col-sm-4'>";
                        div = div + "<p><strong>Topics Covered</strong></p>";
                        $.each(value.topics , function(key , value){
                            div = div + "<span class='badge badge-pill badge-secondary'>" + value.topic_name + "</span><br>";
                        });
                        div = div + "</div></div";
                        $('#courseSyllabus').append(div);
                        // $('#courseSyllabus').append("</ul>");
                        // $('#courseSyllabus').append("</ul>");
                    });
                    
                }
                else{
                    $('#courseSyllabus').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });




      });

});