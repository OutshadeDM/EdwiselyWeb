$(document).ready(function(){
    // alert("ok");
    let searchParams = new URLSearchParams(window.location.search);
    let subSemId;
    // let units = [];
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

                    if(result.data.objectives != "" && result.data.objectives){
                        // alert(result.data.objectives);
                        $("#courseObjc").empty();
                        $("#courseObjc").append("<ul>");
                        $.each(result.data.objectives , function(key , value){
                            $("#courseObjc").append("<li>" + value + "</li>");
                        });
                        $("#courseObjc").append("</ul>");
                    }

                    if(result.data.outcomes != "" && result.data.outcomes){
                        $("#courseOutc").empty();
                        $("#courseOutc").append("<ul>");
                        $.each(result.data.outcomes , function(key , value){
                            $("#courseOutc").append("<li>" + value + "</li>");
                        });
                        $("#courseOutc").append("</ul>");
                    }

                    if(result.data.image != "" && result.data.image)
                        $("#courseImg").attr("src",result.data.image);

                    if(result.data.sections != "" && result.data.sections){
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
                if(result.status == 200 && result.data != ""){
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
                    // alert("here");
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

    let editCourseContentFlag = false;

    $('#courseContentModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let material_id = button.data('id'); // Extract info from data-* attributes
        let type = button.data('type');
        let topic_code = button.data('topic');
        let title = button.data('title');
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        // var modal = $(this)
        // modal.find('.modal-title').text('New message to ' + recipient)
        // modal.find('.modal-body input').val(recipient)
        // alert("here");


        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id='+subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                $('#courseTags').empty();
                if(result.status == 200 && result.data){
                    let i = 1;
                    $.each(result.data , function(key , value){
                        // alert(value);
                        $.each(value.topics , function(key , value){
                            $('#courseTags').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='"+value.code+"' name='courseTagAdd' id='courseTagAdd"+value.code+"'/><label for='courseTagAdd"+value.code+"' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> "+value.topic_name+"</label></li>");
                            i++;
                        });
                    });
                    // alert(units[0]['id']);
                }
                else{
                    $('#courseTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    alert("here");
                }

                if(material_id){

                    // alert(material_id+" "+type+" "+topic_code+" "+title);
        
                    switch(type){
                        case "DOCS":
                            $("#courseTypeAdd").val("1");
                            break;
                        case "PDF":
                            $("#courseTypeAdd").val("7");
                            break;
                        case "VIDEO":
                            $("#courseTypeAdd").val("4");
                            break;
                        case "PPT":
                            $("#courseTypeAdd").val("3");
                            break;
                        case "URL":
                            $("#courseTypeAdd").val("URL");
                            break;
                        default:
                            $("#courseTypeAdd").val("1");
                    }
                    
                    $("#courseTitleAdd").val(title);
                    // $("input[name='courseTagAdd']").val(topic_code);
                    $("input[name='courseTagAdd'][value='" + topic_code + "']").prop("checked", true);
                    $("input[name='courseTagAdd']:checked").siblings(".show1").click();
                    // alert($("input[name='courseTagAdd']:checked").val());
                    // alert(topic_code);

                    $('#courseAddSave').data('id', material_id);
                    // alert($("#courseAddSave").data('id'));

                    editCourseContentFlag = true;
        
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });

    });

    $(".custom-file-input").on("change", function() {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

    $(document).on('click', '.show1', function(){
        // alert("ok");
        $(".show1").children("i").hide();
        $(this).children("i").show();
    });
    
    $('#courseDisplayTypeAdd').on('change', function() {
        let value1 = $(this).is(':checked') ? "public" : 'private';
        $(this).val(value1);
        // alert($(this).val());
    });

    $('#errorToast,#successToast').on('show.bs.toast', function () {
        setInterval(function() {    
            $('#errorToast').toast('hide');
            $('#successToast').toast('hide');
        }, 5000);
        $("#errorToast,successToast").toast({
            delay:53000
        });
    });

    $(document).on('click', '.bookmark', function(){
        // alert("ok");
        let material_id = $(this).data('id');
        let type = $(this).data('type');
        let content = $(this).data('content');

        if(material_id && type && content){

            var form = new FormData();
            form.append("id", material_id);
            form.append("type", type);


            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/addBookmark',
                type: 'POST',
                dataType: 'json',
                data: form,
                contentType: false,
                processData: false, 
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    if(result.status == 200){
                        $('#successToastBody').text('Bookmarked SuccessFully');
                        $('#successToast').toast('show');
                        if(content == "nav")
                            $("#nav-content-tab").click();
                        else if(content == "question")
                            $("#nav-question-tab").click();
                    }
                    else if(result.status == 500){
                        $('#errorToastBody').text('Already bookmarked');
                        $('#errorToast').toast('show');
                    }
                    else{
                        $('#errorToastBody').text('Request Unsuccessful');
                        $('#errorToast').toast('show');
                        alert(result.message);
                    }
                },
                error: function (error) {
                    alert(result.message);
                }
            });
        }

    });

    $(document).on('click', '.unbookmark', function(){
        // alert("ok");
        let material_id = $(this).data('id');
        let type = $(this).data('type');
        let content = $(this).data('content');

        if(material_id && type && content){

            var form = new FormData();
            form.append("id", material_id);
            form.append("type", type);

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/deleteBookmark',
                type: 'POST',
                dataType: 'json',
                data: form,
                contentType: false,
                processData: false, 
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    if(result.status == 200){
                        $('#successToastBody').text('Bookmarked Removed SuccessFully');
                        $('#successToast').toast('show');
                        if(content == "nav")
                            $("#nav-content-tab").click();
                        else if(content == "question")
                            $("#nav-question-tab").click();
                    }
                    else if(result.status == 500){
                        $('#errorToastBody').text('Already Not Bookmarked');
                        $('#errorToast').toast('show');
                    }
                    else{
                        $('#errorToastBody').text('Request Unsuccessful');
                        $('#errorToast').toast('show');
                        alert(result.message);
                    }
                },
                error: function (error) {
                    alert(result.message);
                }
            });
        }

    });
    
    $(document).on('click', '.deleteContent', function(){
        // alert("ok");
        let material_id = $(this).data('id');
        let topic_id = $(this).data('topic');

        if(material_id && topic_id){

            var form = new FormData();
            form.append("material_id", material_id);
            form.append("topic_id", topic_id);

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/units/deleteMaterial',
                type: 'POST',
                dataType: 'json',
                data: form,
                contentType: false,
                processData: false, 
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    if(result.status == 200){
                        $('#successToastBody').text('Material Content Deleted SuccessFully');
                        $('#successToast').toast('show');
                        $("#nav-content-tab").click();
                    }
                    else{
                        $('#errorToastBody').text('Request Unsuccessful');
                        $('#errorToast').toast('show');
                        alert(result.message);
                    }
                },
                error: function (error) {
                    alert(result.message);
                }
            });
        }

    });

    $("#courseAddSave").click(function(){

        let courseUnits = $('#courseUnits').val();
        let courseTypeAdd = $("#courseTypeAdd").val();
        let courseFileAdd = $("#courseFileAdd")[0].files[0];
        let courseTitleAdd = $("#courseTitleAdd").val();
        let courseTagAdd = $("input[name='courseTagAdd']:checked").val();
        let courseDisplayTypeAdd = $("#courseDisplayTypeAdd").val();
        // $('#successToast').toast('show');
        // $('#errorToast').toast('show');
        // alert(courseUnits);

        
        // $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
        //     position: "absolute",
        //     width: "100%",
        //     height: "100%",
        //     background: "#fff",
        //     opacity: 0.7
        // }).appendTo($("#modalContent").css("position", "relative"));
        // $("#fileDiv").css('opacity','0.5');
        // setInterval(function(){
        //     $( "#loadingDiv" ).remove();
        //     $('#modalContent').css('position', 'absolute');
        // },50000);

        if(courseUnits && courseTypeAdd && courseFileAdd && courseTitleAdd && courseTagAdd && courseDisplayTypeAdd){

            var form = new FormData();
            form.append("unit_id", courseUnits);
            form.append("topic_code", courseTagAdd);
            form.append("material_type", courseTypeAdd);
            form.append("name", courseTitleAdd);
            form.append("attachments", courseFileAdd);
            form.append("display_type", courseDisplayTypeAdd);
            form.append("external_url", "");

            // for(var key of form.entries()){
            //     alert(key[1]);
            // }
            
            $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#modalContent").css("position", "relative"));
            $("#fileDiv").css('opacity','0.5');

            if(editCourseContentFlag){

                let material_id = $("#courseAddSave").data('id');

                if(material_id){

                    form.append("material_id", material_id);
                    // alert(material_id);

                    $.ajax({
                        url: 'https://stagingfacultypython.edwisely.com/updateFacultyAcademicMaterials',
                        type: 'POST',
                        dataType: 'json',
                        data: form,
                        contentType: false,
                        processData: false, 
                        headers: {
                            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                        },
                        success: function (result) {
                            // alert(result.message);
                            editCourseContentFlag = false;
                            if(result.status == 200){
                                $("#courseAddSave").removeData("id");
                                $('#successToastBody').text('Content has been updated successfully');
                                $('#successToast').toast('show');
                                $('#courseContentModal').modal('toggle');
                                $("#nav-content-tab").click();
                            }
                            else{
                                $('#errorToastBody').text('Request Unsuccesful');
                                $('#errorToast').toast('show');
                                alert(result.message);
                            }

                            $( "#loadingDiv" ).remove();
                            $('#modalContent').css('position', 'absolute');
                        },
                        error: function (error) {
                            alert(result.message);
                        }
                    });
                }
                else{
                    alert("Server error Occured.Refresh Page.")
                }

            }
            else{
            
                $.ajax({
                    url: 'https://stagingfacultypython.edwisely.com/addFacultyContent',
                    type: 'POST',
                    dataType: 'json',
                    data: form,
                    contentType: false,
                    processData: false, 
                    headers: {
                        'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                    },
                    success: function (result) {
                        // alert(result.message);
                        if(result.status == 200 && result.material_id){
                            $('#successToastBody').text('Content has been saved successfully');
                            $('#successToast').toast('show');
                            $('#courseContentModal').modal('toggle');
                            $("#nav-content-tab").click();
                        }
                        else{
                            $('#errorToastBody').text('Request Unsuccesful');
                            $('#errorToast').toast('show');
                            alert(result.message);
                        }

                        $( "#loadingDiv" ).remove();
                        $('#modalContent').css('position', 'absolute');
                    },
                    error: function (error) {
                        alert(result.message);
                    }
                });
            }

        }
        else
            $('#errorToast').toast('show');
    });

    function processFiles(result = []){

        let files = [];

        $.each(result.academic_materials , function(key , value){
            files.push({
                "material_id":value.material_id,
                "title":value.title,
                "topic_code":value.topic_code,
                "url":value.file_url,
                "type":value.type,
                "level":value.level,
                "learning_content":"1",
                "bookmarked":value.bookmarked,
                "topic_id":value.topic_id
            });
            // div = div + "</div>";
        });
        
        $.each(result.learning_content , function(key , value){
            // alert(value.title);
            files.push({
                "material_id":value.material_id,
                "title":value.title,
                "topic_code":value.topic_code,
                "url":value.file_url,
                "type":value.type,
                "level":value.level,
                "learning_content":"0",
                "bookmarked":value.bookmarked,
                "topic_id":value.topic_id
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
                    if(value.learning_content == "1")
                        div = div + "<a class='dropdown-item' style='cursor:pointer;' data-toggle='modal' data-target='#courseContentModal' data-id='"+value.material_id+"' data-type='"+value.type+"' data-topic='"+value.topic_code+"' data-title='"+value.title+"'>Edit</a>";

                    let arrayType = value.learning_content == '1' ? 'academic_materials':'learning_content';
                    if(value.bookmarked == "0")
                        div = div + "<a class='dropdown-item bookmark' href='#' data-id='"+value.material_id+"' data-type='" + arrayType + "' data-content='nav'>Bookmark</a>";
                    else
                        div = div + "<a class='dropdown-item unbookmark' href='#' data-id='"+value.material_id+"' data-type='" + arrayType + "' data-content='nav'>UnBookmark</a>";
                    if(value.learning_content == "1")
                        div = div + "<a class='dropdown-item deleteContent' href='#' data-topic='"+value.topic_id+"' data-id='"+value.material_id+"'>Delete</a>";
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


    $("#nav-question-tab").click(function(){
        // alert("The paragraph was clicked.");
        
        // let courseUnits = $('#courseUnits').val();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id='+subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.message);
                if(result.status == 200 && result.data != null){

                    let units = [];
                    $('#courseQuestionUnits').empty();
                    $('#questionTopics').empty();
                    $('#questionTopics').append("<option value='0'>All</option>");
                    $.each(result.data , function(key , value){
                        // alert(value);
                        units.push({"id":value.id,"name":value.name});
                        $.each(value.topics , function(key , value){
                            $('#questionTopics').append("<option value='"+value.code+"'>"+value.topic_name+"</option>");
                        });
                    });
                    // $('#courseUnits').val(units[0]['id']);
                    // courseUnits = units[0]['id'];
                    // alert(units[0]['id']);

                    $.ajax({
                        url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id='+subSemId,
                        type: 'GET',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                        },
                        success: function (result) {
                            // alert(result.status);
                            // $('#courseClass').empty();
                            if(result.status == 200){ 
                                $.each(units , function(key , value){
                                    // alert(value);
                                    // units.push({"id":value.id,"name":value.name});
                                    $('#courseQuestionUnits').append("<button type='button' data-uid='"+value.id+"' data-sid='"+result.data.subject_id+"' id='courseUnitBtn' class='btn btn-light btnQuestion'>"+value.name+"</button>");
                                });
                                
                                $('#courseQuestionUnits :first-child').click();
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
            },
            error: function (error) {
                alert(result.message);
            }
        });
    });

    $(document).on('click', '#courseUnitBtn', function(){
        // alert("ok");
        let unit_id = $(this).data('uid');
        let subject_id = $(this).data('sid');

        $("#questionSelectedUnitId").val(unit_id);
        $("#questionSelectedSubjectId").val(subject_id);
        // alert(unit_id);

        // let questionBloomsLevel = $('#questionBloomsLevel').val();
        // let questionTopics = $('#questionTopics').val();
        // let questionCatagory = $('#questionCatagory').val();
        
        $(".btnQuestionClick").removeClass('btnQuestionClick').addClass('btnQuestion');
        $(this).removeClass('btnQuestion').addClass('btnQuestionClick');

        getQuestions(unit_id,subject_id);

    });

    $('#questionBloomsLevel').on('change', function() {
        // alert("here");
        // $("#courseUnitBtn").click();
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();

        getQuestions(unit_id,subject_id);
    });

    $('#questionTopics').on('change', function() {
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();

        getQuestions(unit_id,subject_id);
    });

    $('#questionCatagory').on('change', function() {
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();

        getQuestions(unit_id,subject_id);
    });

    function getQuestions(unit_id,subject_id){

        let questionBloomsLevel = $('#questionBloomsLevel').val();
        let questionTopics = $('#questionTopics').val();
        let questionCatagory = $('#questionCatagory').val();
        // alert(unit_id);

        if(unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory != "yourContent"){

            // alert(unit_id);

            $('#objQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);
            form.append("subject_id", subject_id);

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getUnitObjectiveQuestions?subject_id='+subject_id+'&unit_id='+unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    let questions = [];
                    if(result.status == 200 && result.data != null){
                        // let div = "";
                        $.each(result.data , function(key , value){
                            // alert(value.name);
                            if((questionBloomsLevel == value.blooms_level || questionBloomsLevel == "0") &&
                                (questionTopics == value.type_code || questionTopics == "0") &&
                                ((questionCatagory == "bookmarked" && value.bookmarked == "1") ||
                                questionCatagory == "0")){

                                    let question = [];
                                    question.push({
                                        "name":value.name,
                                        "media":value.media,
                                        "question_img":value.question_img
                                    });
                                    
                                    let options=[];
                                    $.each(value.questions_options , function(key , value){
                                        options.push({
                                            "name":value.name,
                                            "media":value.media,
                                            "img":value.option_img
                                        });
                                    });
    
                                    questions.push({
                                        "id":value.id,
                                        "blooms_level":value.blooms_level,
                                        "bookmarked":value.bookmarked,
                                        "type":"objective_questions",
                                        "question":{
                                            "name":value.name,
                                            "media":value.media,
                                            "question_img":value.question_img
                                        },
                                        "options": options
                                    });
                            }
                        });
                        // alert(div);
                        // alert(JSON.stringify(questions));
                        // $('#courseName').text(JSON.stringify(questions[0]));
                        displayQuestions(questions);
                    }
                    else
                        $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    
                },
                error: function (error) {
                    alert(result.message);
                }
            });
        }
        else if(unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory == "yourContent"){

            $('#objQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);
            // form.append("subject_id", subject_id);

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getFacultyAddedObjectiveQuestions?unit_id='+unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    let questions = [];
                    if(result.status == 200 && result.data != null){
                        // let div = "";
                        $.each(result.data , function(key , value){
                            // alert(value.name);
                            if((questionBloomsLevel == value.blooms_level || questionBloomsLevel == "0") &&
                                (questionTopics == value.type_code || questionTopics == "0") &&
                                ((questionCatagory == "bookmarked" && value.bookmarked == "1") || 
                                questionCatagory == "yourContent")){

                                    let question = [];
                                    question.push({
                                        "name":value.name,
                                        "media":value.media,
                                        "question_img":value.question_img
                                    });
                                    
                                    let options=[];
                                    $.each(value.questions_options , function(key , value){
                                        options.push({
                                            "name":value.name,
                                            "media":value.media,
                                            "img":value.option_img
                                        });
                                    });
    
                                    questions.push({
                                        "id":value.id,
                                        "blooms_level":value.blooms_level,
                                        "bookmarked":value.bookmarked,
                                        "type":"objective_questions",
                                        "question":{
                                            "name":value.name,
                                            "media":value.media,
                                            "question_img":value.question_img
                                        },
                                        "options": options
                                    });
                            }
                        });
                        // alert(questions[0].id);
                        // $("#courseName").text(result.data.subject_name);
                        // $('#courseName').text(questions[0].id);
                        displayQuestions(questions);
                    }
                    else
                        $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    
                },
                error: function (error) {
                    alert(result.message);
                }
            });
        }
    }

    function displayQuestions(questions = []){
        
        let div = "";
        // alert("here");
        // alert(questions[0].question.name);

        $.each(questions , function(key , value){
            div = div + "<div class='objQuestionTab'>";
            div = div + "<div class='row py-2 px-3 p-2'>";
            div = div + "<div class='col-sm-10' style='cursor:pointer;' data-toggle='modal' data-target='#courseQuestionModal' data-whatever='"+JSON.stringify(value)+"'>";
            if(value.question.name.length > 100)
                div = div + "<p class='question'>"+value.question.name.substr(0,100)+" ...</p>";
            else
            div = div + "<p class='question'>"+value.question.name+"</p>";
            div = div + "<p class='questionLevel' style='opacity: 0.6;'>Level "+value.blooms_level+"</p>";
            div = div + "</div>";
            div = div + "<div class='col-sm-2 text-center d-flex align-items-center'>";
            if(value.bookmarked == 1)
                div = div + "<a class='unbookmark' href='#' data-id='"+value.id+"' data-type='"+value.type+"' data-content='question'><i class='fas fa-bookmark'></i></a>";
            else
            div = div + "<a class='bookmark' href='#' data-id='"+value.id+"' data-type='"+value.type+"' data-content='question'><i class='far fa-bookmark'></i></a>";
            div = div + "</div></div></div>";
        });
        // alert(div);
        
        $('#objQuestions').append(div);
    }

    $('#courseQuestionModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let question = button.data('whatever'); // Extract info from data-* attributes
        // alert(question.options[0].name);
        $('#questionModalQuestion').text(question.question.name);
        $('#questionModalOptionA').text(question.options[0].name);
        $('#questionModalOptionB').text(question.options[1].name);
        $('#questionModalOptionC').text(question.options[2].name);
        $('#questionModalOptionD').text(question.options[3].name);


        if(question.question.media == 1){
            $("#questionModalQuestionImgA").attr("href", question.question.img);
            $("#questionModalQuestionImg").attr("src",question.question.img);
        }

        if(question.options[0].media == 1){
            $("#questionModalOptionAImgA").attr("href", question.options[0].img);
            $("#questionModalOptionAImg").attr("src",question.options[0].img);
        }
        if(question.options[0].media == 1){
            $("#questionModalOptionBImgA").attr("href", question.options[1].img);
            $("#questionModalOptionBImg").attr("src",question.options[1].img);
        }
        if(question.options[0].media == 1){
            $("#questionModalOptionCImgA").attr("href", question.options[2].img);
            $("#questionModalOptionCImg").attr("src",question.options[2].img);
        }
        if(question.options[0].media == 1){
            $("#questionModalOptionDImgA").attr("href", question.options[3].img);
            $("#questionModalOptionDImg").attr("src",question.options[3].img);
        }

    });

});