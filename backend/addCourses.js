$(document).ready(function() {

    $user = "";
    if (isLoggedIn()) {
      console.log(isLoggedIn(), 'yes');
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }



    // $.ajax({
    //     url: 'https://stagingfacultypython.edwisely.com/getCourseDepartmentSections?university_degree_department_id='+`${$user.university_degree_department_id}`,
    //     type: 'GET',
    //     contentType: 'application/json',
    //     headers: {
    //         'Authorization': `Bearer ${$user.token}`
    //     },
    //     success: function (result) {
    //         // alert(result.status);
    //         $('#courseModalClass').empty();
    //         if (result.status == 200) {
    //             $.each(result.data, function (key, value) {
    //                 $('#courseModalClass').append("<li class='courseTagsLi'><input type='checkbox' class='courseTagsInput' value='"+value.id+"' name='courseClass' id='checkbox"+value.id+"' /><label for='checkbox"+value.id+"' class='courseTagsLabel show2'><i class='fas fa-check' style='display: none;'></i> "+value.name+"</label></li>");
    //             });
    //         }
    //     },
    //     error: function (error) {
    //         alert("Request Failed with status: "+error.status);
    //     }
    // });

    let courses = [];
    let deptArr = [];
    let deptFlag = true;

    getCourses();
    

    function getCourses(){

        let courseDept = $("#courseSelectDept").val();
        // alert(courseDept);


        $.ajax({
            url: 'https://stagingfacultypython.edwisely.com/getCourses',
            type: 'GET',
            contentType: 'application/json',
            headers: {
                'Authorization': `Bearer ${$user.token}`
            },
            success: function (result) {
                // alert(result.message);
                $('#courseList').empty();
                $('#courseSelectList').empty();
                if (result.status == 200) {
                    // alert("here");
                    let div1 = '<ul class="list-unstyled">';
                    let div = "";
                    $.each(result.data, function (key, value) {
                        let dept = [];
                        // alert(value.id);
                        //  alert(value.name);

                        if(!courseDept || courseDept == "0" || courseDept == "all"){

                            div = div + "<div class='col-sm-4 course'>";
                            div = div + "<div class='card mb-3 shadow-sm addCourseCard'>";
                            if (value.course_image)
                                div = div + "<img class='p-2' style='width:100%' height='250' src='"+value.course_image+"' alt='No Image'>";
                            else
                                div = div + "<img class='card-img-top py-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'>";
                            // div = div + "<img class='card-img-top py-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'>";
                            div = div + "<div class='card-body'>";
                            div = div + "<h5 class='card-title font-weight-bold pb-0 mb-0'>"+value.name+"</h5>";
                            div = div + "<p class='pb-0 my-0 pt-1'><span class='span-heading'>Departments</span></p>";
                            div = div + "<div class='row'>";

                            $.each(value.departments, function (key, value) {
                                div = div + "<div class='col-sm-3 mb-2'>";
                                div = div + "<span class='span-heading span-dept p-1'>"+value.name+"</span>";
                                div = div + "</div>";
                                dept.push({
                                    "id":value.subject_semester_id,
                                    "uid":value.university_degree_department_id,
                                    "name":value.name
                                });    

                                if(deptFlag){
                                    if (!deptArr.includes(value.name)) {
                                        // alert(value.name);
                                        deptArr.push(value.name);
                                    }
                                }
                            });
                            
                            div = div + "</div><div class='d-flex py-0 justify-content-end'>";
                            div = div + "<button type='button' class='btn btn-primary' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+value.id+"' data-name='"+value.name+"' data-dept='" + JSON.stringify(dept) + "'>+</button>";
                            div = div + "</div></div></div></div>";

                            div1 = div1 + "<li class='course' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+value.id+"' data-name='"+value.name+"' data-dept='" + JSON.stringify(dept) + "'>"+value.name+"</li>";

                            courses.push({
                                "id":value.id,
                                "name":value.name,
                                "dept":JSON.stringify(dept)
                            });

                        }
                        else{
                            let courseAddFlag = false;
                            $.each(value.departments, function (key, value) {
                                if(value.name == courseDept){
                                    courseAddFlag = true;
                                }
                            });

                            if(courseAddFlag){

                                div = div + "<div class='col-sm-4 course'>";
                                div = div + "<div class='card mb-3 shadow-sm addCourseCard'>";
                                if (value.course_image)
                                    div = div + "<img class='card-img-top py-2' width='200' height='200' src='"+value.course_image+"' alt='No Image'>";
                                else
                                    div = div + "<img class='card-img-top py-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'>";
                                // div = div + "<img class='card-img-top py-2' width='200' height='200' src='../images/onlineCourses.png' alt='No Image'>";
                                div = div + "<div class='card-body'>";
                                div = div + "<h5 class='card-title font-weight-bold pb-0 mb-0'>"+value.name+"</h5>";
                                div = div + "<p class='pb-0 my-0 pt-1'><span class='span-heading'>Departments</span></p>";
                                div = div + "<div class='row'>";

                                $.each(value.departments, function (key, value) {
                                    div = div + "<div class='col-sm-3 mb-2'>";
                                    div = div + "<span class='span-heading span-dept p-1'>"+value.name+"</span>";
                                    div = div + "</div>";
                                    dept.push({
                                        "id":value.subject_semester_id,
                                        "uid":value.university_degree_department_id,
                                        "name":value.name
                                    });
                                });
                                
                                div = div + "</div><div class='d-flex py-0 justify-content-end'>";
                                div = div + "<button type='button' class='btn btn-primary' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+value.id+"' data-name='"+value.name+"' data-dept='" + JSON.stringify(dept) + "'>+</button>";
                                div = div + "</div></div></div></div>";

                                div1 = div1 + "<li class='course' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+value.id+"' data-name='"+value.name+"' data-dept='" + JSON.stringify(dept) + "'>"+value.name+"</li>";

                                courses.push({
                                    "id":value.id,
                                    "name":value.name,
                                    "dept":JSON.stringify(dept)
                                });
                            }
                        }
                        
                    });
                    div1 = div1 + "</ul>";
                    // alert(div1);
                    $('#courseList').append(div);
                    $('#courseSelectList').append(div1);

                    if(deptArr != null && deptArr.length > 0 && !courseDept){
                        $('#courseSelectDept').empty();
                        $('#courseSelectDept').append("<option value='0' disabled selected>Select Department</option>");
                        $('#courseSelectDept').append("<option value='all'>All</option>")
                        $.each(deptArr,function(key,value){
                            $('#courseSelectDept').append("<option value='"+value+"'>"+value+"</option>")
                        });
                        deptFlag = false;
                    }
                }
                else
                    $('#courseList').append("<div class='col-sm-12 mb-5'><h5>No Courses Found</h5></div>");
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });
    }

    $('#courseSelectDept').on('change', function () {
        getCourses();
    });

    $("#courseSelect").click(function () {
        // alert("here");
        $("#courseSelectList").show();
    });

    $("#courseSelect").keyup(function () {
        let searchTerm = $("#courseSelect").val().toLowerCase();
        // alert(courses);
        $("#courseSelectList").show();
        if(courses.length > 0){
            let div = "<ul class='list-unstyled'>";
            $('#courseSelectList').empty();
            $.each(courses, function (key, value) {
                // alert(value.name);
                if(value.name.toLowerCase().indexOf(searchTerm) != -1)
                    div = div + "<li class='course' style='cursor:pointer;' data-toggle='modal' data-target='#courseModal' data-subject='"+value.id+"' data-dept='" + value.dept + "'>"+value.name+"</li>";
            });
            div = div + "</ul>";
            $("#courseSelectList").append(div);
        }
        else alert("oops");
    });

    $("#courseSelect").blur(function () {
        // alert("here");
        $("#courseSelectList").fadeOut();
    });

    $(document).on('click', '.show1', function () {
        // alert("ok");
        $(".show1").children("i").hide();
        $(this).children("i").show();
    });

    $(document).on('click', '.courseTagsInput', function () {
        getSections($("input[name='courseDept']:checked").data('uid'));
    });

    let classes = [];

    $(document).on('click', 'input[name=courseClass]', function () {
        // alert($('input[name=courseClass]').val());
        // classes.push($(this).val());
        var ischecked= $(this).is(':checked');
        // alert(ischecked);
        if(ischecked){
            $(this).siblings('label').children("i").show();
            classes.push($(this).val());
        }
        else{
            $(this).siblings('label').children("i").hide();
            classes.splice( $.inArray($(this).val(), classes), 1 );
        }
        // alert(JSON.stringify(classes));
    });

    $('#courseModal').on('show.bs.modal', function (event) {
        let button = $(event.relatedTarget) // Button that triggered the modal
        let dept = button.data('dept'); // Extract info from data-* attributes
        let subject_id = button.data('subject');
        let subject_name = button.data('name');

        $('#courseModalDept').empty();
        $('#modalSaveBtn').data('subject',subject_id);
        $('#courseModalHeader').html("Finilize '"+subject_name+"' to Your Courses")

        $.each(dept, function(key, value){
            $('#courseModalDept').append("<li class='courseTagsLi'><input type='radio' class='courseTagsInput' value='"+value.id+"' data-uid='"+value.uid+"' name='courseDept' id='radio"+value.id+"' /><label for='radio"+value.id+"' class='courseTagsLabel show1'><i class='fas fa-check' style='display: none;'></i> "+value.name+"</label></li>");
        });

    });

    function getSections(uid){
        // alert(uid);

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
                // alert(result.message);
                $('#courseModalClass').empty();
                if (result.status == 200) {
                    $.each(result.data, function (key, value) {
                        // alert(value.name);
                        $('#courseModalClass').append("<li class='courseTagsLi'><input type='checkbox' class='courseTagsInput' value='"+value.id+"' name='courseClass' id='checkbox"+value.id+"' /><label for='checkbox"+value.id+"' class='courseTagsLabel show2'><i class='fas fa-check' style='display: none;'></i>"+value.name+"</label></li>");
                    });
                    
                    $('#loadingDiv').remove();
                    // $('#courseModalClass').css('position', 'absolute');
                }
            },
            error: function (error) {
                alert("Request Failed with status: "+error.status);
            }
        });
    }

    $('#courseModal').on('hide.bs.modal', function (event) {
        // alert("here");
        $('#courseModalDept').empty();
        $('input[name="courseDept"]').prop('checked', false);
        // $('input:checkbox').removeAttr('checked');
        $('input[name=courseClass]').prop('checked', false)
        $('#modalSaveBtn').removeData('subject');
        classes = [];
        $(".show2").children("i").hide();

    });

    $('#modalSaveBtn').click(function(){
        let courseDept = $("input[name='courseDept']:checked").val();
        let subject_id = $(this).data('subject');
        // alert(JSON.stringify(classes));
        
        if(courseDept && classes != null && classes.length > 0 && subject_id){

            let form = new FormData();
            form.append("subject_id", subject_id);
            form.append("subject_semester_id", courseDept);
            form.append("sections", "["+classes.join(",")+"]");

            // for(let key of form.entries()){
            //     alert(key[1]);
            // }

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
                    // alert(result.message);
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
        setInterval(function () {
            $('#errorToast').toast('hide');
            $('#successToast').toast('hide');
        }, 5000);
        $("#errorToast,successToast").toast({
            delay: 53000
        });
    });

});