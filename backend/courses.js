$(document).ready(function () {
    //   alert("ok");
    let courses = [];

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
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
                        $('#courseList').append("<div class='col-sm-4 course' data-subSemId='" + value.subject_semester_id + "'><div class='card mb-3 shadow-sm course-card'><img class='card-img-top p-2' width='200' height='200' src='" + value.course_image + "' alt='No Image'><div class='card-body'><h5 class='card-title font-weight-bold'>" + value.name + "</h4></div></div></div>");
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

    $(document).on('click', '.course', function () {
        let id = $(this).data('subsemid');
        if (id)
            window.location.href = "courseDetails.html?id=" + id;
        // alert(id);
    });

    // $('#courseSelectList').select2();

    $("#courseSelect").click(function () {
        // alert("here");
        $("#courseSelectList").show();
    });

    $("#courseSelect").keyup(function () {
        let searchTerm = $("#courseSelect").val().toLowerCase();
        // alert(searchTerm);
        $("#courseSelectList").show();
        if(courses.length > 0){
            let div = "<ul class='list-unstyled'>";
            $('#courseSelectList').empty();
            $.each(courses, function (key, value) {
                // alert("here");
                if(value.name.toLowerCase().indexOf(searchTerm) != -1)
                    div = div + "<li class='course' data-subSemId='"+value.subject_semester_id+"'>"+value.name+"</li>";
            });
            div = div + "</ul>";
            $("#courseSelectList").append(div);
        }
    });

    $("#courseSelect").blur(function () {
        // alert("here");
        $("#courseSelectList").fadeOut();
    });
});