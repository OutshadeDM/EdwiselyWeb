const getFormattedDateTime = (dt) => {
	return `${
    dt.getFullYear().toString().padStart(4, '0')}-${(dt.getMonth()+1).toString().padStart(2, '0')}-${
    dt.getDate().toString().padStart(2, '0')} ${
    dt.getHours().toString().padStart(2, '0')}:${
    dt.getMinutes().toString().padStart(2, '0')}:${
    dt.getSeconds().toString().padStart(2, '0')}`;
}


const getPngImage = (heicimage) => {
	return new Promise((resolve, reject) => {
		fetch(`https://cors-anywhere.herokuapp.com/${heicimage}`)
		.then((res) => res.blob())
		.then((blob) => heic2any({
		  blob
		}))
		.then((conversionResult) => {
		  var url = URL.createObjectURL(conversionResult);
		  resolve(url);
		})
		.catch((e) => {
		  console.log(e);
		  reject("");
		});	
	});	
}

const releaseResult = (id) => {
	try {
		$.ajax({
			url: `https://stagingfacultypython.edwisely.com/questionnaire/releaseSubjectiveResults?test_id=${id}`,
			type: 'GET',
			contentType: 'application/json',
			headers: {
				'Authorization': `Bearer ${$user.token}`
			},
			success: function (result) {
				// alert(result.status);
				if (result.status == 200) {
					$.cookie('status', 'success');
					$.cookie('message', 'Successfully released the result');
					window.location.replace('index.html')
				} else if (result.status == 204) {
					$('.alert strong').text(result.message);
					$('.alert').addClass(`alert-warning`);
					$(".alert").fadeTo(2000, 500).slideUp(500, function() {
					  $(".alert").slideUp(500);
					});
				}
			},
			error: function (error) {
				console.log(error);
			}
		});
	} catch (error) {
		console.log(error);
	}			
}

