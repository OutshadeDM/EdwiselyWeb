$(async function() {
	// Check if User is logged in
	$user = "";
	if (isLoggedIn()) {
		$user = JSON.parse(isLoggedIn());
		$('html').removeClass('d-none');
	} else {
		window.location.replace("login.html");
	}
	$('#myTabContent').on('change', '.selectAll', function() {
		const tab = $(this).data('tab');
		const checkBoxes = $(`#t${tab} .single input:checkbox`);
		if ($(this).prop('checked')) {
			checkBoxes.prop("checked", true);
		} else {
			checkBoxes.prop("checked", false);
		}
	});	

	Date.prototype.addHours = function(h) {
		this.setTime(this.getTime() + (h*60*60*1000));
		return this;
	}
	var checkPastTimeS = function(inputDateTime) {
		if (typeof(inputDateTime) != "undefined" && inputDateTime !== null) {
			var current = new Date();
	 
			//check past year and month
			if (inputDateTime.getFullYear() < current.getFullYear()) {
				$('#starttime').datetimepicker('reset');
				alert("Sorry! Past date time not allow.");
			} else if ((inputDateTime.getFullYear() == current.getFullYear()) && (inputDateTime.getMonth() < current.getMonth())) {
				$('#starttime').datetimepicker('reset');
				alert("Sorry! Past date time not allow.");
			}
	 
			// 'this' is jquery object datetimepicker
			// check input date equal to todate date
			if (inputDateTime.getDate() == current.getDate()) {
				if (inputDateTime.getHours() < current.getHours()) {
					$('#starttime').datetimepicker('reset');
				}
			} else {
				this.setOptions({
					minTime: false
				});
				// $('#endtime').datetimepicker('option', 'minDate', $(this).val());
			}
			// $('#endtime').datetimepicker('option', 'minDate', $(this).val());
			$('#endtime').data('xdsoft_datetimepicker').setOptions({minDate: $('#starttime').data('xdsoft_datetimepicker').getValue()});
			$('#endtime').data('xdsoft_datetimepicker').setOptions({maxDate: new Date($('#starttime').data('xdsoft_datetimepicker').getValue()).addHours(3)});
			$('#endtime').data('xdsoft_datetimepicker').setOptions({minTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 'h'});
			$('#endtime').data('xdsoft_datetimepicker').setOptions({maxTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 3 + 'h'});
		}
	};
	
	var checkPastTimeE = function(inputDateTime) {
		if (typeof(inputDateTime) != "undefined" && inputDateTime !== null) {
			var current = new Date();
	 
			//check past year and month
			if (inputDateTime.getFullYear() < current.getFullYear()) {
				$('#starttime').datetimepicker('reset');
				alert("Sorry! Past date time not allow.");
			} else if ((inputDateTime.getFullYear() == current.getFullYear()) && (inputDateTime.getMonth() < current.getMonth())) {
				$('#starttime').datetimepicker('reset');
				alert("Sorry! Past date time not allow.");
			}
	 
			// 'this' is jquery object datetimepicker
			// check input date equal to todate date
			console.log(this);
			if (inputDateTime.getDate() == current.getDate()) {
				if (inputDateTime.getHours() < current.getHours()) {
					$('#starttime').datetimepicker('reset');
				}
			} else {
				this.setOptions({
					minTime: false
				});
				// $('#endtime').datetimepicker('option', 'minDate', $(this).val());
			}
			// $('#endtime').datetimepicker('option', 'minDate', $(this).val());
			$('#endtime').data('xdsoft_datetimepicker').setOptions({minDate: $('#starttime').data('xdsoft_datetimepicker').getValue()});
			$('#endtime').data('xdsoft_datetimepicker').setOptions({maxDate: new Date($('#starttime').data('xdsoft_datetimepicker').getValue()).addHours(3)});
			$('#endtime').data('xdsoft_datetimepicker').setOptions({minTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 'h'});
			$('#endtime').data('xdsoft_datetimepicker').setOptions({maxTime: $('#starttime').data('xdsoft_datetimepicker').getValue().getHours() + 3 + 'h'});
		}
	};

	var currentYear = new Date();
    var startTime = $('#starttime').datetimepicker({
		format:'Y-m-d H:i:s',
		minDate : 0,
		yearStart : currentYear.getFullYear(), // Start value for current Year selector
		onChangeDateTime:checkPastTimeS,
		onShow:checkPastTimeS,	
    });
	console.log(startTime.data("datetimepicker"));
    var endTime = $('#endtime').datetimepicker({
		format:'Y-m-d H:i:s',
		minDate: 0,
		yearStart : currentYear.getFullYear(), // Start value for current Year selector
		onChangeDateTime:checkPastTimeE,
		onShow:checkPastTimeE,		
	});    
	
	$("#starttime").on("dp.change", function(e) {
		$('#endtime').data('xdsoft_datetimepicker').setOptions({minDate: $('#starttime').data('xdsoft_datetimepicker').getValue('minDate')});
	 });
  
	 $("#endtime").on("dp.change", function(e) {
		$('#starttime').data('xdsoft_datetimepicker').setOptions({maxDate: $('#endtime').data('xdsoft_datetimepicker').getValue('maxDate')});
	 });

	let tabNumber = 1;
	let selectNumber = 0;
	let first = true;

	// Get faculty data function
	const facultyData = () => {
		return new Promise((resolve, reject) => {
			try {
			    $.ajax({
			        url: `https://stagingfacultypython.edwisely.com/getFacultyCourses`,
			        type: 'GET',
			        contentType: 'application/json',
			        headers: {
			            'Authorization': `Bearer ${$user.token}`
			        },
			        success: function (result) {
			            // alert(result.status);
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

	const getStudents = (id) => {
		return new Promise((resolve, reject) => {
			try {
				var form = new  FormData();
    			form.append("college_department_section_id", id);
			    $.ajax({
			        url: 'https://stagingfacultypython.edwisely.com/common/getCollegeDepartmentSectionStudents',
			        type: 'POST',
			        dateType: 'json',
			        data: form,
			        contentType: false,
			        processData: false,
			        headers: {
			            'Authorization': `Bearer ${$user.token}`
			        }, 
			        success: function (result) {
			            // alert(result.status);
			            console.log(result);
			            resolve(result);
			        },
			        error: function (error) {
			            alert(error);
			            reject(error);
			        }
			    });
			} catch (error) {
				console.log(error);
				reject(error);
			}
		});		
	}

	const createSectionTab = (section) => {
		$('#myTab').append(`<li class="nav-item">
                            <a class="nav-link ${first? 'active':''}" id="t${tabNumber}-tab" data-toggle="tab" href="#t${tabNumber}" role="tab" aria-controls="t${tabNumber}" aria-selected="true">${section.name}</a>
                          </li>`);
		$('#myTabContent').append(`<div class="tab-pane fade ${first? 'show active': ''}" id="t${tabNumber}" role="tabpanel" aria-labelledby="t${tabNumber}-tab"></div>`);
		$(`#t${tabNumber}`).append(`<div class="form-check">
		<label class="form-check-label" for="select${tabNumber}">SELECT ALL</label>
		<input style="float: right;right: 0px;" name="selectAll" data-tab=${tabNumber} type="checkbox" class="form-check-input selectAll" id="select${tabNumber}">
		</div>`)		
		$.each(section.students.data, (index, student) => {
			$(`#t${tabNumber}`).append(`<div class="form-check single my-2">
	                                  <label class="form-check-label" for="exampleCheck${selectNumber}">${student.roll_number} - ${student.name}</label>
	                                  <input style="float: right;right: 0px;" name="students[]" value="${student.id}" type="checkbox" class="form-check-input" id="exampleCheck${selectNumber++}">
	                                </div>`)
		});
		tabNumber++;
		first = false;
	}

	const getSections = async (data) => {
		return new Promise(async (resolve, reject) => {
			try {
				let track = {};
			    let sections = [];
				await $.each(data, async (index, course) => {
					await $.each(course.sections, async (i, section) => {
						let name = `${section.department_name} - ${section.name}`;
						if ( !( name in track ) ) {
						    track[name] = 1;
						    let students = await getStudents(section.id);
						    createSectionTab({
						    	name: name,
						    	students: students
						    });						    
						}
					});
				});
			} catch (error) {
				console.log(error);
			}
		});
	}	



	try {
		let faculty = await facultyData();
		let sections = await getSections(faculty.data);
	} catch (error) {
		console.log(error);
	}
});

// $('.submit').on('click', function(e) {
// 	e.preventDefault();
// 	$('#formdata').submit();
// })

$('#formdata').submit(function(e) {
    e.preventDefault();  
    console.log(this);
    var formData = new FormData();
    formData.append('title', $('#title').val());
    formData.append('description', $("#description").val());
    formData.append('start_time', $("#starttime").val());
    formData.append('end_time', $("#endtime").val());
    var values = $("input[name='students[]']:checked")
              .map(function(){return $(this).val();}).get();
    formData.append('students', JSON.stringify(values));
	for(var pair of formData.entries()) {
	   console.log(pair[0]+ ', '+ pair[1]); 
	}
    $.ajax({
        url: `https://stagingfacultypython.edwisely.com/college/createVC`,
        type: 'POST',
		dateType: 'json',        
        data: formData,
        contentType: false,
        processData: false,
        headers: {
            'Authorization': `Bearer ${$user.token}`
        },	        
        success: function (data) {
			console.log(data);
			window.location.replace("index.html?status=success&message=liveclass");
        },
        error: function (error) {
            console.log(error);
        }        
    });		
});