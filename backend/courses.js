$(document).ready(function () {
    //   alert("ok");
    var imgSrc = "../images/onlineCourses.png";
    $.ajax({
        url: 'https://stagingfacultypython.edwisely.com/getFacultyCourses',
        type: 'GET',
        contentType: 'application/json',
        headers: {
            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjI4MDA5NyIsImV4cCI6IjE2MDc1NzYwOTcifQ.53VXe4V8WCJUTogRAxiBmN-PRn8FkGd1il_SkgLh1RE'
        },
        success: function (result) {
            // alert(result.message);
            $('#courseList').empty();
            $.each(result.data, function (key, value) {
                /*  $.each(value.stars , function(k , v ){
                     alert(v)
                 });    */
                //  alert(value.name);
                if (value.course_image)
                    $('#courseList').append("<div class='col-sm-4'><div class='card border-danger mb-3'><div class='card-header'><img class='image-responsive' width='200' src='" + value.course_image + "' alt='No Image'></div><div class='card-body'><h5 class='card-title'>" + value.name + "</h4></div></div></div>");
                else
                    $('#courseList').append("<div class='col-sm-4'><div class='card border-danger mb-3'><div class='card-header'><img class='image-responsive' width='200' src='../images/onlineCourses.png' alt='No Image'></div><div class='card-body'><h5 class='card-title'>" + value.name + "</h4></div></div></div>");
            });

            // CallBack(result);
        },
        error: function (error) {
            alert(result.message);
        }
    });
});