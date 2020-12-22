const getFormattedDateTime = (dt) => {
	return `${
    dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${
    dt.getDate().toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;
}

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
	
	let startDateTextBox = $('#starttime');
	let endDateTextBox = $('#endtime');
	
	$.timepicker.datetimeRange(
		startDateTextBox,
		endDateTextBox,
		{
			maxInterval: (3*1000*60*60), // 1hr
			dateFormat: 'dd M yy', 
			timeFormat: 'HH:mm:ss',
			start: {
				minDate: 0,
				onSelect: function (selectedDateTime){
					endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') )
					// endDateTextBox.datetimepicker('option', 'maxDate', startDateTextBox.datetimepicker('getDate').addHours(3) );
				}
			}, // start picker options
			end: {
				minDate: new Date(),
				// maxDate: new Date().addHours(3),
				// onSelect: function (selectedDateTime){
				// 	endDateTextBox.datetimepicker('option', 'minDate', startDateTextBox.datetimepicker('getDate') )
				// 	endDateTextBox.datetimepicker('option', 'maxDate', startDateTextBox.datetimepicker('getDate').addHours(3) );
				// }
			} // end picker options					
		}
	);

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
		$('#myTab').append(`<li class="nav-item my-2 col-md-4 col-6">
                            <a class="nav-link ${first? 'active':''}" id="t${tabNumber}-tab" data-toggle="tab" href="#t${tabNumber}" role="tab" aria-controls="t${tabNumber}" aria-selected="true">${section.name}</a>
                          </li>`);
		$('#myTabContent').append(`<div class="tab-pane fade ${first? 'show active': ''}" id="t${tabNumber}" role="tabpanel" aria-labelledby="t${tabNumber}-tab"></div>`);
		$(`#t${tabNumber}`).append(`<div class="form-check border rounded mb-2">
		<label class="form-check-label" for="select${tabNumber}">SELECT ALL</label>
		<input style="float: right;right: 10px;" name="selectAll" data-tab=${tabNumber} type="checkbox" class="form-check-input selectAll" id="select${tabNumber}">
		</div><div class="student-list"></div>`)		
		$.each(section.students.data, (index, student) => {
			$(`#t${tabNumber} .student-list`).append(`<div class="form-check single border rounded mb-2">
	                                  <label class="form-check-label" for="exampleCheck${selectNumber}">${student.roll_number} - ${student.name}</label>
	                                  <input style="float: right;right: 10px;" name="students[]" value="${student.id}" type="checkbox" class="form-check-input" id="exampleCheck${selectNumber++}">
	                                </div>`);
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
    formData.append('start_time', getFormattedDateTime(new Date($("#starttime").val())));
    formData.append('end_time', getFormattedDateTime(new Date($("#endtime").val())));
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
			$.cookie('status', 'success');
			$.cookie('message', 'liveclass');
			window.location.replace("index.html");
        },
        error: function (error) {
            console.log(error);
        }        
    });		
});