$user = "";
let followers = {};
$(async function() {
	jQuery("time.timeago").timeago();
	// Check if User is logged in
	if (isLoggedIn()) {
		$user = JSON.parse(isLoggedIn());
		$('html').removeClass('d-none');
	} else {
		window.location.replace("login.html");
	}

	var date_lt = "";
	var first = true;
	var selectNumber = 0;
	$('#myTabContent').on('change', '.selectAll', function() {
		const tab = $(this).data('tab');
		const checkBoxes = $(`#t${tab} .single input:checkbox`);
		if ($(this).prop('checked')) {
			checkBoxes.prop("checked", true);
		} else {
			checkBoxes.prop("checked", false);
		}
	});	
	
	var status = $.cookie('status');
	var message = $.cookie("message");
	$.removeCookie('status');
	$.removeCookie('message');
	if (status && status !== 'null') {
	  if (message == "notify")
		$('.alert strong').text('Successfully added Notification!');
	  else if (message == "liveclass")
		$('.alert strong').text('Successfully added Live Class');  
	  else
		$('.alert strong').text(message);
	  $('.alert').addClass(`alert-${status}`);
	  $(".alert").fadeTo(2000, 500).slideUp(500, function() {
		$(".alert").slideUp(500);
	  });
	}

	$(document).click(function (event) {
		$(".alert").hide();
	});
	
	
	// Get all the department information
	const getDepartments = (college_id) => {
		return new Promise((resolve, reject) => {
			try {
				var form = new  FormData();
				form.append(`college_id`, college_id);
				$.ajax({
					url: `https://stagingfacultypython.edwisely.com/common/getCollegeDepartment`,
					type: 'POST',
					dateType: 'json',
					contentType: false,
					headers: {
						'Authorization': `Bearer ${$user.token}`
					},
					data: form,
					processData: false,
					success: function (result) {
						// alert(result.status);
						if (result.status == 200) {
						  resolve(result.data)
						} else {
						  reject(result.message);
						}
					},
					error: function (error) {
						alert(error);
					}
				});	
			} catch (error) {
				console.log(error);
			}
		});
	}

	const getColleagues = (college_id, college_university_degree_department_id) => {
		return new Promise((resolve, reject) => {
			try {
				var form = new  FormData();
				form.append(`college_id`, college_id);
				form.append(`college_university_degree_department_id`, college_university_degree_department_id);
				$.ajax({
					url: `https://stagingfacultypython.edwisely.com/common/getFellowColleagues`,
					type: 'POST',
					dateType: 'json',
					contentType: false,
					headers: {
						'Authorization': `Bearer ${$user.token}`
					},
					data: form,
					processData: false,
					success: function (result) {
						// alert(result.status);
						if (result.status == 200) {
						  resolve(result.data)
						} else {
						  reject(result.message);
						}
					},
					error: function (error) {
						alert(error);
					}
				});	
			} catch (error) {
				console.log(error);
			}
		});
	}	

	// Get faculty data function
	const facultyData = (delta_days, from_date="", to_date="") => {
		return new Promise((resolve, reject) => {
			try {
			    $.ajax({
			        url: `https://stagingfacultypython.edwisely.com/college/dashboardData?from_date=${from_date}&delta_days=${delta_days}&to_date=${to_date}`,
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

	// Get peer data function
	const peerData = (delta_days, from_date="") => {
		return new Promise((resolve, reject) => {
			try {
			    $.ajax({
			        url: `https://stagingfacultypython.edwisely.com/college/getPeersDashboardData`,
			        type: 'GET',
			        contentType: 'application/json',
			        headers: {
			            'Authorization': `Bearer ${$user.token}`
			        },
			        success: function (result) {
						resolve(result.college_notifications);				
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

	// Get Answered Students
	const answeredStudents = (id, type='Answered') => {
		return new Promise((resolve, reject) => {
			try {
			    $.ajax({
			        url: `https://stagingfacultypython.edwisely.com/questionnaire/get${type}Students?test_id=${id}`,
			        type: 'GET',
			        contentType: 'application/json',
			        headers: {
			            'Authorization': `Bearer ${$user.token}`
			        },
			        success: function (result) {
						if (result.status == 200) {
							resolve(result.data);
						}
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

	// Get comments
	const getComments = (id, type="Notification") => {
		return new Promise((resolve, reject) => {
			try {
				var form = new  FormData();
				form.append(`${type.toLowerCase()}_id`, id);
				$.ajax({
					url: `https://stagingfacultypython.edwisely.com/${type}/getComments`,
					type: 'POST',
					dateType: 'json',
					contentType: false,
					headers: {
						'Authorization': `Bearer ${$user.token}`
					},
					data: form,
					processData: false,
					success: function (result) {
						// alert(result.status);
						if (result.status == 200) {
						  resolve(result.data)
						} else {
						  reject(result.message);
						}
					},
					error: function (error) {
						alert(error);
					}
				});	
			} catch (error) {
				console.log(error);
			}
		});		
	}

	const startP2p = (id, endDate) => {
		try {
			$.ajax({
				url: `https://stagingfacultypython.edwisely.com/questionnaire/startStudentEvaluation?test_id=${id}&evaluation_end_time=${endDate}`,
				type: 'GET',
				contentType: 'application/json',
				headers: {
					'Authorization': `Bearer ${$user.token}`
				},
				success: function (result) {
					// alert(result.status);
					if (result.status == 200) {
						$.cookie('status', 'success');
						$.cookie('message', 'Successfully started P2P Evaluation');
						window.location.replace('index.html')
					} else {
						console.log(result.message);
					}
				},
				error: function (error) {
					console.log(error);
				}
			});
		} catch (error) {
			console.log(error);
		}		
	}

	// Add Followers
	// Subjective followers
	const subjectiveFollower = (questionnaire_id, college_account_ids) => {
		return new Promise((resolve, reject) => {
			try {
			    $.ajax({
			        url: `https://stagingfacultypython.edwisely.com/questionnaireSubjective/AddFollower?questionnaire_id=${questionnaire_id}&college_account_id=${college_account_ids}`,
			        type: 'GET',
			        contentType: 'application/json',
			        headers: {
			            'Authorization': `Bearer ${$user.token}`
			        },
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

	// Other followers
	const otherFollowers = (type, id, college_account_ids) => {
		return new Promise((resolve, reject) => {
			try {
				var form = new  FormData();
				if (type === 'videoConference')
					form.append('video_conference_id', id);
				else
					form.append(`${type.toLowerCase()}_id`, id);
				form.append('college_account_id', college_account_ids)
				$.ajax({
					url: `https://stagingfacultypython.edwisely.com/${type}/AddFollower`,
					type: 'POST',
					dateType: 'json',
					contentType: false,
					headers: {
						'Authorization': `Bearer ${$user.token}`
					},
					data: form,
					processData: false,
					success: function (result) {
						if (result.status == 200) {
						  resolve(result)
						} else {
						  reject(result.message);
						}
					},
					error: function (error) {
						alert(error);
					}
				});	
			} catch (error) {
				console.log(error);
			}
		});
	}	

	const createCoursesTab = (courses) => {


		$.each(courses, (index, course) => {
			$img = $('<img>').addClass('card-img-top d-flex align-items-center justify-content-center img-fluid').attr('src', course.course_image || '../images/onlineCourses.png');
			$title = $('<h5></h5>').addClass('card-title d-flex align-items-center justify-content-start pb-0 mb-0').text(course.name);
			// $description = $('<p></p>').addClass('py-0 my-0')
			// 				.append(
			// 					$('<span></span>').addClass('span-heading').text(course.description || "No Description Available")
			// 				)
			// $sections = $('<div></div>').addClass('row container');
			// $.each(course.sections, (i, section) => {
			// 	$sectionSpan = $(`<span id="${section.id}" data-faculty="${section.faculty_section_id}" data-depart="${section.department_name}" data-depart-full=${section.department_fullname}></span>`)
			// 					.addClass('span-heading span-dept').text(section.name)
			// 	$sectionCol = $(`<div></div>`)
			// 					.addClass('col-auto')
			// 					.append($sectionSpan)
			// 	$sections.append($sectionCol);
			// });
			$cardBody = $('<div></div>').addClass('card-body p-2').append($title);
			$card = $('<div></div>').addClass('card position-relative mb-3 shadow-sm addCourseCard').append($img, $cardBody);
			$gotoCard = $('<a></a>').attr('href', `courseDetails.html?id=${course.subject_semester_id}`).append($card);
			$course = $('<div></div>').addClass('course col-lg-4 col-md-6 col-12 h-100').append($gotoCard);
			$('#courseList').append($course);

			if (courses && index == courses.length - 1 && courses.length > 3) {
			    $('#courseList').slick({
				  infinite: false,
				  speed: 300,
				  adaptiveHeight: true,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  arrows: true,	
				  responsive: [
					{
						breakpoint: 1920,
						settings: {
							slidesToShow: 4,
							slidesToScroll: 4,
							infinite: true
						}
					},
				    {
				      breakpoint: 1680,
				      settings: {
				        slidesToShow: 3,
				        slidesToScroll: 3,
				        infinite: true
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
				    // You can unslick at a given breakpoint now by adding:
				    // settings: "unslick"
				    // instead of a settings object
				  ]
			    });				
			} else if (courses && courses.length === 0) {
				$("#courseList").html("<div class='bg-white p-3'>No Courses Found!</div>");
			}
		});	
	}

	const createUpcomingTab = (upcomings) => {
		$('#upcoming').append('<ul></ul>');
		let text = "";		
		$.each(upcomings.objective_tests, (index, objective) => {
			if (objective.start_time)
				text = `Objective Test named ${objective.title} - ${objective.description} is going to start at ${objective.start_time}`;
			else 
				text = `Objective Test named ${objective.title} - ${objective.description} is going to end at ${objective.end_time}`;
		});
		$.each(upcomings.subjective_tests, (index, subjective) => {
			if (subjective.start_time)
				text = `Subjective Test named ${subjective.title} - ${subjective.description} is going to start at ${subjective.start_time}`;
			else 
				text = `Subjective Test named ${subjective.title} - ${subjective.description} is going to end at ${subjective.end_time}`;	
		});
		$.each(upcomings.vc, (index, videoConference) => {
			if (videoConference.start_time && new Date(videoConference.start_time.replace(/\s/, 'T')).getTime() - new Date().getTime() <= 5*60*1000)
				text = `Live Class named ${videoConference.title} - ${videoConference.description} is going to start at ${videoConference.start_time} <a href="${videoConference.url}" target="_blank"><i class="fas fa-external-link-alt"></i></a>`;
			else if (videoConference.start_time)
				text = `Live Class named ${videoConference.title} - ${videoConference.description} is going to start at ${videoConference.start_time}`;
			else 
				text = `Live Class named ${videoConference.title} - ${videoConference.description} is going to end at ${videoConference.end_time}`;		
		});				
		// $img = $('<img>').attr('src', peer.college_account_details.profile_pic).addClass('img-fluid');
		// $col1 = $('<div></div>').addClass('col-2').append($img);			
		$col2 = $('<div></div>').addClass('col-12').html(text);
		$row = $('<div></div>').addClass('row').append($col2);
		$li = $('<li></li>').append($row);
		$('#upcoming ul').append($li);			
	}


	let firstLoad = true;
	const activityTab = async (activities) => {
		for (let index = 0; index < activities.length; index++) {
			try {
				activity = activities[index];
				let act = ""
				followers[activity.id] = activity.followers;
				if (activity.type == 'Notification') {
					act = `<div class=" card px-3 py-3 mt-4">
						<div class="row">
						<div class="col-1 align-self-start"><img src="../images/notification.svg" class="img-fluid profile"></div>
						<div class="col-5 align-items-end"> <h3 class="title">${activity.title}</h3><small class="text-muted date">${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))}</small></div>
						<div class="col-6 d-flex justify-content-end"><a data-toggle="modal" data-target="#followed" data-id=${activity.id}> ${activity.followers.length} followers `
						for (let i = 0; i < 5; i++) {
							if (i < activity.followers.length) {
								let follower = activity.followers[i];
								if (follower.profile_pic && follower.profile_pic.length && ['jpeg', 'png', 'jpg', 'gif'].includes(follower.profile_pic.split('.').pop()))
									act += `<img src='${follower.profile_pic}' class="img-fluid ml-2" style="width: 25px; height: 25px; border-radius: 50%;">`;
							} else break;
						}
						act += '</a></div>'
						if (activity.file_url && activity.file_url.length > 4 && ['jpeg', 'png', 'jpg', 'gif'].includes(activity.file_url.split('.').pop()))
							act += `<div class="col-7 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div><div class="col-4 align-self-center d-flex align-items-center justify-content-center"><a href="${activity.file_url}" class="linkwrap" target="_blank"><img src="${activity.file_url}" class="img-fluid"></a></div>`;
						else if (activity.file_url && activity.file_url.length > 4)
							act += `<div class="col-7 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div><div class="col-4 align-self-center d-flex align-items-center justify-content-center"><a href="${activity.file_url}" class="text-dark" style="font-size: 30px;" target="_blank"><div class=""></div><i class="fas fa-file-pdf"></i></a></div>`;
						else
							act += `<div class="col-11 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div>`;
						act += `<div class="col-lg-3 col-md-6 mt-3 d-flex align-items-center justify-content-center"><a type="button"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</a></div>
						<div class="col-lg-3 col-md-6 mt-3 forward"><a type="button" data-toggle="modal" data-target="#comments" data-type="Notification" data-id=${activity.id}><img class="img-fluid mr-2" src="../images/messenger.svg"> ${typeof activity.comments_counts !== 'undefined'? activity.comments_counts: activity.comments_count} Comments</a></div>
						<div class="col-lg-3 col-md-6 mt-3 forward"><a type="button" data-toggle="modal" data-target="#forward" data-type="Notification" data-id=${activity.id}><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>
					</div>
				</div>`;
				} else if (activity.type == 'Test') {
					act = `<div class=" card px-3 py-3 mt-4">
					<div class="row">
						<div class="col-1 align-self-start"><img src="../images/Test.svg" class="img-fluid profile"></div>
						<div class="col-5 align-items-end"> <h3 class="title">${activity.title}</h3><small class="text-muted date">${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))}</small> <br></div>
						<div class="col-6 d-flex justify-content-end"><a data-toggle="modal" data-target="#followed" data-id=${activity.id}> ${activity.followers.length} followers `
						for (let i = 0; i < 5; i++) {
							if (i < activity.followers.length) {
								let follower = activity.followers[i];
								if (follower.profile_pic && follower.profile_pic.length && ['jpeg', 'png', 'jpg', 'gif'].includes(follower.profile_pic.split('.').pop()))
									act += `<img src='${follower.profile_pic}' class="img-fluid ml-2" style="width: 25px; height: 25px; border-radius: 50%;">`;
							} else break;
						}
						act += '</a></div>'
					if (new Date(activity.doe.replace(/\s/, 'T')) < new Date()) {
						if (activity.answered)
							act += `
								<div class="row col-12">
									<div class="col-md-11 mt-3 desc offset-1 col-12">
										A test name ${activity.title} was created on ${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))} and set to be expired on ${getFormattedDateTime(new Date(activity.doe.replace(/\s/, 'T')))}. The time duration of the test is ${activity.timelimit / 60} mins.
									</div>
									<div class="col-md-7 mt-3 desc offset-1 col-12">
										<div class="mt-3" style="max-height: 300px;">
											<canvas id="myChart${activity.id}"></canvas>
										</div>
									</div>
									<div class="col-md-4 col-12 mt-3 align-self-center">
										<h4 class="status">Student Understanding Level: ${activity.results.understanding_level}</h4>
										<a href="https://develop.createtest.edwisely.com/facaltytestdashboard?test_id=${activity.id}&token=${$user.token}" target="_blank" type="button" class="btn btn-primary">View Result</a>
									</div>
								</div>
							`;
						else {
							act += `<div class="col-7 offset-1 desc align-items-center justify-content-center">A test name ${activity.title} was created on ${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))} and set to be expired on ${getFormattedDateTime(new Date(activity.doe.replace(/\s/, 'T')))}. The time duration of the test is ${activity.timelimit / 60} mins.</div>`
							act += `<div class="col-4 status text-center align-self-center"><strong>Test Expired!</strong></div>`
						}
					} else {
						act += `
							<div class="col-11 offset-1 desc">
							A test name ${activity.title} was created on ${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))} and set to be expired on ${getFormattedDateTime(new Date(activity.doe.replace(/\s/, 'T')))}. The time duration of the test is ${activity.timelimit / 60} mins.
							</div>
						`;
					}
					
					act+= `<div class="col-lg-3 col-md-6 mt-3 align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
						<div class="col-lg-3 col-md-6 mt-3 answered align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#answered" data-type="Answered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.answered} Attempted</a></div>
						<div class="col-lg-3 col-md-6 mt-3 unanswered align-self-center d-flex align-items-center justify-content-center"><a type="button" style='white-space:nowrap' data-toggle="modal" data-target="#answered" data-type="Unanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.sent_to - activity.answered} Unattempted</a></div>
						<div class="col-lg-3 col-md-6 mt-3 forward align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#forward" data-type="questionnaire" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>				
					</div>
				</div>`;
				} else if (activity.type == 'VideoConference') {
					act = `<div class=" card px-3 py-3 mt-4">
					<div class="row">
						<div class="col-1 align-self-start"><img src="../images/Virtualclass.svg" class="img-fluid profile"></div>
						<div class="col-5 align-items-end"> <h3 class="title">${activity.title}</h3><small class="text-muted date">${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))}</small></div>
						<div class="col-6 d-flex justify-content-end"><a data-toggle="modal" data-target="#followed" data-id=${activity.id}> ${activity.followers.length} followers `
						for (let i = 0; i < 5; i++) {
							if (i < activity.followers.length) {
								let follower = activity.followers[i];
								if (follower.profile_pic && follower.profile_pic.length && ['jpeg', 'png', 'jpg', 'gif'].includes(follower.profile_pic.split('.').pop()))
									act += `<img src='${follower.profile_pic}' class="img-fluid ml-2" style="width: 25px; height: 25px; border-radius: 50%;">`;
							} else break;
						}
						act += '</a></div>'
					if (new Date(activity.end_time.replace(/\s/, 'T')) <= new Date())
						act += `<div class="col-7 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div><div class="col-4 text-center font-weight-bold status">Meeting Completed</div>`;
					else if (Math.abs(new Date(activity.start_time.replace(/\s/, 'T')).getTime() - new Date().getTime()) <= 10*60*1000)
						act += `<div class="col-12 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div><div class="col-11 offset-1 desc">The start time of the conference is ${getFormattedDateTime(new Date(activity.start_time.replace(/\s/, 'T')))} and end time is ${getFormattedDateTime(new Date(activity.end_time.replace(/\s/, 'T')))} <a href="${activity.url}" target="_blank"><i class="fas fa-external-link-alt"></i></a></div>`
					else 
						act += `<div class="col-12 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div><div class="col-11 offset-1 desc">The start time of the conference is ${getFormattedDateTime(new Date(activity.start_time.replace(/\s/, 'T')))} and end time is ${getFormattedDateTime(new Date(activity.end_time.replace(/\s/, 'T')))} (The link to meeting will activate only 10 mins before it starts)</div>`
					act += `<div class="col-lg-3 col-md-6 mt-3  align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
							<div class="col-lg-3 col-md-6 mt-3 forward"><a type="button" data-toggle="modal" data-target="#forward" data-type="videoConference" data-id=${activity.id}><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>			
				</div>
			</div>`;      		
				} else if (activity.type == 'Material') {
					// console.log(activity);
					act = `<div class=" card px-3 py-3 mt-4">
					<div class="row">
					<div class="col-1 align-self-start"><img src="../images/Material.svg" class="img-fluid profile"></div>
					<div class="col-5 align-items-end"> <h3>${activity.title}</h3><small class="text-muted date">${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))}</small></div>
					<div class="col-6 d-flex justify-content-end"><a data-toggle="modal" data-target="#followed" data-id=${activity.id}> ${activity.followers.length} followers `
						for (let i = 0; i < 5; i++) {
							if (i < activity.followers.length) {
								let follower = activity.followers[i];
								if (follower.profile_pic && follower.profile_pic.length && ['jpeg', 'png', 'jpg', 'gif'].includes(follower.profile_pic.split('.').pop()))
									act += `<img src='${follower.profile_pic}' class="img-fluid ml-2" style="width: 25px; height: 25px; border-radius: 50%;">`;
							} else break;
						}
						act += '</a></div>'
						let file_urls = JSON.parse(activity.file_url);
						if (file_urls.length === 0)
							act += `<div class="col-11 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div>`;
						else
							act += `<div class="col-7 offset-1 d-flex align-self-center"><p class="desc">${activity.description}</p></div><div class="col-4 align-self-center d-flex align-items-center justify-content-center">`
						$.each(file_urls, (index, file_url) => {
							if (file_url && file_url.length && ['jpeg', 'png', 'jpg', 'gif'].includes(file_url.split('.').pop()))
								act += `<a href="${file_url}" class="linkwrap mr-2" target="_blank"><img src="${file_url}" class="img-fluid"></a>`;
							else if (file_url && file_url.length)
								act += `<a href="${file_url}" class="text-dark mr-2" style="font-size: 30px;" target="_blank"><div class=""></div><i class="fas fa-file-pdf"></i></a>`;
							if (file_urls.length - 1 === index)
								act += `</div>`;
						});
					act += `<div class="col-lg-3 col-md-6 mt-3  align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
					<div class="col-lg-3 col-md-6 mt-3 forward"><a type="button" data-toggle="modal" data-target="#comments" data-type="Material" data-id=${activity.id}><img class="img-fluid mr-2" src="../images/messenger.svg"> ${typeof activity.comments_counts !== 'undefined'? activity.comments_counts: activity.comments_count} Comments</a></div>					
				</div>
			</div>`;		 
				} else if (activity.type == 'Feedback') {
					act = `<div class=" card px-3 py-3 mt-4">
					<div class="row">
						<div class="col-1 align-self-start"><img src="../images/Feedback.svg" class="img-fluid profile"></div>
						<div class="col-5 align-items-end"> <h3>${activity.title}</h3><small class="text-muted date">${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))}</small> <br> <!-- <p>${activity.description}</p> --></div>
						<div class="col-6 d-flex justify-content-end"><a data-toggle="modal" data-target="#followed" data-id=${activity.id}> ${activity.followers.length} followers `
						for (let i = 0; i < 5; i++) {
							if (i < activity.followers.length) {
								let follower = activity.followers[i];
								if (follower.profile_pic && follower.profile_pic.length && ['jpeg', 'png', 'jpg', 'gif'].includes(follower.profile_pic.split('.').pop()))
									act += `<img src='${follower.profile_pic}' class="img-fluid ml-2" style="width: 25px; height: 25px; border-radius: 50%;">`;
							} else break;
						}
						act += '</a></div>'
					if (new Date(activity.doe.replace(/\s/, 'T')) > new Date())
						act += `<div class="col-11 desc offset-1">A feedback named ${activity.title} has been created and set to expire on ${getFormattedDateTime(new Date(activity.doe.replace(/\s/, 'T')))}</div>`;
					else if (Number(activity.results.answered)) {
						act += `<div class="col-7 desc offset-1">A feedback named ${activity.title} has been created and set to expire on ${getFormattedDateTime(new Date(activity.doe.replace(/\s/, 'T')))}</div>`;
						act += `<div class="col-4 status text-center align-self-center"><strong>View Result</strong></div>`;
					} else {
						act += `<div class="col-7 desc offset-1">A feedback named ${activity.title} has been created and set to expire on ${getFormattedDateTime(new Date(activity.doe.replace(/\s/, 'T')))}</div>`;
						act += `<div class="col-4 status text-center align-self-center"><strong>Feedback Expired!</strong></div>`;
					}
					act += `<div class="col-lg-3 col-md-6 mt-3  align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
					<div class="col-lg-3 col-md-6 mt-3 forward"><img class="img-fluid mr-2" src="../images/messenger.svg"> ${typeof activity.comments_counts !== 'undefined'? activity.comments_counts: activity.comments_count} Comments</div>`				
					if (Number(activity.results.answered)) {
						act += `<div class="col-lg-3 col-md-6 mt-3 answered"><a type="button" data-toggle="modal" data-target="#answered" data-type="Answered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.results.answered} Answered</a></div>
						<div class="col-lg-3 col-md-6 mt-3 unanswered"><a type="button" data-toggle="modal" data-target="#answered" data-type="Unanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.results.unanswered} Unanswered</a></div>`
					}
				act += `</div>
			</div>`;
				} else if (activity.type == 'Subjective') {
					act = `<div class=" card px-3 py-3 mt-4">
					<div class="row">
						<div class="col-1 align-self-start"><img src="../images/Test.svg" class="img-fluid profile"></div>
						<div class="col-5 align-items-end"> <h3>${activity.title}</h3><small class="text-muted date">${getFormattedDateTime(new Date(activity.created_at.replace(/\s/, 'T')))}</small> <br><!-- <p>${activity.description}</p> --></div>
						<div class="col-6 d-flex justify-content-end"><a data-toggle="modal" data-target="#followed" data-id=${activity.id}> ${activity.followers.length} followers `
						for (let i = 0; i < 5; i++) {
							if (i < activity.followers.length) {
								let follower = activity.followers[i];
								if (follower.profile_pic && follower.profile_pic.length && ['jpeg', 'png', 'jpg', 'gif'].includes(follower.profile_pic.split('.').pop()))
									act += `<img src='${follower.profile_pic}' class="img-fluid ml-2" style="width: 25px; height: 25px; border-radius: 50%;">`;
							} else break;
						}
						act += '</a></div>'
					let starttime = new Date(activity.starttime.replace(/\s/, 'T'));
					let timelimit = activity.timelimit;
					let endtime = new Date(starttime.setTime(starttime.getTime() + timelimit*60*1000));

					if (endtime >= new Date()) {
						act += `<div class="col-11 offset-1 desc mt-3">A subjective test named ${activity.title} created and set to start at ${getFormattedDateTime(starttime)} with a time limit of ${timelimit} minutes.</div>`;
						act += `
								<div class="col-lg-3 col-md-6 mt-3 align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
								<div class="col-lg-3 col-md-6 mt-3 answered align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#answered" data-type="SubjectiveAnswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.answered} Attempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 unanswered align-self-center d-flex align-items-center justify-content-center"><a type="button" style='white-space:nowrap' data-toggle="modal" data-target="#answered" data-type="SubjectiveUnanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.sent_to - activity.answered} Unattempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 forward align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#forward" data-type="Subjective" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>					
							</div>
						</div>`;
					} else if (endtime < new Date() && !activity.evaluation_end_time.length) {
						if (activity.answered)
							act +=	`<div class="col-7 offset-1 desc mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}.</div>
							<div class="col-4 align-self-center d-flex">
								${ activity.answered? '': '<strong class="status">Test Expired</strong>'}
								<button type="button" data-toggle="modal" data-target="#p2p" data-id=${activity.id} class="btn btn-primary">Start P2P Evaluation</button></div>`;
						else
							act += `<div class="col-7 desc offset-1 mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. </div><div class="col-3 align-self-center">${ activity.answered? '': '<strong class="status">Test Expired</strong>'}</div>
							`;
						act += `
								<div class="col-lg-3 col-md-6 mt-3 align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
								<div class="col-lg-3 col-md-6 mt-3 answered align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#answered" data-type="SubjectiveAnswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.answered} Attempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 unanswered align-self-center d-flex align-items-center justify-content-center"><a type="button" style='white-space:nowrap' data-toggle="modal" data-target="#answered" data-type="SubjectiveUnanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.sent_to - activity.answered} Unattempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 forward align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#forward" data-type="Subjective" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>
									</div>
								</div>`;						
					} else if (endtime < new Date() && activity.evaluation_end_time.length && new Date(activity.evaluation_end_time.replace(/\s/, 'T')) > new Date()) {
						act += `<div class="col-11 offset-1 desc mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. The student peer evaluation started at ${getFormattedDateTime(new Date(activity.evaluation_started_time.replace(/\s/, 'T')))} and will complete at ${getFormattedDateTime(new Date(activity.evaluation_end_time.replace(/\s/, 'T')))}.</div>`;
						act += `
								<div class="col-lg-3 col-md-6 mt-3 align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
								<div class="col-lg-3 col-md-6 mt-3 answered align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#answered" data-type="SubjectiveAnswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.answered} Attempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 unanswered align-self-center d-flex align-items-center justify-content-center"><a type="button" style='white-space:nowrap' data-toggle="modal" data-target="#answered" data-type="SubjectiveUnanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.sent_to - activity.answered} Unattempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 forward align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#forward" data-type="Subjective" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>					
							</div>
						</div>`;						
					} else if (activity.evaluation_end_time.length && new Date(activity.evaluation_end_time.replace(/\s/, 'T')) <= new Date() && !activity.results_release_time.length) {
						act += `<div class="col-7 mt-3 desc offset-1 align-self-center">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. The student peer evaluation has been completed. You can now start reviewing the student evaluations and release the results.</div>`;
						act += `<div class="col-4 row align-self-center">
									<div class="col-12"><a href="https://develop.createtest.edwisely.com/subjectiveevaluation?test_id=${activity.id}&token=${$user.token}" target="_blank" type="button" class="btn btn-primary">Start Evaluation</a></div>
									<div class="col-12 mt-3"><a onclick="releaseResult(${activity.id})" target="_blank" type="button" class="btn btn-danger">Release Result</a></div>
								</div>`
						act += `
								<div class="col-lg-3 col-md-6 mt-3  align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
								<div class="col-lg-3 col-md-6 mt-3 answered"><a type="button" data-toggle="modal" data-target="#answered" data-type="SubjectiveAnswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.answered} Attempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 unanswered"><a type="button" style='white-space:nowrap' data-toggle="modal" data-target="#answered" data-type="SubjectiveUnanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.sent_to - activity.answered} Unattempted</a></div>
								<div class="col-lg-3 col-md-6 mt-3 forward"><a type="button" data-toggle="modal" data-target="#forward" data-type="Subjective" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</a></div>					
							</div>
						</div>`;
					} else if (activity.results_release_time.length) {
						act += `<div class="col-7 mt-3 desc align-self-center offset-1">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. The results are released, you can check them now.</div>
						<div class="col-4 align-self-center"><a href="https://develop.createtest.edwisely.com/facultysubjectivetestdashboard?test_id=${activity.id}&token=${$user.token}" target="_blank" type="button" class="btn btn-primary">View Result</a></div>`;
						act += `
								<div class="col-lg-3 col-md-6 mt-3 align-self-center d-flex align-items-center justify-content-center"><img class="img-fluid mr-2" src="../images/send.svg"> ${activity.sent_to} Send To</div>
								<div class="col-lg-3 col-md-6 mt-3 answered align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#answered" data-type="SubjectiveAnswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/tick.svg"> ${activity.answered} Attempted</button></div>
								<div class="col-lg-3 col-md-6 mt-3 unanswered align-self-center d-flex align-items-center justify-content-center"><a type="button" style='white-space:nowrap' data-toggle="modal" data-target="#answered" data-type="SubjectiveUnanswered" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/cross.svg"> ${activity.sent_to - activity.answered} Unattempted</button></div>
								<div class="col-lg-3 col-md-6 mt-3 forward align-self-center d-flex align-items-center justify-content-center"><a type="button" data-toggle="modal" data-target="#forward" data-type="Subjective" data-id=${activity.id} ><img class="img-fluid mr-2" src="../images/share.svg"> Forward To</button></div>
							</div>
						</div>`;
					}					
				}
				$('#activity').append(act);
				if (activity.type == 'Test' && activity.answered) {
					var ctx = document.getElementById(`myChart${activity.id}`).getContext('2d');
					var myChart = new Chart(ctx, {
						type: 'doughnut',
						data: {
							labels: [`>80 -${activity.results.percentage_very_good}`, `70-80 -${activity.results.percentage_good}`, `60-70 -${activity.results.percentage_average}`, `<60 -${activity.results.percentage_below_average}`],
							datasets: [{
								// label: `Student Understanding Level: ${activity.results.understanding_level}`,
								data: [activity.results.percentage_very_good, activity.results.percentage_good, activity.results.percentage_average, activity.results.percentage_below_average],
								backgroundColor: [
									'rgba(255, 99, 132, 0.2)',
									'rgba(54, 162, 235, 0.2)',
									'rgba(255, 206, 86, 0.2)',
									'rgba(75, 192, 192, 0.2)'
								],
								borderColor: [
									'rgba(255, 99, 132, 1)',
									'rgba(54, 162, 235, 1)',
									'rgba(255, 206, 86, 1)',
									'rgba(75, 192, 192, 1)'
								],
								borderWidth: 1
							}]
						},
						options: {
							responsive: true,
							legend: {
								position: 'right',
							},
							// title: {
							// 	display: true,
							// 	text: `Student Understanding Level: ${activity.results.understanding_level}`
							// },
							animation: {
								animateScale: true,
								animateRotate: true
							}
						}
					});					

				}
			} catch (error) {
				console.log(error);
			}
		}
		if ((firstLoad && activities.length) || !firstLoad) {
			firstLoad = false;
			$('#activity').append('<a href="javascript:void(0)" id="viewactivity">View More</a>');
		} else {
			$("#activity").html("<div class='bg-white p-3'>No Activities Found!</div>");
		}
		$(".loader-wrapper").addClass("d-none");
	}


	const createPeersTab = (peers) => {
		$.each(peers, (index, peer) => {
			let type = "";
			let role_name = peer.role.role_name;
			let faculty_name = peer.college_account_details.faculty_name;
			let title = peer.title;
			let description = peer.description;
			let sent_to = peer.sent_to;
			let start_time = peer.start_time;
			let end_time = peer.end_time;

			if (peer.type == 'Subjective') {
				type = 'subjective test';
				text = `${role_name} ${faculty_name} has created a ${type} named ${title} - ${description} for ${sent_to} students`;
				if (new Date(peer.starttime.replace(/\s/, 'T')) > new Date())
					text += `, which starts at ${peer.starttime} and total time is ${peer.timelimit}.`;
				else if (new Date(peer.results_release_time.replace(/\s/, 'T')) < new Date())
					text += `, for which results are released at ${peer.results_release_time}`;
				else if (new Date(peer.evaluation_started_time.replace(/\s/, 'T')) < new Date())
					text += `, for which evaluation started at ${peer.evaluation_started_time}`;
		    } else if (peer.type == 'Test') {
				type = 'test';
				text = `${role_name} ${faculty_name} has created a ${type} named ${title} - ${description} for ${sent_to} students, with doe ${peer.doe}.`;
			} else if (peer.type == 'VideoConference') {
				type = 'live class';
				text = `${role_name} ${faculty_name} has created a ${type} named ${title} - ${description} for ${sent_to} students, which starts at ${start_time} and ends at ${end_time}.`;
			} else if (peer.type == 'Notification') {
				type = 'notification'
				text = `${role_name} ${faculty_name} has created a ${type} named ${title} - ${description} for ${sent_to} students.`;
			} else {
				type = 'material';
			}
			$img = $('<img>').attr('src', peer.college_account_details.profile_pic).addClass('img-fluid');
			$col1 = $('<div></div>').addClass('col-2 mt-1').append($img);
			$col2 = $('<div></div>').addClass('col-10 pl-0 desc m-0').text(text);
			$row = $('<div></div>').addClass('row mb-3').append($col1, $col2);
			$('#peer').append($row);
		});
		if (peers && peers.length > 0) {
			$('#peer').append('<a href="peerData.html" id="viewpeer">View More</a>');
		} else {
			$("#peer").html("No Peer Activities Found!");
		}
	}	

	try {
		let faculty = await facultyData(30, getFormattedDateTime(new Date()));
		date_lt = faculty.date_lt;
		createCoursesTab(faculty.courses, faculty.upcoming_events.length);
		if (faculty.upcoming_events && faculty.upcoming_events.length)
			createUpcomingTab(faculty.upcoming_events);
		else {
			$('.upcome').remove();
		}
		activityTab(faculty.activity_tab);
		let peers = await peerData(10, getFormattedDateTime(new Date()));
		createPeersTab(peers);

		// Load the add follower modal
		const collegeDepartments = await getDepartments($user.college_id);
		for (let i = 0; i < collegeDepartments.length; i++) {
			const collegeDepartment = collegeDepartments[i];
			const tabNumber = collegeDepartment.college_university_degree_department_id;
			$('#myTab').append(`<li class="nav-item my-2 col-md-4 col-6">
				<a class="nav-link ${first? 'active':''}" id="t${tabNumber}-tab" data-toggle="tab" href="#t${tabNumber}" aria-selected="true">${collegeDepartment.department}</a>
			</li>`);
			const colleagues = await getColleagues($user.college_id, tabNumber);
			$('#myTabContent').append(`<div class="tab-pane fade ${first? 'show active': ''}" id="t${tabNumber}" role="tabpanel" aria-labelledby="t${tabNumber}-tab"></div>`);
			if (colleagues.length) {
				$(`#t${tabNumber}`).append(`<div class="form-check border rounded mb-2">
					<label class="form-check-label" for="select${tabNumber}">SELECT ALL</label>
					<input style="float: right;right: 10px;" name="selectAll" data-tab=${tabNumber} type="checkbox" class="form-check-input selectAll" id="select${tabNumber}">
					</div><div class="student-list"></div>`)
				$.each( colleagues, (index, colleague) => {
					$(`#t${tabNumber} .student-list`).append(`<div class="form-check single border rounded mb-2">
	                                  <label class="form-check-label" for="exampleCheck${selectNumber}">${colleague.role_name} - ${colleague.first_name} ${colleague.last_name}</label>
	                                  <input style="float: right;right: 10px;" name="students[]" value="${colleague.id}" type="checkbox" class="form-check-input" id="exampleCheck${selectNumber++}">
	                                </div>`);
				});
			} else {
				$(`#t${tabNumber}`).text('No faculties in this department');
			}
			first = false;
		}

	} catch (error) {
		console.log(error);
	}

	$('#activity').on('click', '#viewactivity', async () => {
		try {
			$('#activity #viewactivity').remove();
			let faculty = {
				activity_tab: "",
			}
			while (!faculty.activity_tab.length) {
				faculty = await facultyData(30, getFormattedDateTime(new Date(date_lt.replace(/\s/, 'T'))));
				date_lt = faculty.date_lt;
			}
			activityTab(faculty.activity_tab);
		} catch (error) {
			console.log(error);
		}
	});

	$('#answered').on('show.bs.modal', async function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var id = button.data('id');
		var type = button.data('type'); // Extract info from data-* attributes
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		var modal = $(this);
		modal.find('.modal-body ul').html("Loading...");
		const students = await answeredStudents(id, type);
		let list = "<table class='table table-bordered'><tr><th>Roll No.</th><th>Student Name</th></tr>"
		$.each(students, (index, student) => {
			list += `<tr><td>${student.roll_number}</td><td>${student.name}</td><tr>`;
		})
		list += "</table>";
		// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		modal.find('.modal-title').text(`${type} Students`);
		list = list ? list : `No ${type.replace(/([A-Z])/g, ' $1')} Students Found`
		modal.find('.modal-body ul').html(list);
	});

	$('#forward').on('show.bs.modal', async function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var id = button.data('id');
		var type = button.data('type'); // Extract info from data-* attributes
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		var modal = $(this);
		modal.find('#forwardId').val(id);
		modal.find('#forwardType').val(type);
	});	  

	$('#comments').on('shown.bs.modal', function (event) {
		$(this).animate({ scrollTop: $(this).find('.modal-content').height() }, 'slow');
	});	

	$('#comments').on('show.bs.modal', async function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var id = button.data('id');
		var type = button.data('type'); // Extract info from data-* attributes
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		var modal = $(this);
		modal.find('.modal-body .chat-history ul').html("Loading...");
		const comments = await getComments(id, type);
		let list = ''
		$.each(comments, (index, comment) => {
			if (comment.college_account_id == $user.user_id || comment.student_id == $user.user_id) {
				list += `
				<li class="clearfix">
					<div class="message-data align-right">
						<time class="timeago" datetime="${jQuery.timeago(new Date(comment.created_at.replace(/\s/, 'T')))}">${jQuery.timeago(new Date(comment.created_at.replace(/\s/, 'T')))}</time> &nbsp; &nbsp;
				  		<span class="message-data-name" >You</span> <i class="fa fa-circle me"></i>
					</div>
					<div class="message other-message float-right">
						${comment.comment}
					</div>
			 	</li>				
				`;
			} else {
				list += `
				<li>
					<div class="message-data">
				  		<span class="message-data-name"><i class="fa fa-circle online"></i> ${comment.college_account ? comment.college_account.first_name: comment.student.name} </span>
				  		<time class="timeago" datetime="${jQuery.timeago(new Date(comment.created_at.replace(/\s/, 'T')))}">${jQuery.timeago(new Date(comment.created_at.replace(/\s/, 'T')))}</time>
					</div>
					<div class="message my-message">
						${comment.comment}
					</div>
				</li>				
				`;
			}
		})
		// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		modal.find('.modal-title').text(`${type} Comments`);
		modal.find('input#type').val(type);
		modal.find('input#id').val(id);
		list = list ? list : ``;
		modal.find('.modal-body .chat-history ul').html(list);
	});


	$('#p2p').on('show.bs.modal', async function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var id = button.data('id');
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		var modal = $(this);
		modal.find('input#resultId').val(id);
	});

	$('#followed').on('show.bs.modal', async function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var id = button.data('id');
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		var modal = $(this);
		var list = '';
		$.each(followers[id], (index, follower) => {
			list += `<div class="col-12 mb-3"><img src="${follower.profile_pic}" class="img-fluid" style="width: 40px; height: 40px; border-radius: 50%"> ${follower.faculty_name} (${follower.role_name})</div>`
		});
		list = list ? list : ``;
		modal.find('div.row').html(list);
	});	

	$('#endtime').datetimepicker({
		minDate: new Date(),
		dateFormat: 'dd M yy', 
		timeFormat: 'HH:mm:ss'
	});

	$('#startP2p').click(function() {
		let endDate = getFormattedDateTime(new Date($('#endtime').val()));
		let id = $('#resultId').val();
		if (endDate.length) {
			$('#startP2p').remove();
			startP2p(id, endDate);
		} else {
			$('span.errorp2p').text('Please Select End Time');
		}
	});

	$('#forwardBtn').click(async function() {
		let college_account_ids = '';
		let type = $('#forwardType').val();
		let id = $('#forwardId').val();
		$(`.single input:checkbox:checked`).each(function () {
			college_account_ids += `${$(this).val()},`;
		});
		college_account_ids = college_account_ids.slice(0, -1);
		try {
			let result = ''
			if (type === 'Subjective')
				result = await subjectiveFollower(id, college_account_ids);
			else
				result = await otherFollowers(type, id, college_account_ids);
			if (result.status == 200) {
				$.cookie('status', 'success');
				$.cookie('message', 'Successfully Added Follower');
		  		window.location.replace('index.html');				
			}
		} catch(error) {
			console.log(error);
		}
	});
});