$(document).ready(function() {

    $user = "";
    if (isLoggedIn()) {
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }

    let courses = [];
    let deptArr = [];
    let deptFlag = true;

    getCourses();

    function getCourses(){

        let courseDept = $("#courseSelectDept").val();

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourses',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                $(".loader-wrapper").addClass("d-none");
                $('#courseList').empty();
                $('#courseSelectList').empty();
                if (result.status == 200) {
                    let div1 = '<ul class="list-unstyled">';
                    $.each(result.data, (index,course) => {
                        let dept = [];

                        if(!courseDept || courseDept == "0" || courseDept == "all"){

                            $img = $('<img>').addClass('card-img-top img-fluid p-0 h-75').attr('src', course.course_image || '../images/onlineCourses.png');
                            $title = $('<h5></h5>').addClass('card-title font-weight-bold mb-0').text(course.name);

                            let departments = "";
                            $.each(course.departments, (index,department) => {
                                if(index != 0) departments = departments + ", ";
                                departments = departments + department.name;
                                
                                dept.push({
                                    "id":department.subject_semester_id,
                                    "uid":department.university_degree_department_id,
                                    "name":department.name
                                });    

                                if(deptFlag){
                                    if (!deptArr.includes(department.name)) {
                                        deptArr.push(department.name);
                                    }
                                }
                            });

                            $deptTitleSpan = $('<span></span>').addClass('span-heading').text('Departments');
                            $deptTitle = $('<p></p>').addClass('pb-0 my-0 pt-1 text-start').append($deptTitleSpan);
                            $dept = $('<span></span>').addClass('py-1').css('font-weight','bold').text(departments);
                            $deptdiv1 = $('<div></div>').addClass('col-8 justify-content-start px-0').append($deptTitle,$dept);

                            $button = $("<button data-toggle='modal' data-target='#courseModal' data-subject='"+course.id+"' data-name='"+course.name+"' data-dept='" + JSON.stringify(dept) + "'></button>").addClass('btn p-0').prop('type','button').css('cursor', 'pointer').css('border', "none").css('color','white  ').html("Add <img src='../images/plus-circle.svg' />");
                            $buttonDiv = $('<div></div>').addClass('d-flex py-0 px-0 justify-content-end').css('height','100%').css('align-items','center').append($button);
                            $deptdiv2 = $('<div></div>').addClass('col-4 px-0').append($buttonDiv);

                            div1 = div1 + "<li class='course' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+course.id+"' data-name='"+course.name+"' data-dept='" + JSON.stringify(dept) + "'>"+course.name+"</li>";

                            courses.push({
                                "id":course.id,
                                "name":course.name,
                                "dept":JSON.stringify(dept)
                            });

                            $deptDiv = $('<div></div>').addClass('row mx-0 px-0 deptDiv').append($deptdiv1,$deptdiv2);
                            
                            $cardBody = $('<div></div>').addClass('card-body p-3').css('height','40%').append($title,$deptDiv);
                            $card = $('<div></div>').addClass('card position-relative mb-4 shadow-sm addCourseCard').css('cursor','default').css('color','white').append($img, $cardBody);
                            $course = $("<div'></div>").addClass('course col-lg-4 col-md-6 col-12 h-100').append($card);
                            $('#courseList').append($course);

                        }
                        else{
                            let courseAddFlag = false;
                            $.each(course.departments, function (key, value) {
                                if(value.name == courseDept){
                                    courseAddFlag = true;
                                }
                            });

                            if(courseAddFlag){

                                $img = $('<img>').addClass('card-img-top img-fluid p-0 h-75').attr('src', course.course_image || '../images/onlineCourses.png');
                                $title = $('<h5></h5>').addClass('card-title font-weight-bold mb-0').text(course.name);

                                let departments = "";
                                $.each(course.departments, (index,department) => {
                                    if(index != 0) departments = departments + ", ";
                                    departments = departments + department.name;
                                    
                                    dept.push({
                                        "id":department.subject_semester_id,
                                        "uid":department.university_degree_department_id,
                                        "name":department.name
                                    });
                                });

                                $deptTitleSpan = $('<span></span>').addClass('span-heading').text('Departments');
                                $deptTitle = $('<p></p>').addClass('pb-0 my-0 pt-1 text-start').append($deptTitleSpan);
                                $dept = $('<span></span>').addClass('py-1').text(departments);
                                $deptdiv1 = $('<div></div>').addClass('col-8 justify-content-start px-0').append($deptTitle,$dept);
                                
                                $button = $("<button data-toggle='modal' data-target='#courseModal' data-subject='"+course.id+"' data-name='"+course.name+"' data-dept='" + JSON.stringify(dept) + "'></button>").addClass('btn p-0').prop('type','button').css('cursor', 'pointer').css('border', "none").css('color','white  ').html("Add <img src='../images/plus-circle.svg' />");
                                $buttonDiv = $('<div></div>').addClass('d-flex py-0 px-0 justify-content-end').css('height','100%').css('align-items','center').append($button);
                                $deptdiv2 = $('<div></div>').addClass('col-4 px-0 deptDiv').append($buttonDiv);

                                div1 = div1 + "<li class='course' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+course.id+"' data-name='"+course.name+"' data-dept='" + JSON.stringify(dept) + "'>"+course.name+"</li>";

                                courses.push({
                                    "id":course.id,
                                    "name":course.name,
                                    "dept":JSON.stringify(dept)
                                });

                                $deptDiv = $('<div></div>').addClass('row mx-0 px-0').append($deptdiv1,$deptdiv2);
                                
                                $cardBody = $('<div></div>').addClass('card-body p-3').css('height','40%').append($title,$deptDiv);
                                $card = $('<div></div>').addClass('card position-relative mb-4 shadow-sm addCourseCard').css('cursor','default').css('color','white').append($img, $cardBody);
                                $course = $("<div></div>").addClass('course col-lg-4 col-md-6 col-12 h-100').append($card);
                                $('#courseList').append($course);
                            }
                        }                        
                    });
                    div1 = div1 + "</ul>";
                    $('#courseSelectList').append(div1);

                    if(deptArr != null && deptArr.length > 0 && !courseDept){
                        $('#courseSelectDept').empty();
                        $('#courseSelectDept').append("<option vaue='0' disabled selected>Choose Department</option>");
                        $('#courseSelectDept').append("<option value='all'>All</option>")
                        $.each(deptArr,function(key,value){
                            $('#courseSelectDept').append("<option value='"+value+"'>"+value+"</option>")
                        });
                        deptFlag = false;
                    }
                }
                else
                    $('#courseList').append("<div class='col-sm-12 mb-5'><h5><i>Education is the most powerful weapon which you can use to change the world</i>- Nelson Mandela <br><br> Please add courses that you Educate</h5></div>");
            },
            error: function (error) {
                $(".loader-wrapper").addClass("d-none");
                alert("Request Failed with status: "+error.status);
            }
        });
    }

    $('#courseSelectDept').on('change', function () {
        getCourses();
    });

    $("#courseSelect").click(function () {
        $("#courseSelectList").show();
    });

    $("#courseSelect").keyup(function () {
        let searchTerm = $("#courseSelect").val().toLowerCase();
        if(courses.length > 0){
            $("#courseSelectList").show();
            let div = "<ul class='list-unstyled'>";
            $('#courseSelectList').empty();
            $.each(courses, function (key, value) {
                if(value.name.toLowerCase().indexOf(searchTerm) != -1)
                    div = div + "<li class='course' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+value.id+"' data-dept='" + value.dept + "' data-name='"+value.name+"'>"+value.name+"</li>";
            });
            div = div + "</ul>";
            $("#courseSelectList").append(div);
        }
        else alert("oops");
    });

    $("#courseSelect").blur(function () {
        $("#courseSelectList").fadeOut();
    });

    $(document).on('click', '.show1', function () {
        $(".show1").children("i").hide();
        $(this).children("i").show();
    });

    $(document).on('click', '.courseSelectDept', function () {
        getSections($("input[name='courseDept']:checked").data('uid'));
    });

    let classes = [];

    $(document).on('click', 'input[name=courseClass]', function () {
        var ischecked= $(this).is(':checked');
        if(ischecked){
            $(this).siblings('label').children("i").show();
            classes.push($(this).val());
        }
        else{
            $(this).siblings('label').children("i").hide();
            classes.splice( $.inArray($(this).val(), classes), 1 );
        }
    });

    $('#courseModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget)
        let dept = button.data('dept');
        let subject_id = button.data('subject');
        let subject_name = button.data('name');

        $('#courseModalDept').empty();
        $('#modalSaveBtn').data('subject',subject_id);
        $('#courseModalHeader').html("Adding '"+subject_name+"' to Your Courses")

        $.each(dept, function(key, value){
            $('#courseModalDept').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput courseSelectDept' value='"+value.id+"' data-uid='"+value.uid+"' name='courseDept' id='radio"+value.id+"' /><label for='radio"+value.id+"' class='courseTagsLabel courseDept show1'><i class='fas fa-check' style='display: none;'></i> "+value.name+"</label></li>");
        });

    });

    function getSections(uid){
        $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
            position: "absolute",
            width: "100%",
            height: "100%",
            background: "#fff",
            opacity: 0.7
          }).appendTo($("#courseModalClass").css('position', 'relative'));

        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourseDepartmentSections?university_degree_department_id='+uid,
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                $('#courseModalClass').empty();
                if (result.status == 200) {
                    $.each(result.data, function (key, value) {
                        $('#courseModalClass').append("<li class='courseTagsLi'><input type='checkbox' class='courseTagsInput' value='"+value.id+"' name='courseClass' id='checkbox"+value.id+"' /><label for='checkbox"+value.id+"' class='courseTagsLabel show2'><i class='fas fa-check' style='display: none;'></i>"+value.name+"</label></li>");
                    });
                    
                    $('#loadingDiv').remove();
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });
    }

    $('#courseModal').on('hide.bs.modal', function () {
        $('#courseModalDept').empty();
        $('#courseModalClass').empty();
        $('#courseModalClass').append("<p>Select Department First</p>");
        $('input[name="courseDept"]').prop('checked', false);
        $('input[name=courseClass]').prop('checked', false)
        $('#modalSaveBtn').removeData('subject');
        classes = [];
        $(".show2").children("i").hide();

    });

    $('#modalSaveBtn').click(function(){
        let courseDept = $("input[name='courseDept']:checked").val();
        let subject_id = $(this).data('subject');
        
        if(courseDept && classes != null && classes.length > 0 && subject_id){

            let form = new FormData();
            form.append("subject_id", subject_id);
            form.append("subject_semester_id", courseDept);
            form.append("sections", "["+classes.join(",")+"]");

            $("<div id='loadingDiv' class='d-flex align-items-center justify-content-center'><img src='../images/loading.gif' alt='No Image' style='top:50%;left:50%;'></div>").css({
                position: "absolute",
                width: "100%",
                height: "100%",
                background: "#fff",
                opacity: 0.7
            }).appendTo($("#modalContent").css('position','relative'));

            $.ajax({
                url: 'https://stagingfacultypython.edwisely.com/addFacultyCourseSections',
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
                        $('#successToastBody').text('Course has been added successfully');
                        $('#successToast').toast('show');

                        $("#loadingDiv").remove();
                        $('#modalContent').css('position', 'absolute');

                        $('#courseModal').modal('toggle');
                    }
                    else if(result.status == 500){
                        $('#errorToastBody').text(result.message);
                        $('#errorToast').toast('show');
                        $("#loadingDiv").remove();
                        $('#modalContent').css('position', 'absolute');
                    }
                    else {
                        $('#errorToastBody').text('Error Occurred');
                        $('#errorToast').toast('show');
                        $("#loadingDiv").remove();
                        $('#modalContent').css('position', 'absolute');
                        $('courseModal').modal('toggle');
                        alert(result.message);
                    }

                },
                error: function (error) {
                    $("#loadingDiv").remove();
                    $('#modalContent').css('position', 'absolute');
                    $('courseModal').modal('toggle');
                    alert("Request Failed with status: "+error.status);
                }
            });


        }
        else{
            $('#errorToastBody').text('Department and Class are mandatory');
            $('#errorToast').toast('show');
        }

    });

    $('#errorToast,#successToast').on('show.bs.toast', function () {
        $('#toastDiv').show();
        setTimeout(function () {
            $('#errorToast').toast('hide');
            $('#successToast').toast('hide');
            $('#toastDiv').hide();
        }, 7000);
    });

});