$(document).ready(function () {
    // alert("ok");
    let searchParams = new URLSearchParams(window.location.search);
    let subSemId;
    // let units = [];
    if (searchParams.has('id')) {
        subSemId = searchParams.get('id');
        // alert(subSemId);

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

                    $("#courseName").text(result.data.subject_name);
                    $("#courseDesc").text("No Description Available");
                    $("#courseObjc").text("No Objectives Available");
                    $("#courseOutc").text("No Outcomes Available");

                    if (result.data.description)
                        $("#courseDesc").text(result.data.description);

                    if (result.data.objectives != "" && result.data.objectives) {
                        // alert(result.data.objectives);
                        $("#courseObjc").empty();
                        $("#courseObjc").append("<ul>");
                        $.each(result.data.objectives, function (key, value) {
                            $("#courseObjc").append("<li>" + value + "</li>");
                        });
                        $("#courseObjc").append("</ul>");
                    }

                    if (result.data.outcomes != "" && result.data.outcomes) {
                        $("#courseOutc").empty();
                        $("#courseOutc").append("<ul>");
                        $.each(result.data.outcomes, function (key, value) {
                            $("#courseOutc").append("<li>" + value + "</li>");
                        });
                        $("#courseOutc").append("</ul>");
                    }

                    if (result.data.image != "" && result.data.image)
                        $("#courseImg").attr("src", result.data.image);

                    if (result.data.sections != "" && result.data.sections) {
                        $("#courseClass").empty();
                        $("#courseClass").append("<ul>");
                        $.each(result.data.sections, function (key, value) {
                            // alert(value.name);
                            $("#courseClass").append("<li>" + value.name + "</li>");
                        });
                        $("#courseClass").append("</ul>");
                    }
                    else
                    $("#courseClass").append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
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

    }
    else
        window.location.href = "courses.html";
    // alert(subSemId);

    $("#nav-about-tab").click(function () {
        refreshContents();
        refreshQuestions();
    });

    $("#nav-syllabus-tab").click(function () {
        // alert("The paragraph was clicked.");
        refreshContents();
        refreshQuestions();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.message);
                $('#courseSyllabus').empty();
                if (result.status == 200 && Array.isArray(result.data)) {
                    let div = "";
                    $.each(result.data, function (key, value) {
                        // alert("here");
                        div = div + "<div class='row p-3 mb-2'>";
                        div = div + "<div class='col-sm-8'>";
                        div = div + "<p class='mt-1'><strong>" + value.name + "</strong></p>";
                        div = div + "<div class='my-auto'>";
                        div = div + "<p><span class='span-heading'>Objectives</span><ul class='list-unstyled'>";
                        $.each(value.objectives, function (key, value) {
                            div = div + "<li>" + value + "</li>";
                        });
                        div = div + "</ul></p>";
                        div = div + "<p class='mt-2'><span class='span-heading'>Outcome</span><ul class='list-unstyled'>";
                        $.each(value.outcomes, function (key, value) {
                            div = div + "<li>" + value + "</li>";
                        });
                        div = div + "</ul></p>";
                        div = div + "</div></div>";
                        div = div + "<div class='col-sm-4'>";
                        div = div + "<p><strong>Topics Covered</strong></p>";
                        $.each(value.topics, function (key, value) {
                            div = div + "<span class='badge badge-pill'>" + value.topic_name + "</span><br>";
                        });
                        div = div + "</div></div><hr class='syllabusHr'>";
                        // $('#courseSyllabus').append("</ul>");
                        // $('#courseSyllabus').append("</ul>");
                    });
                    $('#courseSyllabus').append(div);

                }
                else {
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

    $("#nav-content-tab").click(function () {
        // alert("The paragraph was clicked.");
        refreshQuestions();
        // alert(courseBookmarkedFlag);

        let courseUnits = $('#courseUnits').val();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                // $('#courseSyllabus').empty();
                if (result.status == 200 && result.data != null) {
                    if (!courseUnits) {
                        let units = [];
                        $('#courseUnits').empty();
                        $.each(result.data, function (key, value) {
                            // alert(value);
                            units.push({ "id": value.id, "name": value.name });
                            $('#courseUnits').append("<option value=" + value.id + ">" + value.name + "</option>");
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

                    if (!courseBookmarkedFlag && !courseYourContentFlag) {

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getCourseContent?unit_id=' + courseUnits + '&subject_semester_id=' + subSemId,
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
                                if (result.status == 200 && (result.academic_materials || result.learning_content)) {

                                    files = processFiles(result);

                                    // alert(files);

                                    displayFiles(files, courseType, courseLevel);

                                }
                                else {
                                    // alert("here1");
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert(result.message);
                            }
                        });
                    }
                    else if (courseBookmarkedFlag) {

                        // courseBookmarkedFlag = false;

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getFacultyBookmarkedCourseContent?unit_id=' + courseUnits + '&subject_semester_id=' + subSemId,
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
                                if (result.status == 200 && (result.academic_materials || result.learning_content)) {

                                    files = processFiles(result);

                                    // alert(files);

                                    displayFiles(files, courseType, courseLevel);

                                }
                                else {
                                    // alert("here1");
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert(result.message);
                            }
                        });

                    }
                    else if (courseYourContentFlag) {

                        // courseYourContentFlag = false;

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getFacultyAddedCourseContent?unit_id=' + courseUnits + '&subject_semester_id=' + subSemId,
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
                                if (result.status == 200 && result.data) {
                                    $.each(result.data, function (key, value) {
                                        files.push({
                                            "material_id": value.material_id,
                                            "title": value.title,
                                            "url": value.file_url,
                                            "type": value.type,
                                            "level": value.level,
                                            learning_content:"1"
                                        });
                                        // div = div + "</div>";
                                    });

                                    displayFiles(files, courseType, courseLevel);

                                }
                                else {
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
                else {
                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    // alert("here");
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });
    });

    $('#courseType').on('change', function () {
        $("#nav-content-tab").click();
    });

    $('#courseLevel').on('change', function () {
        $("#nav-content-tab").click();
    });

    $('#courseUnits').on('change', function () {
        refreshContents();
        $("#nav-content-tab").click();
    });

    $('#courseCatagory').on('change', function () {
        let courseCatagory = $('#courseCatagory').val();
        if (courseCatagory == "bookmarked") {
            courseBookmarkedFlag = true;
            courseYourContentFlag = false;
            $("#nav-content-tab").click();
        }
        else if (courseCatagory == "yourContent") {
            courseYourContentFlag = true;
            courseBookmarkedFlag = false;
            $("#nav-content-tab").click();
        }
        else{
            courseBookmarkedFlag = false;
            courseYourContentFlag = false;
            $("#nav-content-tab").click();
        }
    });

    let editCourseContentFlag = false;

    $('#courseContentModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let material_id = button.data('id'); // Extract info from data-* attributes
        let type = button.data('type');
        let topic_code = button.data('topic');
        let title = button.data('title');
        let url = button.data('url');
        // $("#courseTypeAdd").val("1");
        // $("#courseTitleAdd").val("");
        // $('input[name="courseTagAdd"]').prop('checked', false);
        // If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
        // Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
        // var modal = $(this)
        // modal.find('.modal-title').text('New message to ' + recipient)
        // modal.find('.modal-body input').val(recipient)
        // alert("here");


        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                $('#courseTags').empty();
                if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                    let i = 1;
                    $.each(result.data, function (key, value) {
                        // alert(value);
                        $.each(value.topics, function (key, value) {
                            $('#courseTags').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='" + value.code + "' name='courseTagAdd' id='courseTagAdd" + value.code + "'/><label for='courseTagAdd" + value.code + "' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.topic_name + "</label></li>");
                            i++;
                        });
                    });
                    // alert(units[0]['id']);
                }
                else {
                    $('#courseTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    alert("here");
                }

                if (material_id) {

                    // alert(material_id+" "+type+" "+topic_code+" "+title);

                    switch (type) {
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
                    $("#courseFileAddATag").show();
                    $("#courseFileAddATag").attr("href",url);
                    $("#contentModalSmall").show();

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

    $('#courseContentModal').on('hidden.bs.modal', function (event) {
        $("#courseTypeAdd").val("1");
        $("#courseFileAdd").val(null);
        $("#courseTitleAdd").val(null);
        $('input[name="courseTagAdd"]').prop('checked', false);
        $("#courseDisplayTypeAdd").val(null);
        $("#courseFileAddATag").attr("href","#");
        $("#courseFileAddATag").hide();
        $("#contentModalSmall").hide();
        clearModal();
        $(".custom-file-label").removeClass("selected").html("Choose file");
    });

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);

        let type = $('#courseTypeAdd').val();
        let success = true;
        switch(type){
            case "1":
                if($.inArray(ext, ['doc','docx']) == -1) {
                   success = false;
                }
                break;
            case "7":
                if($.inArray(ext, ['pdf']) == -1) {
                    success = false;
                }
                break;
            case "4":
                if($.inArray(ext, ['mp4']) == -1) {
                    success = false;
                }
                break;
            case "3":
                if($.inArray(ext, ['ppt','pptx']) == -1) {
                    success = false;
                }
                break;
            case "URL":
                // if($.inArray(ext, ['ppt','pptx']) == -1) {
                //     success = false;
                // }
                break;                
            default:
                if($.inArray(ext, ['doc','docx']) == -1) {
                    success = false;
                }
        }

        if(!success){
            $('#errorToastBody').text('Invalid Attachment Type');
            $('#errorToast').toast('show');
        }

        // var ext = $(this).val().split('.').pop().toLowerCase();
        // if($.inArray(ext, ['gif','png','jpg','jpeg']) == -1) {
        //     alert('invalid extension!');
        // }
    });

    $('#courseTypeAdd').on('change', function () {
        let type = $(this).val();
        switch(type){
            case "1":
                $("#courseFileAdd").attr("accept",".doc,.docx");
                break;
            case "7":
                $("#courseFileAdd").attr("accept",".pdf");
                break;
            case "4":
                $("#courseFileAdd").attr("accept",".mp4");
                break;
            case "3":
                $("#courseFileAdd").attr("accept",".ppt,.pptx");
                break;
            case "URL":
                $("#courseFileAdd").attr("accept","");
                break;
            default:
                $("#courseFileAdd").attr("accept","");
        }
    });

    $(document).on('click', '.show1', function () {
        // alert("ok");
        $(".show1").children("i").hide();
        $(this).children("i").show();
    });

    $(document).on('click', '.download', function () {
        // alert("ok");
        url = $(this).data("url");
        var link = document.createElement('a');
        link.href = url;
        link.target = "_blank";
        link.dispatchEvent(new MouseEvent('click'));
    });

    $('#courseDisplayTypeAdd').on('change', function () {
        let value1 = $(this).is(':checked') ? "public" : 'private';
        $(this).val(value1);
        // alert($(this).val());
    });

    $('#errorToast,#successToast').on('show.bs.toast', function () {
        setInterval(function () {
            $('#errorToast').toast('hide');
            $('#successToast').toast('hide');
        }, 5000);
        $("#errorToast,successToast").toast({
            delay: 53000
        });
    });

    $(document).on('click', '.bookmark', function () {
        // alert("ok");
        let material_id = $(this).data('id');
        let type = $(this).data('type');
        let content = $(this).data('content');

        if (material_id && type && content) {

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
                    if (result.status == 200) {
                        $('#successToastBody').text('Bookmarked SuccessFully');
                        $('#successToast').toast('show');
                        if (content == "nav")
                            $("#nav-content-tab").click();
                        else if (content == "objQuestion")
                            $("#nav-question-tab").click();
                        else if (content == "subQuestion")
                            $("#nav-question-sub-tab").click();
                    }
                    else if (result.status == 500) {
                        $('#errorToastBody').text('Already bookmarked');
                        $('#errorToast').toast('show');
                    }
                    else {
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

    $(document).on('click', '.unbookmark', function () {
        // alert("ok");
        let material_id = $(this).data('id');
        let type = $(this).data('type');
        let content = $(this).data('content');

        if (material_id && type && content) {

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
                    if (result.status == 200) {
                        $('#successToastBody').text('Bookmarked Removed SuccessFully');
                        $('#successToast').toast('show');
                        if (content == "nav")
                            $("#nav-content-tab").click();
                        else if (content == "objQuestion")
                            $("#nav-question-tab").click();
                        else if (content == "subQuestion")
                            $("#nav-question-sub-tab").click();
                    }
                    else if (result.status == 500) {
                        $('#errorToastBody').text('Already Not Bookmarked');
                        $('#errorToast').toast('show');
                    }
                    else {
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

    $(document).on('click', '.deleteContent', function () {
        // alert("ok");
        let material_id = $(this).data('id');
        let topic_id = $(this).data('topic');

        if (material_id && topic_id) {

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
                    if (result.status == 200) {
                        $('#successToastBody').text('Material Content Deleted SuccessFully');
                        $('#successToast').toast('show');
                        $("#nav-content-tab").click();
                    }
                    else {
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

    $("#courseAddSave").click(function () {

        let courseUnits = $('#courseUnits').val();
        let courseTypeAdd = $("#courseTypeAdd").val();
        let courseFileAdd = $("#courseFileAdd")[0].files[0];
        let courseTitleAdd = $("#courseTitleAdd").val();
        let courseTagAdd = $("input[name='courseTagAdd']:checked").val();
        let courseDisplayTypeAdd = $("#courseDisplayTypeAdd").val();
        let courseFileUrlAdd = $("#courseFileAddATag").attr('href');
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

        if (courseUnits && courseTypeAdd && (courseFileAdd || courseFileUrlAdd) && courseTitleAdd && courseTagAdd && courseDisplayTypeAdd) {

            var form = new FormData();
            form.append("unit_id", courseUnits);
            form.append("topic_code", courseTagAdd);
            form.append("material_type", courseTypeAdd);
            form.append("name", courseTitleAdd);
            form.append("display_type", courseDisplayTypeAdd);

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
            $("#fileDiv").css('opacity', '0.5');

            if (editCourseContentFlag) {

                let material_id = $("#courseAddSave").data('id');

                if (material_id) {

                    if(courseFileAdd != null){
                        form.append("attachments", courseFileAdd);
                        form.append("external_url", "");
                    }
                    else{
                        form.append("attachments", "");
                        form.append("external_url", courseFileUrlAdd);
                    }
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
                            $('#modalContent').css('position', 'absolute');
                            $('#courseContentModal').modal('toggle');
                            editCourseContentFlag = false;
                            if (result.status == 200) {
                                $("#courseAddSave").removeData("id");
                                $('#successToastBody').text('Content has been updated successfully');
                                $('#successToast').toast('show');

                                clearModal();
                                $(".custom-file-label").removeClass("selected").html("Choose file");
                                courseFileAdd = null;
                                // courseUnits = null;
                                courseTypeAdd = null;
                                courseTitleAdd = null;
                                courseTagAdd = null;
                                courseDisplayTypeAdd = null;

                                $('#courseContentModal').modal('toggle');
                                $("#nav-content-tab").click();
                            }
                            else {
                                $('#errorToastBody').text('Request Unsuccesful');
                                $('#errorToast').toast('show');

                                clearModal();

                                alert(result.message);
                            }


                        },
                        error: function (error) {
                            clearModal();
                            $(".custom-file-label").removeClass("selected").html("Choose file");
                            courseFileAdd = null;
                            $("#courseFileAdd").val(null);
                            alert(result.message);
                        }
                    });
                }
                else {
                    alert("Server error Occured.Refresh Page.")
                }

                // $( "#loadingDiv" ).remove();
                // $('#modalContent').css('position', 'absolute');
            }
            else {
                
                form.append("attachments", courseFileAdd);
                form.append("external_url", "");

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
                        $('#modalContent').css('position', 'absolute');
                        $('#courseContentModal').modal('toggle');
                        if (result.status == 200 && result.material_id) {
                            $("#courseAddSave").removeData("id");
                            $('#successToastBody').text('Content has been saved successfully');
                            $('#successToast').toast('show');

                            clearModal();
                            $(".custom-file-label").removeClass("selected").html("Choose File");
                            $("#courseFileAdd").val(null);
                            courseFileAdd = null;

                            $('#courseContentModal').modal('toggle');
                            $("#nav-content-tab").click();
                        }
                        else {
                            $('#errorToastBody').text('Request Unsuccesful');
                            $('#errorToast').toast('show');
                            
                            clearModal();

                            alert(result.message);
                        }

                    },
                    error: function (error) {
                        clearModal();
                        $(".custom-file-label").removeClass("selected").html("Choose File");
                        $("#courseFileAdd").val(null);
                        courseFileAdd = null;
                        alert(result.message);
                    }
                });
            }

        }
        else{
            // alert("herer");
            $('#errorToastBody').text('All fields are mandatory for upload.');
            $('#errorToast').toast('show');
        }
    });

    function processFiles(result = []) {

        let files = [];

        $.each(result.academic_materials, function (key, value) {
            files.push({
                "material_id": value.material_id,
                "title": value.title,
                "topic_code": value.topic_code,
                "url": value.file_url,
                "type": value.type,
                "level": value.level,
                "learning_content": "1",
                "bookmarked": value.bookmarked,
                "topic_id": value.topic_id
            });
            // div = div + "</div>";
        });

        $.each(result.learning_content, function (key, value) {
            // alert(value.title);
            files.push({
                "material_id": value.material_id,
                "title": value.title,
                "topic_code": value.topic_code,
                "url": value.file_url,
                "type": value.type,
                "level": value.level,
                "learning_content": "0",
                "bookmarked": value.bookmarked,
                "topic_id": value.topic_id
            });
            // alert(value);
        });
        // alert(files[0].topic_code);

        return files;
    }

    function displayFiles(files = [], courseType, courseLevel) {

        let div = "";

        if (files) {
            $.each(files, function (key, value) {
                if (
                    ((courseType == value.type || (courseType == 'DOCS' && value.type == 'PDF') || (courseType == 'VIDEO' && value.type == 'MP4')) || courseType == "0") 

                && (courseLevel == value.level || courseLevel == "0")) {
                    div = div + "<div class='row my-2'>";
                    div = div + "<div class='col-sm-1 d-flex justify-content-end'>";
                    switch (value.type) {
                        case "DOCS":
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                            break;
                        case "PDF":
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                            break;
                        case "VIDEO":
                            div = div + "<i class='fas fa-file-video fa-2x'></i>";
                            break;
                        case "MP4":
                            div = div + "<i class='fas fa-file-video fa-2x'></i>";
                            break;
                        case "PPT":
                            div = div + "<i class='fas fa-file-powerpoint fa-2x'></i>";
                            break;
                        case "URL":
                            div = div + "<i class='fas fa-file-alt fa-2x'></i>";
                            break;
                        default:
                            div = div + "<i class='fas fa-file-alt fa-2x'></i>";
                    }
                    // div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                    div = div + "</div>";
                    div = div + "<div class='col-sm-9 d-flex justify-content-start align-middle download' style='cursor:pointer;' data-url='" + value.url + "'>";
                    div = div + "<h6>" + value.title + "</h6>";
                    div = div + "</div>";
                    div = div + "<div class='col-sm-2 d-flex justify-content-end'>";
                    if(value.learning_content == "1" || value.bookmarked == "0" || value.bookmarked == "1"){
                        div = div + "<div class='dropdown pr-1'>";
                        div = div + "<button class='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                        div = div + "<i class='fa fa-cog' aria-hidden='true'></i>";
                        div = div + "</button>";
                        div = div + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>";
                        if (value.learning_content == "1")
                            div = div + "<a class='dropdown-item' style='cursor:pointer;' data-toggle='modal' data-target='#courseContentModal' data-id='" + value.material_id + "' data-type='" + value.type + "' data-topic='" + value.topic_code + "' data-title='" + value.title + "' data-url='" + value.url + "'>Edit</a>";

                        let arrayType = value.learning_content == '1' ? 'academic_materials' : 'learning_content';
                        if (value.bookmarked == "0")
                            div = div + "<a class='dropdown-item bookmark' href='#' data-id='" + value.material_id + "' data-type='" + arrayType + "' data-content='nav'>Bookmark</a>";
                        else if(value.bookmarked == "1")
                            div = div + "<a class='dropdown-item unbookmark' href='#' data-id='" + value.material_id + "' data-type='" + arrayType + "' data-content='nav'>UnBookmark</a>";
                        if (value.learning_content == "1")
                            div = div + "<a class='dropdown-item deleteContent' href='#' data-topic='" + value.topic_id + "' data-id='" + value.material_id + "'>Delete</a>";
                        div = div + "</div></div>";    
                    }
                    div = div + "</div></div>";
                }
                // alert(value);
            });
            if (div)
                $('#courseFiles').append(div);
            else
                $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
        }
        else
            $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
    }

    function clearModal(){
        $("#loadingDiv").remove();
        $('#modalContent').css('position', 'absolute');
        $("#fileDiv").css('opacity', '1');
    }

    function refreshContents(){
        $('#courseType').val("0");
        $('#courseLevel').val("0");
        $('#courseCatagory').val("all");
    }

    function refreshQuestions(){
        $('#questionBloomsLevel').val("0");
        $('#questionTopics').val("0");
        $('#questionCatagory').val("0");
    }


    $("#nav-question-tab").click(function () {
        // alert("The paragraph was clicked.");
        refreshContents();

        // let courseUnits = $('#courseUnits').val();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.message);
                if (result.status == 200 && Array.isArray(result.data) && result.data.length) {

                    let units = [];
                    $('#courseQuestionUnits').empty();
                    // $('#questionTopics').empty();
                    // $('#questionTopics').append("<option value='0'>All</option>");
                    $.each(result.data, function (key, value) {
                        // alert(value);
                        units.push({ "id": value.id, "name": value.name });
                        // $.each(value.topics, function (key, value) {
                        //     $('#questionTopics').append("<option value='" + value.code + "'>" + value.topic_name + "</option>");
                        // });
                    });
                    // $('#courseUnits').val(units[0]['id']);
                    // courseUnits = units[0]['id'];
                    // alert(units[0]['id']);

                    $.ajax({
                        url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id=' + subSemId,
                        type: 'GET',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                        },
                        success: function (result) {
                            // alert(result.status);
                            // $('#courseClass').empty();
                            if (result.status == 200) {
                                $.each(units, function (key, value) {
                                    // alert(value);
                                    // units.push({"id":value.id,"name":value.name});
                                    $('#courseQuestionUnits').append("<button type='button' data-uid='" + value.id + "' data-sid='" + result.data.subject_id + "' id='courseUnitBtn' class='btn btn-light btnQuestion'>" + value.name + "</button>");
                                });
                                $("#nav-question-obj-tab").click()

                                // $('#courseQuestionUnits :first-child').click();
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


                }
            },
            error: function (error) {
                alert(result.message);
            }
        });
    });

    $("#nav-question-obj-tab").click(function () {
        $("#questionSwitch").val("0");
        $('#courseQuestionUnits :first-child').click();
    });

    $("#nav-question-sub-tab").click(function () {
        $("#questionSwitch").val("1");
        $('#courseQuestionUnits :first-child').click();;
    });

    $(document).on('click', '#courseUnitBtn', function () {
        // alert("ok");
        let unit_id = $(this).data('uid');
        let subject_id = $(this).data('sid');

        $("#questionSelectedUnitId").val(unit_id);
        $("#questionSelectedSubjectId").val(subject_id);
        let questionSwitch = $("#questionSwitch").val();
        // alert(unit_id);

        $('#questionBloomsLevel').val("0");
        $('#questionTopics').val("0");
        $('#questionCatagory').val("0");
        
        $('#questionTopics').empty();
        $('#questionTopics').append("<option value='0'>All</option>");

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
            },
            success: function (result) {
                // alert(result.status);
                // $('#courseClass').empty();
                if (result.status == 200) {
                    $.each(result.data, function (key, value) {
                        if(value.id == unit_id){
                            // alert(value.id);
                            $.each(value.topics, function (key, value) {
                                $('#questionTopics').append("<option value='" + value.code + "'>" + value.topic_name + "</option>");
                            });
                        }
                    });
                    
                    if (questionSwitch == "0")
                        getObjQuestions(unit_id, subject_id);
                    else
                        getSubQuestions(unit_id, subject_id);

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

        $(".btnQuestionClick").removeClass('btnQuestionClick').addClass('btnQuestion');
        $(this).removeClass('btnQuestion').addClass('btnQuestionClick');

    });

    $('#questionBloomsLevel').on('change', function () {
        // alert("here");
        // $("#courseUnitBtn").click();
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();
        let questionSwitch = $("#questionSwitch").val();

        if (questionSwitch == "0")
            getObjQuestions(unit_id, subject_id);
        else
            getSubQuestions(unit_id, subject_id);
    });

    $('#questionTopics').on('change', function () {
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();
        let questionSwitch = $("#questionSwitch").val();

        if (questionSwitch == "0")
            getObjQuestions(unit_id, subject_id);
        else
            getSubQuestions(unit_id, subject_id);
    });

    $('#questionCatagory').on('change', function () {
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();
        let questionSwitch = $("#questionSwitch").val();

        if (questionSwitch == "0")
            getObjQuestions(unit_id, subject_id);
        else
            getSubQuestions(unit_id, subject_id);
    });


    function getObjQuestions(unit_id, subject_id) {

        let questionBloomsLevel = $('#questionBloomsLevel').val();
        let questionTopics = $('#questionTopics').val();
        let questionCatagory = $('#questionCatagory').val();
        // alert(unit_id);

        if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory != "yourContent") {

            // alert(unit_id);

            $('#objQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);
            form.append("subject_id", subject_id);

            $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "relative",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#objQuestions"));
            // $("#fileDiv").css('opacity','0.5');


            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getUnitObjectiveQuestions?subject_id=' + subject_id + '&unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    // let questions = [];
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        // let div = "";
                        processObjQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, false);
                        // alert(questions);
                        // alert(JSON.stringify(questions));
                        // $('#courseName').text(JSON.stringify(questions[0]));
                        // displayObjQuestions(questions);
                    }
                    else {
                        $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert(result.message);
                }
            });

            // $( "#loadingDiv" ).remove();
            // $('#objQuestions').css('position', 'absolute');
        }
        else if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory == "yourContent") {

            $('#objQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);
            // form.append("subject_id", subject_id);

            // alert(unit_id);

            $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "raltive",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#objQuestions"));
            // $("#fileDiv").css('opacity','0.5');

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getFacultyAddedObjectiveQuestions?unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    // let questions = [];
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        // let div = "";
                        processObjQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, true);
                        // alert(questions);
                        // $("#courseName").text(result.data.subject_name);
                        // $('#courseName').text(questions[0].id);
                        // displayObjQuestions(questions);
                    }
                    else {
                        $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert(result.message);
                }
            });

            // $( "#loadingDiv" ).remove();
            // $('#objQuestions').css('position', 'absolute');
        }
    }

    function getSubQuestions(unit_id, subject_id) {

        let questionBloomsLevel = $('#questionBloomsLevel').val();
        let questionTopics = $('#questionTopics').val();
        let questionCatagory = $('#questionCatagory').val();
        // alert("here");

        if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory != "yourContent") {

            // alert(unit_id);

            $('#subQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);
            form.append("subject_id", subject_id);

            $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "relative",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#subQuestions"));
            // $("#fileDiv").css('opacity','0.5');


            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getUnitSubjectiveQuestions?subject_id=' + subject_id + '&unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    // let questions = [];
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        // let div = "";
                        processSubQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, false);
                        // alert("here");
                        // alert(JSON.stringify(questions));
                        // $('#courseName').text(JSON.stringify(questions[0]));
                        // displaySubQuestions(questions);
                    }
                    else {
                        $('#subQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert(result.message);
                }
            });

            // $( "#loadingDiv" ).remove();
            // $('#objQuestions').css('position', 'absolute');
        }
        else if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory == "yourContent") {

            $('#subQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);
            // form.append("subject_id", subject_id);

            // alert(unit_id);

            $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "raltive",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#subQuestions"));
            // $("#fileDiv").css('opacity','0.5');

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getFacultyAddedSubjectiveQuestions?unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoxMTMwLCJlbWFpbCI6InByYWthc2hAZWR3aXNlbHkuY29tIiwiaW5pIjoiMTYwNjIzMjkxOCIsImV4cCI6IjE2MDc1Mjg5MTgifQ.i1TImgHIZx5cP6L7TAYrEwpBVpbsjmsF1mvqmiEolo4'
                },
                success: function (result) {
                    // alert(result.message);
                    // let questions = [];
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        // let div = "";
                        processSubQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, true);
                        // alert("here");
                        // $("#courseName").text(result.data.subject_name);
                        // $('#courseName').text(questions[0].id);
                        // displaySubQuestions(questions);
                    }
                    else {
                        $('#subQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert(result.message);
                }
            });

            // $( "#loadingDiv" ).remove();
            // $('#objQuestions').css('position', 'absolute');
        }
    }

    function processObjQuestions(result = [], questionBloomsLevel, questionTopics, questionCatagory, yourContent) {
        let questions = [];
        $.each(result.data, function (key, value) {
            // alert(value.name);
            if (!yourContent) {
                if ((questionBloomsLevel == value.blooms_level || questionBloomsLevel == "0") &&
                    (questionTopics == value.type_code || questionTopics == "0") &&
                    ((questionCatagory == "bookmarked" && value.bookmarked == "1") ||
                        questionCatagory == "0")) {

                    let options = [];
                    $.each(value.questions_options, function (key, value) {
                        options.push({
                            "name": value.name,
                            "media": value.media,
                            "img": value.option_img,
                            "is_answer":value.is_answer
                        });
                    });

                    questions.push({
                        "id": value.id,
                        "blooms_level": value.blooms_level,
                        "bookmarked": value.bookmarked,
                        "type": "objective_questions",
                        "question": {
                            "name": value.name,
                            "media": value.media,
                            "question_img": value.question_img
                        },
                        "options": options
                    });
                }
            }
            else {
                if ((questionBloomsLevel == value.blooms_level || questionBloomsLevel == "0") &&
                    (questionTopics == value.type_code || questionTopics == "0") &&
                    ((questionCatagory == "bookmarked" && value.bookmarked == "1") ||
                        questionCatagory == "yourContent")) {

                    let options = [];
                    $.each(value.questions_options, function (key, value) {
                        options.push({
                            "name": value.name,
                            "media": value.media,
                            "img": value.option_img,
                            "is_answer":value.is_answer
                        });
                    });

                    questions.push({
                        "id": value.id,
                        "blooms_level": value.blooms_level,
                        "bookmarked": value.bookmarked,
                        "type": "objective_questions",
                        "question": {
                            "name": value.name,
                            "media": value.media,
                            "question_img": value.question_img
                        },
                        "options": options
                    });
                }
            }
        });
        // alert(questions);
        if (Array.isArray(questions) && questions.length) {
            let div = "";
            // alert(questions[0].question.name);
            let i = 1;
            $.each(questions, function (key, value) {
                div = div + "<div class='objQuestionTab'>";
                div = div + "<div class='row py-2 px-3 p-2'>";
                div = div + "<div class='col-sm-11' style='cursor:pointer;' data-toggle='modal' data-target='#courseObjQuestionModal' data-whatever='" + JSON.stringify(value) + "'>";
                // if (value.question.name.length > 100)
                //     div = div + "<p class='question'>" + value.question.name.substr(0, 100) + " ...</p>";
                // else
                    div = div + "<p class='question'>Q." + i + " "+ value.question.name + "</p>";
                div = div + "<p class='questionLevel' style='opacity: 0.6;'>Level " + value.blooms_level + "</p>";
                div = div + "</div>";
                div = div + "<div class='col-sm-1 text-center d-flex align-items-center justify-content-start'>";
                if (value.bookmarked == 1)
                    div = div + "<a class='unbookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='objQuestion'><i class='fas fa-bookmark'></i></a>";
                else
                    div = div + "<a class='bookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='objQuestion'><i class='far fa-bookmark'></i></a>";
                div = div + "</div></div></div>";
                i++;
            });
            // alert(div); 
            $('#objQuestions').append(div);
        }
        else
            $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");

        $("#loadingDiv").remove();
    }

    function processSubQuestions(result = [], questionBloomsLevel, questionTopics, questionCatagory, yourContent) {

        let questions = [];
        $.each(result.data, function (key, value) {
            // alert(value.name);
            if (!yourContent) {
                if ((questionBloomsLevel == value.blooms_level || questionBloomsLevel == "0") &&
                    (questionTopics == value.type_code || questionTopics == "0") &&
                    ((questionCatagory == "bookmarked" && value.bookmarked == "1") ||
                        questionCatagory == "0")) {

                    questions.push({
                        "id": value.id,
                        "blooms_level": value.blooms_level,
                        "bookmarked": value.bookmarked,
                        "type": "subjective_questions",
                        "evaluation_schema_url": value.evaluation_schema_url,
                        "question_img": value.question_img
                    });
                }
            }
            else {
                if ((questionBloomsLevel == value.blooms_level || questionBloomsLevel == "0") &&
                    (questionTopics == value.type_code || questionTopics == "0") &&
                    ((questionCatagory == "bookmarked" && value.bookmarked == "1") ||
                        questionCatagory == "yourContent")) {

                    questions.push({
                        "id": value.id,
                        "blooms_level": value.blooms_level,
                        "bookmarked": value.bookmarked,
                        "type": "subjective_questions",
                        "evaluation_schema_url": value.evaluation_schema_url,
                        "question_img": value.question_img
                    });
                }
            }
        });
        // alert(questions);
        let div = "";
        // alert(questions[0].question.name);

        if (Array.isArray(questions) && questions.length) {

            $.each(questions, function (key, value) {
                div = div + "<div class='objQuestionTab'>";
                div = div + "<div class='row py-2 px-3 p-2'>";
                div = div + "<div class='col-sm-10'>";
                div = div + "<div class='row'>";
                div = div + "<div class='col-sm-6'>";
                div = div + "<img class='responsive' width='150' src='" + value.question_img + "' alt='No Image' data-toggle='modal' data-target='#courseQuestionImageModal' data-whatever='" + value.question_img + "' style='cursor:pointer;'>";
                div = div + "</div>";
                div = div + "<div class='col-sm-6'>";
                div = div + "<img class='img-responsive' width='150' src='" + value.evaluation_schema_url + "' alt='No Image' data-toggle='modal' data-target='#courseQuestionImageModal' data-whatever='" + value.evaluation_schema_url + "' style='cursor:pointer;'>";
                div = div + "</div></div>";
                div = div + "<p class='questionLevel' style='opacity: 0.6;'>Level " + value.blooms_level + "</p>";
                div = div + "</div>";
                div = div + "<div class='col-sm-2 text-center d-flex align-items-center'>";
                if (value.bookmarked == 1)
                    div = div + "<a class='unbookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='subQuestion'><i class='fas fa-bookmark'></i></a>";
                else
                    div = div + "<a class='bookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='subQuestion'><i class='far fa-bookmark'></i></a>";
                div = div + "</div></div></div>";
            });
            // alert(div); 
            $('#subQuestions').append(div);
        }
        else
            $('#subQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");

        $("#loadingDiv").remove();
    }

    $('#courseObjQuestionModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let question = button.data('whatever'); // Extract info from data-* attributes
        // alert(question.options[0].name);
        $('#questionModalQuestion').html(question.question.name);
        $('#questionModalOptionA').html(question.options[0].name);
        $('#questionModalOptionB').html(question.options[1].name);
        $('#questionModalOptionC').html(question.options[2].name);
        $('#questionModalOptionD').html(question.options[3].name);
        // alert(question.options[2].is_answer);


        if (question.question.media == 1) {
            $("#questionModalQuestionTr").append("<td><a href='#' id='questionModalQuestionImgA'><img src='' width='100' id='questionModalQuestionImg' alt='No Image'></a></td>")
            $("#questionModalQuestionImgA").attr("href", question.question.img);
            $("#questionModalQuestionImgA").attr("target", "_blank");
            $("#questionModalQuestionImg").attr("src", question.question.img);
        }

        if (question.options[0].media == 1) {
            $("#questionModalOptionATr").append("<td><a href='#' id='questionModalOptionAImgA'><img src='' width='100' id='questionModalOptionAImg' alt='No Image'></a></td>")
            $("#questionModalOptionAImgA").attr("href", question.options[0].img);
            $("#questionModalOptionAImgA").attr("target", "_blank");
            $("#questionModalOptionAImg").attr("src", question.options[0].img);
        }
        if (question.options[1].media == 1) {
            $("#questionModalOptionBTr").append("<td><a href='#' id='questionModalOptionBImgA'><img src='' width='100' id='questionModalOptionBImg' alt='No Image'></a></td>")
            $("#questionModalOptionBImgA").attr("href", question.options[1].img);
            $("#questionModalOptionBImgA").attr("target", "_blank");
            $("#questionModalOptionBImg").attr("src", question.options[1].img);
        }
        if (question.options[2].media == 1) {
            $("#questionModalOptionCTr").append("<td><a href='#' id='questionModalOptionCImgA'><img src='' width='100' id='questionModalOptionCImg' alt='No Image'></a></td>")
            $("#questionModalOptionCImgA").attr("href", question.options[2].img);
            $("#questionModalOptionCImgA").attr("target", "_blank");
            $("#questionModalOptionCImg").attr("src", question.options[2].img);
        }
        if (question.options[3].media == 1) {
            $("#questionModalOptionDTr").append("<td><a href='#' id='questionModalOptionCImgA'><img src='' width='100' id='questionModalOptionDImg' alt='No Image'></a></td>")
            $("#questionModalOptionDImgA").attr("href", question.options[3].img);
            $("#questionModalOptionDImgA").attr("target", "_blank");
            $("#questionModalOptionDImg").attr("src", question.options[3].img);
        }

        
        if(question.options[0].is_answer == 1)
            $('#questionModalOptionA').css("color","green");
        else
            $('#questionModalOptionA').css("color","black");
        
        if(question.options[1].is_answer == 1)
            $('#questionModalOptionB').css("color","green");
        else
            $('#questionModalOptionB').css("color","black");

        if(question.options[2].is_answer == 1)
            $('#questionModalOptionC').css("color","darkgreen");    
        else
            $('#questionModalOptionC').css("color","black");

        if(question.options[3].is_answer == 1)
            $('#questionModalOptionD').css("color","darkgreen"); 
        else
            $('#questionModalOptionD').css("color","black");

    });

    $('#courseQuestionImageModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let image = button.data('whatever'); // Extract info from data-* attributes
        // alert(question.options[0].name);

        $("#modalImageA").attr("href", image);
        $("#modalImageA").attr("target", "_blank");
        $("#modalImage").attr("src", image);

    });

});