$(document).ready(function () {
    $user = "";
	if (isLoggedIn()) {
		// console.log(isLoggedIn(), 'yes');
		$user = JSON.parse(isLoggedIn());
		$('html').removeClass('d-none');
	} else {
		window.location.replace("login.html");
    }
    alert

    let courses = [];

    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': `Bearer ${$user.token}`
        },
        success: function (result) {
            $('#loadingDiv').remove();
            $('#courseList').empty();
            $('#courseSelectList').empty();
            let div = '<ul class="list-unstyled">';
            if (result.status == 200) {
                $.each(result.data, (index,course) => {
                    courses.push({
                        "subSemId":course.subject_semester_id,
                        "name":course.name
                    });
                    div = div + "<li class='course' data-subSemId='"+course.subject_semester_id+"'>"+course.name+"</li>";
                    
                    $img = $('<img>').addClass('card-img-top img-fluid pb-2').attr('src', course.course_image || '../images/onlineCourses.png');
                    $title = $('<h5></h5>').addClass('card-title font-weight-bold pb-0 mb-0').text(course.name);
                    $cardBody = $('<div></div>').addClass('card-body p-2').css('height','25%').append($title);
                    $card = $('<div></div>').addClass('card position-relative mb-3 shadow-sm addCourseCard').append($img, $cardBody);
                    $course = $("<div data-subSemId='" + course.subject_semester_id + "'></div>").addClass('course col-lg-4 col-md-6 col-12 h-100').append($card);


                    $('#courseList').append($course);
                });
                div = div + "</ul>";
                $('#courseSelectList').append(div);
            }
            else
                $('#courseList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
            $('#loadingDiv').remove();
            alert("Request Failed with status: "+error.status);
        }
    });

    $(document).on('click', '.course', function () {
        let id = $(this).data('subsemid');
        if (id)
            window.location.href = "courseDetails.html?id=" + id;
    });


    $("#courseSelect").click(function () {
        $("#courseSelectList").show();
    });

    $("#courseSelect").keyup(function () {
        let searchTerm = $("#courseSelect").val().toLowerCase();
        $("#courseSelectList").show();
        if(courses.length > 0){
            let div = "<ul class='list-unstyled'>";
            $('#courseSelectList').empty();
            $.each(courses, function (key, value) {
                if(value.name.toLowerCase().indexOf(searchTerm) != -1)
                    div = div + "<li class='course' data-subSemId='"+value.subSemId+"'>"+value.name+"</li>";
            });
            div = div + "</ul>";
            $("#courseSelectList").append(div);
        }
    });

    $("#courseSelect").blur(function () {
        $("#courseSelectList").fadeOut();
    });
});