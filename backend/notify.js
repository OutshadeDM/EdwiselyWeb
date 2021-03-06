$(async function () {
	// Check if User is logged in
	$user = "";
	if (isLoggedIn()) {
		$user = JSON.parse(isLoggedIn());
		$('html').removeClass('d-none');
		$("#greetingNav").html($user.name);
	} else {
		window.location.replace("login.html");
	}

	$('#myTabContent').on('change', '.selectAll', function () {
		const tab = $(this).data('tab');
		const checkBoxes = $(`#t${tab} .single input:checkbox`);
		console.log($(this).prop('checked'));
		if ($(this).prop('checked')) {
			checkBoxes.prop("checked", true);
		} else {
			checkBoxes.prop("checked", false);
		}
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
				var form = new FormData();
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
						// console.log(result);
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
		$('#myTab').append(`<li class="nav-item my-2 col-12">
                            <a class="nav-link text-muted ${first ? 'active' : ''}" id="t${tabNumber}-tab" data-toggle="tab" href="#t${tabNumber}" role="tab" aria-controls="t${tabNumber}" aria-selected="true">${section.name}</a>
                          </li>`);
		$('#myTabContent').append(`<div class="tab-pane fade ${first ? 'show active' : ''}" id="t${tabNumber}" role="tabpanel" aria-labelledby="t${tabNumber}-tab"></div>`);
		$(`#t${tabNumber}`).append(`<div class="border row selectAll">
		<div class="col-8 border-right">Students</div>
		<div class="col-4 align-self-center">
			<label class="form-check-label" for="select${tabNumber}">SELECT ALL</label>
			<input style="float: right;right: 10px;" name="selectAll" data-tab=${tabNumber} type="checkbox" class="form-check-input selectAll" id="select${tabNumber}">		
		</div>
		</div><div class="student-list row"></div>`)
		$.each(section.students.data, (index, student) => {
			$(`#t${tabNumber} .student-list`).append(`<div class="form-check col-12 single">
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
						if (!(name in track)) {
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

$('#submit').on('click', function (e) {
	e.preventDefault();
	console.log(this);
	var formData = new FormData();
	let title = $('#title').val();
	formData.append('title', title);
	if (!title.length) {
		$('.error.title').text('*Please Enter A Title');
		return;
	}
	formData.append('description', $($("#summernote").summernote("code")).text());
	formData.append('priority', $('#priority').prop('checked') ? 1 : 0);
	formData.append('is_comment_anonymous', $('#is_comment_anonymous').prop('checked') ? 1 : 0);
	formData.append('file', $('#file')[0].files[0] || '');
	var values = $("input[name='students[]']:checked")
		.map(function () { return $(this).val(); }).get();
	console.log(values);
	formData.append('students', JSON.stringify(values));
	for (var pair of formData.entries()) {
		console.log(pair[0] + ', ' + pair[1]);
	}
	$.ajax({
		url: `https://stagingfacultypython.edwisely.com/college/createNotification`,
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
			if (data.status == 200) {
				$.cookie('status', 'success');
				$.cookie('message', 'notify');
				window.location.replace("index.html");
			} else {
				$.cookie('status', 'failure');
				$.cookie('message', 'Not a valid file format');
				window.location.replace("index.html");
			}
		},
		error: function (error) {
			console.log(error);
		}
	});
});

function fileUpload() {
	$file = $('#file')[0].files[0];
	if ($file) {
		$name = $file.name.length > 15 ? `${$file.name.slice(0, 15)}...` : $file.name;
		$('label.file .text').text($name);
	} else {
		$('label.file .text').text("");
	}
}