$(document).ready(function() {

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/getCourses',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
        },
        success: function (result) {
            // alert(result.status);
            $('#courseList').empty();
            $('#courseSelectList').empty();
            let div = '<ul class="list-unstyled">';
            if (result.status == 200) {
                $.each(result.data, function (key, value) {
                    courses.push({
                        "subSemId":value.subSemId,
                        "name":value.name
                    });
                    //  alert(value.name);
                    div = div + "<li class='course' data-subSemId='"+value.subject_semester_id+"'>"+value.name+"</li>";

                    if (value.course_image)
                        $('#courseList').append("<div class='col-sm-4 course' data-subSemId='" + value.subject_semester_id + "'><div class='card mb-3 shadow-sm'><img class='card-img-top p-2' width='200' height='200' src='" + value.course_image + "' alt='No Image'><div class='card-body'><h5 class='card-title font-weight-bold'>" + value.name + "</h4></div></div></div>");
                    else
                        $('#courseList').append("<div class='col-sm-4 course' data-subSemId='" + value.subject_semester_id + "'><div class='card mb-3 shadow-sm'><img class='card-img-top p-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'><div class='card-body'><h5 class='card-title font-weight-bold'>" + value.name + "</h4></div></div></div>");
                });
                div = div + "</ul>";
                $('#courseSelectList').append(div);
            }
            else
                $('#courseList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
            alert(result.message);
        }
    });

});