$(document).ready(function() {

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id=' + subSemId,
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
        },
        success: function (result) {
            // alert(result.status);
            $('#courseClass').empty();
            if (result.status == 200) {

                
            }
            else {
                alert(result.message + " Please Login again");
                window.location.href = "Loginpage.html";
            }
        },
        error: function (error) {
            alert(result.message);
        }
    });

    let courses = [];

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/getCourses',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
        },
        success: function (result) {
            // alert(result.message);
            $('#courseList').empty();
            $('#courseSelectList').empty();
            if (result.status == 200) {
                // alert("here");
                let div1 = '<ul class="list-unstyled">';
                let div = "";
                $.each(result.data, function (key, value) {
                    // alert(value.id);
                    courses.push({
                        "id":value.id,
                        "name":value.name
                    });
                    //  alert(value.name);
                    div1 = div1 + "<li class='course' data-id='"+value.id+"'>"+value.name+"</li>";

                    div = div + "<div class='col-sm-4 course'>";
                    div = div + "<div class='card mb-3 shadow-sm'>";
                    if (value.course_image)
                        div = div + "<img class='card-img-top py-2' width='200' height='200' src='"+value.course_image+"' alt='No Image'>";
                    else
                        div = div + "<img class='card-img-top py-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'>";
                    // div = div + "<img class='card-img-top py-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'>";
                    div = div + "<div class='card-body'>";
                    div = div + "<h5 class='card-title font-weight-bold pb-0 mb-0'>"+value.name+"</h5>";
                    div = div + "<p class='py-0 my-0'><span class='span-heading'>Departments</span></p>";
                    div = div + "<div class='row'>";

                    $.each(value.departments, function (key, value) {
                        div = div + "<div class='col-sm-3 mb-2'>";
                        div = div + "<span class='span-heading span-dept'>"+value.name+"</span>";
                        div = div + "</div>";
                    });
                    
                    div = div + "</div><div class='d-flex py-0 justify-content-end'>";
                    div = div + "<button type='button' class='btn btn-primary' data-id='" + value.id + "'>+</button>";
                    div = div + "</div></div></div></div>";

                    
                });
                div1 = div1 + "</ul>";
                // alert(div1);
                $('#courseList').append(div);

                $('#courseSelectList').append(div1);
            }
            else
                $('#courseList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
            alert(error);
        }
    });

});