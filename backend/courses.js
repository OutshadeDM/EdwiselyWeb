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
                    
                    $img = $('<img>').addClass('card-img-top img-fluid py-2').attr('src', course.course_image || '../images/onlineCourses.png');
                    $title = $('<h5></h5>').addClass('card-title font-weight-bold pb-0 mb-0').text(course.name);
                    $cardBody = $('<div></div>').addClass('card-body p-2').css('height','25%').append($title);
                    $card = $('<div></div>').addClass('card position-relative mb-3 shadow-sm addCourseCard').append($img, $cardBody);
                    // $gotoCard = $("<a href='#'></a>").addClass('courseDeckItem').append($card);
                    $course = $("<div data-subSemId='" + course.subject_semester_id + "'></div>").addClass('course col-lg-4 col-md-6 col-12 h-100').append($card);


                    $('#courseList').append($course);
                    // if (value.course_image){
                    //     $('#courseList').append("<div class='course col-lg-4 col-md-6 col-12 h-100' data-subSemId='" + value.subject_semester_id + "'>"+
                    //         "<div class='card position-relative mb-3 shadow-sm addCourseCard'>"+
                    //         "<img class='card-img-top img-fluid py-2' src='" + value.course_image + "' alt='No Image'>"+
                    //         "<div class='card-body p-2'><h5 class='card-title font-weight-bold pb-0 mb-0'>" + value.name + "</h4></div></div></div>");
                    //     $('#courseList').append($course);
                    // }
                    // else{
                    //     $('#courseList').append("<div class='course col-lg-4 col-md-6 col-12 h-100' data-subSemId='" + value.subject_semester_id + "'>"+
                    //         "<div class='card position-relative mb-3 shadow-sm addCourseCard'>"+
                    //         "<img class='card-img-top img-fluid py-2' src='../images/onlineCourses.png' alt='No Image'>"+
                    //         "<div class='card-body p-2'><h5 class='card-title font-weight-bold pb-0 mb-0'>" + value.name + "</h4></div></div></div>");
                    //     // $('#courseList').append("<div class='col-md-4 course' data-subSemId='" + value.subject_semester_id + "'><div class='card mb-3 shadow-sm course-card'><img class='p-1' src='../images/onlineCourses.png' alt='No Image'><div class='card-body'><h5 class='font-weight-bold'>" + value.name + "</h4></div></div></div>");
                        
                    // }
                });
                div = div + "</ul>";
                $('#courseSelectList').append(div);
            }
            else
                $('#courseList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
        },
        error: function (error) {
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
                // console.log(value);
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