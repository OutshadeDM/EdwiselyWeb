$(document).ready(function () {
    $user = "";
    if (isLoggedIn()) {
    //   console.log(isLoggedIn(), 'yes');
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }

    let searchParams = new URLSearchParams(window.location.search);
    let subSemId = "";
    let uId = "";
    if (searchParams.has('id')) {
        subSemId = searchParams.get('id');
    }
    if (searchParams.has('uid')) {
        uId = searchParams.get('uid');
    }
    
    let courseBookmarkedFlag = false;
    let courseYourContentFlag = false;
           
    navAbout();

    $("#nav-about-tab").click(function () {

        navAbout();

    });

    function navAbout(){
        refreshContents();
        refreshQuestions();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                $('#courseClass').empty();
                if (result.status == 200) {

                    $("#courseName").text(result.data.subject_name);
                    $("#courseDesc").text("No Description Available");
                    $("#courseObjc").text("No Objectives Available");
                    $("#courseOutc").text("No Outcomes Available");

                    if (result.data.description)
                        $("#courseDesc").text(result.data.description);

                    if (result.data.objectives != "" && result.data.objectives) {
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
                            $("#courseClass").append("<li><span>"+value.department_name+"</span>&emsp;" + value.name + "&emsp;<button class='btn deleteSection' data-id='"+value.faculty_section_id+"' type='button'><i class='fas fa-trash'></i></button></li>");
                        });
                        $("#courseClass").append("</ul>");
                    }
                    else
                        $("#courseClass").append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                }
                else {
                    $('#errorToastBody').text('Request Unsuccessful');
                    $('#errorToast').toast('show');
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });
    }

    $(document).on('click', '.deleteSection', function () {
        let sectionId = $(this).data('id');

        if(sectionId){

            let form = new FormData();
            form.append('data',sectionId);

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/common/facultyUnassingSubjectSection',
                type: 'POST',
                dataType: 'json',
                data: form,
                contentType: false,
                processData: false,
                headers: {
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200) {
                        $('#successToastBody').text('Section Unassigned to Subject');
                        $('#successToast').toast('show');
                        navAbout();
                    }
                    else {
                        $('#errorToastBody').text('Request Unsuccessful');
                        $('#errorToast').toast('show');
                    }
                },
                error: function (error) {
                    alert("Request Failed with status: "+error.status);
                }
            });
        }
    });

    

    $("#nav-syllabus-tab").click(function () {
        refreshContents();
        refreshQuestions();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                $('#courseSyllabus').empty();
                if (result.status == 200 && Array.isArray(result.data)) {
                    let div = "";
                    $.each(result.data, function (key, value) {
                        div = div + "<div class='row p-3 mb-2'>";
                        div = div + "<div class='col-sm-8'>";
                        div = div + "<p class='mt-1'><strong>" + value.name + "</strong></p>";
                        div = div + "<div>";
                        div = div + "<p class='mb-0'><span class='span-heading'>Objectives</span><ul class='list-unstyled'>";
                        $.each(value.objectives, function (key, value) {
                            div = div + "<li>" + value + "</li>";
                        });
                        div = div + "</ul></p>";
                        div = div + "<p class='mt-2 mb-0'><span class='span-heading'>Outcome</span><ul class='list-unstyled'>";
                        $.each(value.outcomes, function (key, value) {
                            div = div + "<li>" + value + "</li>";
                        });
                        div = div + "</ul></p>";
                        div = div + "</div></div>";
                        div = div + "<div class='col-sm-4'>";
                        div = div + "<p><strong>Topics Covered</strong></p>";
                        if(value.topics.length > 0){
                            $.each(value.topics, function (key, value) {
                                div = div + "<span class='badge badge-pill'>" + value.topic_name + "</span><br>";
                            });
                        }
                        else{
                            div = div + "<span>No Topics Added Yet</span>";
                        }
                        div = div + "</div></div><hr class='syllabusHr'>";
                    });
                    $('#courseSyllabus').append(div);

                }
                else {
                    $('#courseSyllabus').append("<div class='row'><div class='col-sm-12 align-items-center'><h5 class='text-center m-0'>No data to fetch</h5></div</div>");
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });

    });


    $("#nav-content-tab").click(function () {
        refreshQuestions();

        let courseUnits = $('#courseUnits').val();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                if (result.status == 200 && result.data != null) {

                    $('#contentMainDiv').show();
                    $('#contentMainErrorDiv').hide();  

                    if (!courseUnits) {
                        let units = [];
                        $('#courseUnits').empty();
                        $.each(result.data, function (key, value) {
                            units.push({ "id": value.id, "name": value.name });
                            $('#courseUnits').append("<option value=" + value.id + ">" + value.name + "</option>");
                        });
                        $('#courseUnits').val(units[0]['id']);
                        courseUnits = units[0]['id'];
                    }

                    // 2nd api
                    getCourseDecks(courseUnits);


                    let courseType = $('#courseType').val();
                    let courseLevel = $('#courseLevel').val();

                    if (!courseBookmarkedFlag && !courseYourContentFlag) {

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getCourseContent?unit_id=' + courseUnits + '&subject_semester_id=' + subSemId,
                            type: 'GET',
                            contentType: 'application/json',
                            headers: {
                                'Authorization': `Bearer ${$user.token}`
                            },
                            success: function (result) {
                                $('#courseFiles').empty();
                                let files = [];
                                if (result.status == 200 && (result.academic_materials || result.learning_content)) {

                                    files = processFiles(result);

                                    displayFiles(files, courseType, courseLevel);

                                }
                                else {
                                    $('#courseFiles').empty();
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert("Request Failed with status: "+error.status);
                            }
                        });
                    }
                    else if (courseBookmarkedFlag) {

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getFacultyBookmarkedCourseContent?unit_id=' + courseUnits + '&subject_semester_id=' + subSemId,
                            type: 'GET',
                            contentType: 'application/json',
                            headers: {
                                'Authorization': `Bearer ${$user.token}`
                            },
                            success: function (result) {
                                $('#courseFiles').empty();
                                let files = [];
                                if (result.status == 200 && (result.academic_materials || result.learning_content)) {

                                    files = processFiles(result);

                                    displayFiles(files, courseType, courseLevel);

                                }
                                else {
                                    $('#courseFiles').empty();
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert("Request Failed with status: "+error.status);
                            }
                        });

                    }
                    else if (courseYourContentFlag) {

                        $.ajax({
                            url: 'https://stagingfacultypython.edwisely.com/getFacultyAddedCourseContent?unit_id=' + courseUnits + '&subject_semester_id=' + subSemId,
                            type: 'GET',
                            contentType: 'application/json',
                            headers: {
                                'Authorization': `Bearer ${$user.token}`
                            },
                            success: function (result) {
                                $('#courseFiles').empty();
                                let files = [];
                                if (result.status == 200 && result.data) {
                                    $.each(result.data, function (key, value) {
										let learning_content = 
                                        files.push({
                                            "material_id": value.material_id,
                                            "title": value.title,
                                            "topic_code": value.topic_code,
                                            "url": value.file_url,
                                            "type": value.type,
                                            "level": value.level,
                                            "learning_content":value.faculty_content,
                                            "display_type":value.display_type,
                                            "bookmarked": value.bookmarked,
                                            "topic_id": value.topic_id
                                        });
                                    });

                                    displayFiles(files, courseType, courseLevel);

                                }
                                else {
                                    $('#courseFiles').empty();
                                    $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                                }
                            },
                            error: function (error) {
                                alert("Request Failed with status: "+error.status);
                            }
                        });

                    }

                }
                else {
                    $('#contentMainDiv').hide();
                    $('#contentMainErrorDiv').show();  
                    $('#contentMainErrorDiv').empty();                    
                    $('#contentMainErrorDiv').append("<div class='row coursetab mt-2'><div class='col-sm-12'><h5 class='text-center m-0'>No data to fetch</h5></div</div>");
                }
            },
            error: function (error) {
                alert(result.message);
            }
        });
    });

    function getCourseDecks(unitId){
        $('#courseDeckList').empty();
        $('#courseDeckList').removeClass('slick-initialized slick-slider');
        $('#courseDeckTitle').hide();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseDecks?unit_id='+unitId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                if (result.status == 200 && result.data) {
                    $('#courseDeckTitle').show();

                    $.each(result.data, (index, course) => {
                        $img = $('<img>').addClass('card-img-top img-fluid py-2').attr('src', course.image || '../images/onlineCourses.png');
                        $title = $('<h5></h5>').addClass('card-title font-weight-bold pb-0 mb-0').text(course.name);
                        $cardBody = $('<div></div>').addClass('card-body p-2').append($title);
                        $card = $('<div></div>').addClass('card position-relative mb-3 shadow-sm addCourseCard').append($img, $cardBody);
                        $gotoCard = $("<a href='#'></a>").addClass('courseDeckItem').append($card);
                        $course = $("<div data-toggle='modal' data-target='#deckModal' data-id='" + course.id + "'></div>").addClass('course col-lg-4 col-md-6 col-12 h-100').append($gotoCard);
                        $('#courseDeckList').append($course);
            
                        if (index == result.data.length - 1) {
                            $('#courseDeckList').slick({
                              infinite: false,
                              speed: 300,
                              adaptiveHeight: true,
                              lazyLoad: 'ondemand',
                              slidesToShow: 4,
                              slidesToScroll: 4,
                              arrows: true,	
                              responsive: [
                                {
                                  breakpoint: 1024,
                                  settings: {
                                    slidesToShow: 3,
                                    slidesToScroll: 3
                                  }
                                },
                                {
                                  breakpoint: 600,
                                  settings: {
                                    slidesToShow: 2,
                                    slidesToScroll: 2
                                  }
                                },
                                {
                                  breakpoint: 480,
                                  settings: {
                                    slidesToShow: 1,
                                    slidesToScroll: 1
                                  }
                                }
                              ]
                            });				
                        }
                    });
                }
                else {
                    $('#courseDeckTitle').hide();
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });        
    }

    const getDeckData = (url) => {
		return new Promise((resolve, reject) => {
			try {
			    $.ajax({
			        url: url,
			        type: 'GET',
			        success: function (result) {
						resolve(result);				
			        },
			        error: function (error) {
			            console.log(error);
			            reject(error);
			        }
			    });
			} catch (error) {
				console.log(error);
			}
		});
	}  

    $('#deckModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        const deck_id = button.data('id'); // Extract info from data-* attributes
        $('#deckModalDiv').removeClass('slick-initialized slick-slider');
        $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#fff",
            opacity: 0.7
        }).appendTo($("#deckModalLoadingDiv"));

        $('#deckModalDiv').hide();
        $('#deckModalLoadingDiv').show();

        if(deck_id){
            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/deckItems?deck_id='+deck_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${$user.token}`
                },
                success: async function (result) {
                    if (result.status == 200 && result.data) {
                        $decks = "";
                        let i = 1;
                        for(let index = 0; index < result.data.length; index++){
                            const deck = result.data[index];
                            if(deck.type == "cs" || deck.type == "pqp"){
                                try {
                                    const data = await getDeckData(deck.url);
                                    $optionalP = "";
                                    if(deck.type == "pqp")
                                        $optionalP = $("<p></p>").addClass('text-center').append("Previous Year Question</p>");
                                    $index = $("<p>"+i+"/10</p>").addClass('text-center font-weight-bold');
                                    $mainDiv = $("<div></div>").append(data);
                                    $deckDiv = $("<div></div>").addClass('p-2').append($index).append($optionalP).append($mainDiv);
                                    $('#deckModalDiv').append($deckDiv);
                                    if (index == result.data.length - 1) {
                                        $('#deckModalLoadingDiv').hide();
                                        $('#loadingDiv').remove();
                                        $('#deckModalDiv').show();
                                        $('#deckModalDiv').slick({
                                            adaptiveHeight: true
                                        });				
                                    }
                                    i++;                                     
                                } catch (error) {
                                    console.log(error);
                                    // alert('Something Went Wrong!');
                                }                      
                            }
                        }
                        MathJax.typesetPromise();
                    }
                    else
                        $('#deckModalDiv').append("<h5 class='text-center'>No data to fetch</h5>");
                },
                error: function (error) {
                    alert("Request Failed with status: "+error.status);
                }
            });
        }

    });

    $('#deckModal').on('hide.bs.modal', function () {
        $('#deckModalDiv').empty();
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
                "display_type":value.display_type,
                "bookmarked": value.bookmarked,
                "topic_id": value.topic_id
            });
        });

        $.each(result.learning_content, function (key, value) {
            files.push({
                "material_id": value.material_id,
                "title": value.title,
                "topic_code": value.topic_code,
                "url": value.file_url,
                "type": value.type,
                "level": value.level,
                "learning_content": "0",
                "display_type":"0",
                "bookmarked": value.bookmarked,
                "topic_id": value.topic_id
            });
        });

        return files;
    }

    function displayFiles(files = [], courseType, courseLevel) {

        let div = "";

        if (files) {
            $.each(files, function (key, value) {
                if (
                    ((courseType == value.type || (courseType == 'DOCS' && value.type == 'PDF') || (courseType == 'VIDEO' && value.type == 'MP4')) || courseType == "0") 

                && (courseLevel == value.level || courseLevel == "0")) {
                    let fileType = "";
                    div = div + "<div class='row my-2'>";
                    div = div + "<div class='col-sm-1 d-flex justify-content-end'>";
                    switch (value.type) {
                        case "DOCS":
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                            fileType = "doc";
                            break;
                        case "PDF":
                            div = div + "<i class='fa fa-file-pdf fa-2x' aria-hidden='true'></i>";
                            fileType = "pdf";
                            break;
                        case "VIDEO":
                            div = div + "<i class='fas fa-file-video fa-2x'></i>";
                            fileType = "video";
                            break;
                        case "MP4":
                            div = div + "<i class='fas fa-file-video fa-2x'></i>";
                            fileType = "mp4";
                            break;
                        case "PPT":
                            div = div + "<i class='fas fa-file-powerpoint fa-2x'></i>";
                            fileType = "ppt";
                            break;
                        case "URL":
                            div = div + "<i class='fas fa-file-alt fa-2x'></i>";
                            fileType = "url";
                            break;
                        default:
                            div = div + "<i class='fas fa-file-alt fa-2x'></i>";
                            fileType = "url";
                    }
                    div = div + "</div>";
                    div = div + "<div class='col-sm-9 d-flex justify-content-start align-middle download' style='cursor:pointer;' data-type='"+fileType+"' data-url='" + value.url + "'>";
                    div = div + "<h6>" + value.title + "</h6>";
                    div = div + "</div>";
                    div = div + "<div class='col-sm-2 d-flex justify-content-end'>";
                    if(value.learning_content == "1" || value.bookmarked == "0" || value.bookmarked == "1"){
                        div = div + "<div class='dropdown pr-1'>";
                        div = div + "<button class='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                        div = div + "<i class='fa fa-cog' aria-hidden='true'></i>";
                        div = div + "</button>";
                        div = div + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>";
                        if (value.learning_content == "1" && value.display_type == "private")
                            div = div + "<a class='dropdown-item' style='cursor:pointer;' data-toggle='modal' data-target='#courseContentModal' data-id='" + value.material_id + "' data-fileType='"+fileType+"' data-type='" + value.type + "' data-topic='" + value.topic_code + "' data-title='" + value.title + "' data-url='" + value.url + "'>Edit</a>";

                        let arrayType = value.learning_content == '1' ? 'academic_materials' : 'learning_content';
                        if (value.bookmarked == "0")
                            div = div + "<a class='dropdown-item bookmark' href='#' data-id='" + value.material_id + "' data-type='" + arrayType + "' data-content='nav'>Bookmark</a>";
                        else if(value.bookmarked == "1")
                            div = div + "<a class='dropdown-item unbookmark' href='#' data-id='" + value.material_id + "' data-type='" + arrayType + "' data-content='nav'>UnBookmark</a>";
                        if (value.learning_content == "1" && value.display_type == "private")
                            div = div + "<a class='dropdown-item deleteContent' href='#' data-topic='" + value.topic_id + "' data-id='" + value.material_id + "'>Delete</a>";
                        div = div + "</div></div>";    
                    }
                    div = div + "</div></div>";
                }
            });
            if (div)
                $('#courseFiles').append(div);
            else
                $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
        }
        else
            $('#courseFiles').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
    }

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
        else {
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
        let fileType = button.data('filetype');
        
        let courseUnits = $('#courseUnits').val();

        $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
            position: "relative",
            width: "100%",
            height: "100%",
            background: "#fff",
            opacity: 0.7
        }).appendTo($("#courseTags"));


        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                $("#loadingDiv").remove();
                $('#courseTags').empty();
                if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                    let i = 1;
                    let div = "";
                    $.each(result.data, function (key, value) {
                        if(courseUnits == value.id){
                            $.each(value.topics, function (key, value) {

                                div = div + "<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='" + value.code + "' name='courseTagAdd' id='courseTagAdd" + value.code + "'/><label for='courseTagAdd" + value.code + "' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> " + value.topic_name + "</label></li>";
                                i++;
                            });
                        }
                    });
                    if(div)
                        $('#courseTags').append(div);
                    else
                        $('#courseTags').append('<p>No Topics Found</p>')
                }
                else {
                    $('#courseTags').append("<div class='row'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                    alert("here");
                }

                if (material_id) {

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
                    // alert(topic_code);
                    $("input[name='courseTagAdd'][value='" + topic_code + "']").prop("checked", true);
                    $("input[name='courseTagAdd']:checked").siblings(".show1").click();
                    // alert($("input[name='courseTagAdd']:checked").val());
                    // alert(topic_code);
                    $("#courseFileAddATag").show();
                    $('#courseFileAddATag').attr('href', "viewFile.html?url="+url+"&type="+fileType);
                    $("#contentModalSmall").show();

                    $('#courseAddSave').data('id', material_id);
                    // alert($("#courseAddSave").data('id'));

                    editCourseContentFlag = true;

                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
                $("#loadingDiv").remove();
            }
        });

    });

    $('#courseContentModal').on('hidden.bs.modal', function (event) {
        $("#courseTypeAdd").val("1");
        $("#courseFileAdd").val(null);
        $("#courseTitleAdd").val(null);
        $('input[name="courseTagAdd"]').prop('checked', false);
        let value1 = $("#courseDisplayTypeAdd").is(':checked') ? "public" : 'private';
        $("#courseDisplayTypeAdd").val(value1);
        $("#courseFileAddATag").attr("href","#");
        $("#courseFileAddATag").hide();
        $("#contentModalSmall").hide();
        clearModal();
        $(".custom-file-label").removeClass("selected").html("Choose file");
    });

    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
        
        var ext = $(this).val().split('.').pop().toLowerCase();

        let type = $('#courseTypeAdd').val();
        let success = true;
        switch (type) {
            case "1":
                if ($.inArray(ext, ['doc', 'docx']) == -1) {
                    success = false;
                }
                break;
            case "7":
                if ($.inArray(ext, ['pdf']) == -1) {
                    success = false;
                }
                break;
            case "4":
                if ($.inArray(ext, ['mp4']) == -1) {
                    success = false;
                }
                break;
            case "3":
                if ($.inArray(ext, ['ppt', 'pptx']) == -1) {
                    success = false;
                }
                break;
            case "URL":
                // if($.inArray(ext, ['ppt','pptx']) == -1) {
                //     success = false;
                // }
                break;
            default:
                if ($.inArray(ext, ['doc', 'docx']) == -1) {
                    success = false;
                }
                break;
        }

        if (!success) {
            $(this).siblings(".custom-file-label").addClass("selected").html("Choose File");
            $(this).val("");
            $('#errorToastBody').text('Invalid Attachment Type');
            $('#errorToast').toast('show');
        }

    });

    $('#courseTypeAdd').on('change', function () {
        let type = $(this).val();
        switch (type) {
            case "1":
                $("#courseFileAdd").attr("accept", ".doc,.docx");
                break;
            case "7":
                $("#courseFileAdd").attr("accept", ".pdf");
                break;
            case "4":
                $("#courseFileAdd").attr("accept", ".mp4");
                break;
            case "3":
                $("#courseFileAdd").attr("accept", ".ppt,.pptx");
                break;
            case "URL":
                $("#courseFileAdd").attr("accept", "");
                break;
            default:
                $("#courseFileAdd").attr("accept", "");
        }
    });

    $(document).on('click', '.show1', function () {
        $(".show1").children("i").hide();
        $(this).children("i").show();
    });

    $(document).on('click', '.download', function () {
        let url = $(this).data("url");
        let type = $(this).data("type");
        $('#overlayModal').modal('toggle');
        if(type == "doc" || type == "pdf" || type == "ppt")
            $('#overlayModaliFrame').attr('src',"https://drive.google.com/viewerng/viewer?embedded=true&url="+url.split('?')[0]);
        else if(type == "mp4" || type == "video"){
            if(url.includes("youtube"))
                $('#overlayModaliFrame').attr('src',"https://www.youtube.com/embed/"+linkifyYouTubeURLs(url)+"?autoplay=1&mute=1");
        }
        else
            $('#overlayModaliFrame').attr('src',url);
    });

    function linkifyYouTubeURLs(text) {
        var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        return text.replace(re,'$1');
    }

    $('#overlayModal').on('hidden.bs.modal', function (event) {
        $('#overlayModaliFrame').attr('src',"");
    });

    $('#courseDisplayTypeAdd').on('change', function () {
        let value1 = $(this).is(':checked') ? "public" : 'private';
        $(this).val(value1);
    });

    $('#errorToast,#successToast').on('show.bs.toast', function () {
        $('#toastDiv').show();
        setTimeout(function () {
            $('#errorToast').toast('hide');
            $('#successToast').toast('hide');
            $('#toastDiv').hide();
        }, 7000);
    });

    $(document).on('click', '.bookmark', function () {
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
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200) {
                        $('#successToastBody').text('Bookmarked SuccessFully');
                        $('#successToast').toast('show');
                        if (content == "nav")
                            $("#nav-content-tab").click();
                        else if (content == "objQuestion")
                            $("#nav-question-obj-tab").click();
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
                    alert("Request Failed with status: "+error.status);
                }
            });
        }

    });

    $(document).on('click', '.unbookmark', function () {
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
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200) {
                        $('#successToastBody').text('Bookmarked Removed SuccessFully');
                        $('#successToast').toast('show');
                        if (content == "nav")
                            $("#nav-content-tab").click();
                        else if (content == "objQuestion")
                            $("#nav-question-obj-tab").click();
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
                    alert("Request Failed with status: "+error.status);
                }
            });
        }

    });

    $(document).on('click', '.deleteContent', function () {
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
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
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
                    alert("Request Failed with status: "+error.status);
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
        let material_id = $(this).data('id');

        if (courseUnits && courseTypeAdd && (courseFileAdd || courseFileUrlAdd) && courseTitleAdd && courseTagAdd && courseDisplayTypeAdd) {

            var form = new FormData();
            form.append("unit_id", courseUnits);
            form.append("topic_code", courseTagAdd);
            form.append("material_type", courseTypeAdd);
            form.append("name", courseTitleAdd);
            form.append("display_type", courseDisplayTypeAdd);

            $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#modalContent").css("position", "relative"));
            $("#fileDiv").css('opacity', '0.5');

            if (editCourseContentFlag) {

                if (material_id) {

                    if (courseFileAdd != null) {
                        form.append("attachments", courseFileAdd);
                        form.append("external_url", "");
                    }
                    else {
                        form.append("attachments", "");
                        form.append("external_url", courseFileUrlAdd);
                    }
                    form.append("material_id", material_id);

                    $.ajax({
                        url: 'https://stagingfacultypython.edwisely.com/updateFacultyAcademicMaterials',
                        type: 'POST',
                        dataType: 'json',
                        data: form,
                        contentType: false,
                        processData: false,
                        headers: {
                            'Authorization': `Bearer ${$user.token}`
                        },
                        success: function (result) {
                            $('#modalContent').css('position', 'absolute');
                            editCourseContentFlag = false;
                            if (result.status == 200) {
                                $('#successToastBody').text('Content has been updated successfully');
                                $('#successToast').toast('show');

                                clearModal();
                                $(".custom-file-label").removeClass("selected").html("Choose file");
                                courseFileAdd = null;
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
                            alert("Request Failed with status: "+error.status);
                        }
                    });
                }
                else {
                    alert("Server error Occured.Refresh Page.")
                }
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
                        'Authorization': `Bearer ${$user.token}`
                    },
                    success: function (result) {
                        $('#courseContentModal').modal('toggle');
                        if (result.status == 200 && result.material_id) {
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
                        alert("Request Failed with status: "+error.status);
                    }
                });
            }

            if(courseDisplayTypeAdd == 'public'){

                let form1 = new FormData();
                form1.append('material_id',material_id);

                $.ajax({
                    url: 'https://stagingfacultypython.edwisely.com/updateFacultyContentDisplayType',
                    type: 'POST',
                    dataType: 'json',
                    data: form1,
                    contentType: false,
                    processData: false,
                    headers: {
                        'Authorization': `Bearer ${$user.token}`
                    },
                    success: function (result) {
                        alert(result.message);
                        if (result.status == 200) {
                            $("#courseAddSave").removeData("id");
                        }
                        else {
                            $('#errorToastBody').text(result.message);
                            $('#errorToast').toast('show');
                        }
                    },
                    error: function (error) {
                        clearModal();
                        alert("Request Failed with status: "+error.status);
                    }
                });
            }



        }
        else {
            $('#errorToastBody').text('All fields are mandatory for upload.');
            $('#errorToast').toast('show');
        }
    });

    function clearModal(){
        $("#loadingDiv").remove();
        $('#modalContent').css('position', 'absolute');
        $("#fileDiv").css('opacity', '1');
    }

    function refreshContents() {
        $('#courseType').val("0");
        $('#courseLevel').val("0");
        $('#courseCatagory').val("all");
        courseBookmarkedFlag = false;
        courseYourContentFlag = false;
    }

    function refreshQuestions() {
        $('#questionBloomsLevel').val("0");
        $('#questionTopics').val("0");
        $('#questionCatagory').val("0");
    }
    
    if(uId){
        setTimeout(function () {
            $("#nav-question-tab").click();
          }, 250);
    }

    $("#nav-question-tab").click(function () {
        refreshContents();
        $('#questionBankMainDiv').show();
        $('#questionBankErrorDiv').hide();
        $("#questionSelectedUnitId").val("0");
        $("#questionSelectedSubjectId").val("0");

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                if (result.status == 200 && Array.isArray(result.data) && result.data.length) {

                    let units = [];
                    $('#courseQuestionUnits').empty();
                    $.each(result.data, function (key, value) {
                        units.push({ "id": value.id, "name": value.name });
                    });

                    $.ajax({
                        url: 'https://stagingfacultypython.edwisely.com/getCourseDetails?subject_semester_id=' + subSemId,
                        type: 'GET',
                        contentType: 'application/json',
                        headers: {
                            'Authorization': `Bearer ${$user.token}`
                        },
                        success: function (result) {
                            if (result.status == 200) {
                                $.each(units, function (key, value) {
                                    // $('#courseQuestionUnits').append("<button type='button' data-uid='" + value.id + "' data-sid='" + result.data.subject_id + "' id='courseUnitBtn' value='"+value.id+"' class='btn btnQuestion'>" + value.name + "</button>");
                                    $('#courseQuestionUnits').append("<li class='getUnitsLi'><input type='radio' class='getUnitsInput' value='" + value.id + "' data-sid='" + result.data.subject_id + "' data-uid='" + value.id + "' name='getUnitsAdd' id='getUnitsAdd" + value.id + "' /><label for='getUnitsAdd" + value.id + "' id='getUnitsLabel"+value.id+"' class='getUnitsLabel'>" + value.name + "</label></li>");
                                });
                                $("#nav-question-obj-tab").click();
                            }
                            else {
                                alert(result.message);
                                $('#courseQuestionUnits').hide();
                            }
                        },
                        error: function (error) {
                            alert("Request Failed with status: "+error.status);
                        }
                    });


                }
                else{
                    $('#courseQuestionUnits').hide();
                        $('#questionBankMainDiv').hide();
                        $('#questionBankErrorDiv').show();
                        $('#questionBankErrorDiv').empty();
                        $('#questionBankErrorDiv').append("<div class='mt-2 row coursetab'><div class='col-sm-12'><h5 class='text-center m-0'>No data to fetch</h5></div</div>");
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });
    });

    $("#nav-question-obj-tab").click(function () {
        $("#questionSwitch").val("0");
        
        let unit_id = $("#questionSelectedUnitId").val();
        let subject_id = $("#questionSelectedSubjectId").val();
        
        if(unit_id != "0"){
            getObjQuestions(unit_id,subject_id);
        }
        else{
            if(uId){
                $('button[data-uid="'+uId+'"]').click();
            }
            else
                $('#courseQuestionUnits :first-child :first-child').click();
        }
    });

    $("#nav-question-sub-tab").click(function () {
        $("#questionSwitch").val("1");
        $('#courseQuestionUnits :first-child :first-child').click();
    });

    $(document).on('click', '.getUnitsInput', function () {
        // alert($(".getUnitsInput:checked").val())
        let unit_id = $(this).data('uid');
        let subject_id = $(this).data('sid');
        // $('.getUnitsLabel').css('font-size','18px');
        // $('.getUnitsLabel').css('border-image','linear-gradient(to right, #1B658C 25%, rgba(0,0,0,0) 25%)');
        // $('#getUnitsLabel'+unit_id).css('font-size', '25px')
        // $('#getUnitsLabel'+unit_id).css('border-image', 'linear-gradient(to right, #1B658C 50%, rgba(0,0,0,0) 50%)')
        // alert('.getUnitsLabel'+unit_id);
        $('.getUnitsLabel').removeClass('selected');
        $('#getUnitsLabel'+unit_id).addClass('selected');

        $("#addQuestion").attr('href','addQues.html?id='+subject_id+'&tid=0&tname=Add%20New%20Questions&uid='+unit_id+'&sid='+subSemId);
        
        $("#questionSelectedUnitId").val(unit_id);
        $("#questionSelectedSubjectId").val(subject_id);
        let questionSwitch = $("#questionSwitch").val();

        $('#questionBloomsLevel').val("0");
        $('#questionTopics').val("0");
        $('#questionCatagory').val("0");

        $('#questionTopics').empty();
        $('#questionTopics').append("<option value='0' selected>All</option>");

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseSyllabus?subject_semester_id=' + subSemId,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                if (result.status == 200) {
                    $.each(result.data, function (key, value) {
                        if (value.id == unit_id) {
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
                    alert(result.message);
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });

        $(".btnQuestionClick").removeClass('btnQuestionClick').addClass('btnQuestion bg-light');
        $(this).removeClass('btnQuestion bg-light').addClass('btnQuestionClick');

    });

    $('#questionBloomsLevel').on('change', function () {
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

        if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory != "yourContent") {


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

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getUnitObjectiveQuestions?subject_id=' + subject_id + '&unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {

                        processObjQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, false);
                        
                    }
                    else {
                        $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert("Request Failed with status: "+error.status);
                }
            });

        }
        else if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory == "yourContent") {

            $('#objQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);

            $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "raltive",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#objQuestions"));

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getFacultyAddedObjectiveQuestions?unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        
                        processObjQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, true);
                        
                    }
                    else {
                        $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert("Request Failed with status: "+error.status);
                }
            });

        }
    }

    function getSubQuestions(unit_id, subject_id) {

        let questionBloomsLevel = $('#questionBloomsLevel').val();
        let questionTopics = $('#questionTopics').val();
        let questionCatagory = $('#questionCatagory').val();
        // alert("here");

        if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory != "yourContent") {


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

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getUnitSubjectiveQuestions?subject_id=' + subject_id + '&unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        
                        processSubQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, false);
                        
                    }
                    else {
                        $('#subQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert("Request Failed with status: "+error.status);
                }
            });

        }
        else if (unit_id && subject_id && questionBloomsLevel && questionTopics && questionCatagory && questionCatagory == "yourContent") {

            $('#subQuestions').empty();

            var form = new FormData();
            form.append("unit_id", unit_id);

            $("<div id='loadingDiv' class='mt-3 d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "raltive",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#subQuestions"));

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/questions/getFacultyAddedSubjectiveQuestions?unit_id=' + unit_id,
                type: 'GET',
                contentType: 'application/json',
                headers: {
                    'Authorization': `Bearer ${$user.token}`
                },
                success: function (result) {
                    if (result.status == 200 && Array.isArray(result.data) && result.data.length) {
                        
                        processSubQuestions(result, questionBloomsLevel, questionTopics, questionCatagory, true);
                        
                    }
                    else {
                        $('#subQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");
                        $("#loadingDiv").remove();
                    }

                },
                error: function (error) {
                    alert("Request Failed with status: "+error.status);
                }
            });

        }
    }

    let yourQuestions = [];
    let questions = [];

    function processObjQuestions(result = [], questionBloomsLevel, questionTopics, questionCatagory, yourContent) {
        questions = [];
        $.each(result.data, function (key, value) {
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
                            "is_answer": value.is_answer
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
                yourQuestions = [];
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
                            "is_answer": value.is_answer
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
                        "options": options,
                        'value':value
                    });
                }
            }
        });
        if (Array.isArray(questions) && questions.length) {
            let div = "";
            let i = 0;
            let j = 1;
            $.each(questions, function (key, value) {
                div = div + "<div class='objQuestionTab'>";
                div = div + "<div class='row py-2 mx-0'>";
                div = div + "<div class='col-sm-11 px-2' style='cursor:pointer;' data-toggle='modal' data-id='" + value.id + "' data-target='#courseObjQuestionModal'>";
                div = div + "<p class='question'>Q." + j + " " + value.question.name + "</p>";
                div = div + "<p class='questionLevel' style='opacity: 0.6;'>Level " + value.blooms_level + "</p>";
                div = div + "</div>";
                div = div + "<div class='col-sm-1 px-0 text-end d-flex align-items-center justify-content-center'>";
                if(yourContent){
                    yourQuestions.push(value);
                    div = div + "<div class='dropdown pr-1'>";
                    div = div + "<button class='btn dropdown-toggle' type='button' id='dropdownMenuButton' data-toggle='dropdown' aria-haspopup='true' aria-expanded='false'>";
                    div = div + "<i class='fa fa-cog' aria-hidden='true'></i>";
                    div = div + "</button>";
                    div = div + "<div class='dropdown-menu' aria-labelledby='dropdownMenuButton'>";
                    div = div + "<a class='dropdown-item editYourQuestion' style='cursor:pointer;' data-index='"+i+"' data-qid='"+value.id+"'>Edit</a>";
                    if (value.bookmarked == "1")
                        div = div + "<a class='dropdown-item unbookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='objQuestion'>Unbookmark</a>";
                    else
                        div = div + "<a class='dropdown-item bookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='objQuestion'>Bookmark</a>";
                    div = div + "</div></div>";
                }
                else{
                    if (value.bookmarked == 1)
                        div = div + "<a class='unbookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='objQuestion'><i class='fas fa-bookmark'></i></a>";
                    else
                        div = div + "<a class='bookmark' href='#' data-id='" + value.id + "' data-type='" + value.type + "' data-content='objQuestion'><i class='far fa-bookmark'></i></a>";
                }
                div = div + "</div></div></div>";
                i++;
                j++;
            });
            $('#objQuestions').append(div);
        }
        else
            $('#objQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");

        $("#loadingDiv").remove();
        MathJax.typesetPromise();
    }

    function processSubQuestions(result = [], questionBloomsLevel, questionTopics, questionCatagory, yourContent) {

        questions = [];
        $.each(result.data, function (key, value) {
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
        let div = "";

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
            $('#subQuestions').append(div);
        }
        else
            $('#subQuestions').append("<div class='row py-2 px-3 p-2'><div class='col-sm-12'><h5 class='text-center'>No data to fetch</h5></div</div>");

        $("#loadingDiv").remove();
    }

    $('#courseObjQuestionModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let questionId = button.data('id'); // Extract info from data-* attributes
        let question = [];
        $.each(questions, function (key, value) {
            if (questionId == value.id) {
                question = value;
                $('#questionModalQuestion').html(question.question.name);
                $('#questionModalOptionA').html(question.options[0].name);
                $('#questionModalOptionB').html(question.options[1].name);
                if(question.options[2])
                    $('#questionModalOptionC').html(question.options[2].name);
                if(question.options[3])
                    $('#questionModalOptionD').html(question.options[3].name);

                if (question.question.media == 1) {
                    $("#questionModalQuestionTd").show();
                    $("#questionModalQuestionImgA").attr("href", "viewFile.html?url="+question.question.question_img+"&type=img");
                    $("#questionModalQuestionImgA").attr("target", "_blank");
                    $("#questionModalQuestionImg").attr("src", question.question.question_img);
                }

                if (question.options[0].media == 1) {
                    $("#questionModalOptionATd").show();
                    $("#questionModalOptionAImgA").attr("href", "viewFile.html?url="+question.options[0].img+"&type=img");
                    $("#questionModalOptionAImgA").attr("target", "_blank");
                    $("#questionModalOptionAImg").attr("src", question.options[0].img);
                }
                if (question.options[1].media == 1) {
                    $("#questionModalOptionBTd").show();
                    $("#questionModalOptionBImgA").attr("href", "viewFile.html?url="+question.options[1].img+"&type=img");
                    $("#questionModalOptionBImgA").attr("target", "_blank");
                    $("#questionModalOptionBImg").attr("src", question.options[1].img);
                }
                if (question.options[2] && question.options[2].media == 1) {
                    $("#questionModalOptionCTd").show();
                    $("#questionModalOptionCImgA").attr("href", "viewFile.html?url="+question.options[2].img+"&type=img");
                    $("#questionModalOptionCImgA").attr("target", "_blank");
                    $("#questionModalOptionCImg").attr("src", question.options[2].img);
                }
                if (question.options[3] && question.options[3].media == 1) {
                    $("#questionModalOptionDTd").show();
                    $("#questionModalOptionDImgA").attr("href", "viewFile.html?url="+question.options[3].img+"&type=img");
                    $("#questionModalOptionDImgA").attr("target", "_blank");
                    $("#questionModalOptionDImg").attr("src", question.options[3].img);
                }
                if (question.options[4] && question.options[4].media == 1) {
                    $("#questionModalOptionETd").show();
                    $("#questionModalOptionEImgA").attr("href", "viewFile.html?url="+question.options[4].img+"&type=img");
                    $("#questionModalOptionEImgA").attr("target", "_blank");
                    $("#questionModalOptionEImg").attr("src", question.options[4].img);
                }


                if (question.options[0].is_answer == 1)
                    $('#questionModalOptionA').css("color", "darkgreen");
                else
                    $('#questionModalOptionA').css("color", "black");

                if (question.options[1].is_answer == 1)
                    $('#questionModalOptionB').css("color", "darkgreen");
                else
                    $('#questionModalOptionB').css("color", "black");

                if (question.options[2] && question.options[2].is_answer == 1)
                    $('#questionModalOptionC').css("color", "darkgreen");
                else
                    $('#questionModalOptionC').css("color", "black");

                if (question.options[3]  && question.options[3].is_answer == 1)
                    $('#questionModalOptionD').css("color", "darkgreen");
                else
                    $('#questionModalOptionD').css("color", "black");

                if (question.options[4]  && question.options[4].is_answer == 1)
                    $('#questionModalOptionE').css("color", "darkgreen");
                else
                    $('#questionModalOptionE').css("color", "black");

            return false;
          }
        });
        MathJax.typesetPromise();

    });

    $('#courseObjQuestionModal').on('hide.bs.modal', function () {
        $('#questionModalQuestion').html("");
        $('#questionModalOptionA').html("");
        $('#questionModalOptionB').html("");
        $('#questionModalOptionC').html("");
        $('#questionModalOptionD').html("");
        $('#questionModalOptionE').html("");

        $('#questionModalQuestionTd').hide();
        $('#questionModalOptionATd').hide();
        $('#questionModalOptionBTd').hide();
        $('#questionModalOptionCTd').hide();
        $('#questionModalOptionDTd').hide();
        $('#questionModalOptionETd').hide();

        $("#questionModalQuestionImgA").attr("href", "#");
        $("#questionModalQuestionImgA").attr("target", "");
        $("#questionModalQuestionImg").attr("src", "");

        $("#questionModalOptionAImgA").attr("href", "#");
        $("#questionModalOptionAImgA").attr("target", "");
        $("#questionModalOptionAImg").attr("src", "");

        $("#questionModalOptionBImgA").attr("href", "#");
        $("#questionModalOptionBImgA").attr("target", "");
        $("#questionModalOptionBImg").attr("src", "");

        $("#questionModalOptionCImgA").attr("href", "#");
        $("#questionModalOptionCImgA").attr("target", "");
        $("#questionModalOptionCImg").attr("src", "");

        $("#questionModalOptionDImgA").attr("href", "#");
        $("#questionModalOptionDImgA").attr("target", "");
        $("#questionModalOptionDImg").attr("src", "");

        $("#questionModalOptionEImgA").attr("href", "#");
        $("#questionModalOptionEImgA").attr("target", "");
        $("#questionModalOptionEImg").attr("src", "");
        
        $('#questionModalOptionA').css("color", "black");
        $('#questionModalOptionB').css("color", "black");
        $('#questionModalOptionC').css("color", "black");
        $('#questionModalOptionD').css("color", "black");
        $('#questionModalOptionE').css("color", "black");

    });

    $('#courseQuestionImageModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let image = button.data('whatever'); // Extract info from data-* attributes

        $("#modalImageA").attr("href", image);
        $("#modalImageA").attr("target", "_blank");
        $("#modalImage").attr("src", image);

    });

    $(document).on('click', '.editYourQuestion', function () {
        let index = $(this).data('index');
        let qId = $(this).data('qid');
        let url = $('#addQuestion').attr('href');

        let newQuestion = yourQuestions[index].value;
        if(newQuestion.id == qId){
            redirectUsingCookie(url,newQuestion);
        }

    });
    

    function redirectUsingCookie(url, data) {
        if($.cookie('editQues'))
            $.cookie('editQues', "");

        $.cookie('editQues', JSON.stringify(data), {expires: 1});
        window.location.href = url;
    }
    

});