$(document).ready(function(){
    // alert("ok");
    let searchParams = new URLSearchParams(window.location.search);
    let subSemId;
    let units = [];
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
                    // alert("herre");
                    $('#courseSyllabus').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });

    });

    let courseBookmarkedFlag = false;
    let courseYourContentFlag = false;

    $("#nav-content-tab").click(function(){
        // alert("The paragraph was clicked.");
        
        let courseUnits = $('#courseUnits').val();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id='+subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                // $('#courseSyllabus').empty();
                if(result.status == 200 && result.data != null){
                    if(!courseUnits){
                        let units = [];
                        $('#courseUnits').empty();
                        $.each(result.data , function(key , value){
                            // alert(value);
                            units.push({"id":value.id,"name":value.name});
                            $('#courseUnits').append("<option value="+value.id+">"+value.name+"</option>"); 
                        });
                        $('#courseUnits').val(units[0]['id']);
                        courseUnits = units[0]['id'];
                        // alert(units[0]['id']);
                    }
                    
                    // 2nd api

                    
                    let courseType = $('#courseType').val();
                    let courseLevel = $('#courseLevel').val();
                    // let courseCatagory = $('#courseCatagory').val();
                    // courseUnits = $('#courseUnits').val();

                    // alert(courseUnits);

                    if(!courseBookmarkedFlag && !courseYourContentFlag){

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getCourseContent?unit_id='+courseUnits+'&subject_semester_id='+subSemId,
                            type: 'GET',
                            contentType: 'application/json',
                            headers: {
                                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                            },
                            success: function (result) {
                                // alert(result.status);
                                $('#courseFiles').empty();
                                // let div = "";
                                let files = [];
                                if(result.status == 200 && (result.academic_materials || result.learning_content)){
                                    
                                    files = processFiles(result);

                                    // alert(files);

                                    displayFiles(files,courseType,courseLevel);

                                }
                                else{
                                    // alert("here1");
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert(result.message);
                            }
                        });
                    }
                    else if(courseBookmarkedFlag){

                        courseBookmarkedFlag = false;

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getFacultyBookmarkedCourseContent?unit_id='+courseUnits+'&subject_semester_id='+subSemId,
                            type: 'GET',
                            contentType: 'application/json',
                            headers: {
                                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                            },
                            success: function (result) {
                                // alert(result.learning_content);
                                $('#courseFiles').empty();
                                // let div = "";
                                let files = [];
                                if(result.status == 200 && (result.academic_materials || result.learning_content)){
                                    
                                    files = processFiles(result);

                                    // alert(files);

                                    displayFiles(files,courseType,courseLevel);

                                }
                                else{
                                    // alert("here1");
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert(result.message);
                            }
                        });

                    }
                    else if(courseYourContentFlag){

                        courseYourContentFlag = false;

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getFacultyAddedCourseContent?unit_id='+courseUnits+'&subject_semester_id='+subSemId,
                            type: 'GET',
                            contentType: 'application/json',
                            headers: {
                                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                            },
                            success: function (result) {
                                // alert(result.academic_materials);
                                $('#courseFiles').empty();
                                // let div = "";
                                let files = [];
                                if(result.status == 200 && result.data){
                                    $.each(result.data , function(key , value){
                                        files.push({
                                            "material_id":value.material_id,
                                            "title":value.title,
                                            "url":value.file_url,
                                            "type":value.type,
                                            "level":value.level,
                                            "bookmarked":value.bookmarked
                                        });
                                        // div = div + "</div>";
                                    });

                                    displayFiles(files,courseType,courseLevel);

                                }
                                else{
                                    // alert("here1");
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert(result.message);
                            }
                        });                        

                    }

                }
                else{
                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    alert("here");
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });
    });

    $('#courseType').on('change', function() {
        $("#nav-content-tab").click();
    });

    $('#courseLevel').on('change', function() {
        $("#nav-content-tab").click();
    });

    $('#courseUnits').on('change', function() {
        $("#nav-content-tab").click();
    });

    $('#courseCatagory').on('change', function() {
        let courseCatagory = $('#courseCatagory').val();
        if(courseCatagory == "bookmarked"){
            courseBookmarkedFlag = true;
            $("#nav-content-tab").click();
        }
        else if(courseCatagory == "yourContent"){
            courseYourContentFlag = true;
            $("#nav-content-tab").click();
        }
        else
            $("#nav-content-tab").click();
    });

    function processFiles(result = []){

        let files = [];

        $.each(result.academic_materials , function(key , value){
            files.push({
                "material_id":value.material_id,
                "title":value.title,
                "url":value.file_url,
                "type":value.type,
                "level":value.level,
                "bookmarked":value.bookmarked
            });
            // div = div + "</div>";
        });
        
        $.each(result.learning_content , function(key , value){
            // alert(value.title);
            files.push({
                "material_id":value.material_id,
                "title":value.title,
                "url":value.file_url,
                "type":value.type,
                "level":value.level,
                "bookmarked":value.bookmarked
            });
            // alert(value);
        });

        return files;
    }

    function displayFiles(files = [],courseType,courseLevel){

        let div = "";

        if(files){
            $.each(files , function(key , value){
                if((courseType == value.type || courseType == "0") && (courseLevel == value.level || courseLevel == "0")){
                    div = div + "<div class='row'>";
                    div = div + "<div class='col-sm-1 d-flex justify-content-end'>";
                    switch(value.type){
                        case "DOCS":
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                            break;
                        case "PDF":
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                            break;
                        case "VIDEO":
                            div = div + "<i class='fa fa-video-pdf fa-2x' aria-hidden='true'></i>";
                            break;
                        case "MP4":
                            div = div + "<i class='fa fa-video-pdf fa-2x' aria-hidden='true'></i>";
                            break;
                        case "PPT":
                            div = div + "<i class='fa fa-file-excel fa-2x' aria-hidden='true'></i>";
                            break;
                        case "URL":
                            div = div + "<i class='fa fa-file-zip fa-2x' aria-hidden='true'></i>";
                            break;
                        default:
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                    }
                    // div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                    div = div + "</div>";
                    div = div + "<div class='col-sm-10 d-flex justify-content-start align-middle download' style='cursor:pointer;' data-url='"+value.url+"'>";
                    div = div + "<h6>"+value.title+"</h6>";
                    div = div + "</div>";
                    div = div + "<div class='col-sm-1'>";
                    div = div + "<div class='dropdown'>";
                    div = div + "<button class='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    div = div + "<i class='fa fa-cog' aria-hidden='true'></i>";
                    div = div + "</button>";
                    div = div + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>";
                    div = div + "<a class='dropdown-item' href='#'>Edit</a>";
                    div = div + "<a class='dropdown-item' href='#'>Bookmarked</a>";
                    div = div + "<a class='dropdown-item' href='#'>Delete</a>";
                    div = div + "</div></div></div></div>";
                }
                // alert(value);
            });
            if(div)
                $('#courseFiles').append(div);
            else
            $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
        }
        else
            $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
    }

      

});