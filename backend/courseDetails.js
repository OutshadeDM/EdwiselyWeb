$(document).ready(function(){
    // alert("ok");
    let searchParams = new URLSearchParams(window.location.search);
    let subSemId;
    if(searchParams.has('id')){
        subSemId = searchParams.get('id');

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id='+subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                $('#courseList').empty();
                if(result.status == 200){
                    $.each(result.data , function(key , value){
                        /*  $.each(value.stars , function(k , v ){
                            alert(v)
                        });    */     
                        //  alert(value.name);
                        
                    });
                }
                else
                $('#courseList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
            },
            error: function (error) {
                alert(result.message);
            }
        });

    }
    else 
        window.location.href = "courses.html";
    // alert(subSemId);

});
