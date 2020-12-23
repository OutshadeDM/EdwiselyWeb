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
		  console.log(url);
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
					console.log(result);
					$.cookie('status', 'success');
					$.cookie('message', 'Successfully released the result');
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

$user = "";
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

	// Get faculty data function
	const facultyData = (delta_days, from_date="", to_date="") => {
		console.log(from_date);
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
		$('alert strong').text(message);
	  $('.alert').addClass(`alert-${status}`);
	  $('.alert').removeClass('d-none');
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
						console.log(result);
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
						console.log(result);
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

	const createCoursesTab = (courses) => {


		$.each(courses, (index, course) => {
			$img = $('<img>').addClass('card-img-top img-fluid py-2').attr('src', course.course_image || '../images/onlineCourses.png');
			$title = $('<h5></h5>').addClass('card-title font-weight-bold pb-0 mb-0').text(course.name);
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

			if (index == courses.length - 1) {
			    $('#courseList').slick({
				  infinite: false,
				  speed: 300,
				  adaptiveHeight: true,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  arrows: true,	
				  responsive: [
				    {
				      breakpoint: 1024,
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
			if (videoConference.start_time && new Date(videoConference.start_time).getTime() - new Date().getTime() <= 5*60*1000)
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

	const activityTab = async (activities) => {
		for (let index = 0; index < activities.length; index++) {
			try {
				activity = activities[index];
				let act = ""
				console.log(activity.id);
				if (activity.type == 'Notification') {
					act = `<div class=" card px-3 py-3 mt-2">
						<div class="row">
						<div class="col-auto align-self-start"><img src="https://ui-avatars.com/api/?name=Notification&background=81d4fa&length=1&size=40&rounded=true&color=fff" class="img-fluid profile"></div>
						<div class="col-7 align-items-end"> <h3>${activity.title}</h3><small class="text-muted">${getFormattedDateTime(new Date(activity.created_at))}</small> <br> <p>${activity.description}</p></div>
						<div class="col-auto">${activity.followers.length} followers </div>`
						if (activity.file_url && activity.file_url.length && ['jpeg', 'png', 'jpg', 'gif'].includes(activity.file_url.split('.').pop()))
							act += `<div class="col-12 d-flex align-items-center justify-content-center"><a href="${activity.file_url}" class="linkwrap" target="_blank"><img width="300" height="500" src="${activity.file_url}" class="img-fluid"></a></div>`;
						else if (activity.file_url && activity.file_url.length)
							act += `<div class="col-12 d-flex align-items-center justify-content-center"><a href="${activity.file_url}" class="text-dark" style="font-size: 30px;" target="_blank"><div class=""></div><i class="fas fa-file-pdf"></i></a></div>`;
						act += `<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>
						<div class="col-3 mt-3 forward"><button type="button" data-toggle="modal" data-target="#comments" data-type="Notification" data-id=${activity.id} class="btn btn-light"><i class="fas fa-comments"></i> ${typeof activity.comments_counts !== 'undefined'? activity.comments_counts: activity.comments_count} Comments</button></div>					
					</div>
				</div>`;
				} else if (activity.type == 'Test') {
					act = `<div class=" card px-3 py-3 mt-2">
					<div class="row">
						<div class="col-auto align-self-start"><img src="https://ui-avatars.com/api/?name=Test&background=ff3d00&length=1&size=40&rounded=true&color=fff" class="img-fluid profile"></div>
						<div class="col-7 align-items-end"> <h3>${activity.title}</h3><small class="text-muted">${getFormattedDateTime(new Date(activity.created_at))}</small> <br> <p>${activity.description}</p></div>
						<div class="col-auto">${activity.followers.length} followers </div>`;
					
					if (new Date(activity.doe) < new Date()) {
						if (activity.answered)
							act += `
								<div class="row col-12">
									<div class="col-md-8 col-12">
										<canvas id="myChart${activity.id}" width="400" height="400"></canvas>
									</div>
									<div class="col-md-4 col-12 align-self-center">
										<a href="https://develop.createtest.edwisely.com/facaltytestdashboard?test_id=${activity.id}&token=${$user.token}" target="_blank" type="button" class="btn btn-primary">View Result</a>
									</div>
								</div>
							`;
						else
							act += `<div class="col-12 text-center"><strong class="text-danger">Teat Expired!</strong></div>`
					} else {
						act += `
							<div class="col-12">
								${activity.role.role_name} - ${activity.college_account_details.faculty_name} has created a ${activity.type} named ${activity.title} - ${activity.description} for ${activity.sent_to} students, with doe ${getFormattedDateTime(new Date(activity.doe))}.
							</div>
						`;
					}
					
					act+= `<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>
						<div class="col-3 mt-3 answered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Answered" data-id=${activity.id} class="btn btn-light"><i class="far fa-check-square"></i> ${activity.answered} Attempted</button></div>
						<div class="col-3 mt-3 unanswered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Unanswered" data-id=${activity.id} class="btn btn-light"><i class="far fa-window-close"></i> ${activity.sent_to - activity.answered} Unattempted</button></div>
						<div class="col-3 mt-3 forward"><i class="fas fa-share-square"></i> Forward To</div>					
					</div>
				</div>`;
				} else if (activity.type == 'VideoConference') {
					act = `<div class=" card px-3 py-3 mt-2">
					<div class="row">
						<div class="col-auto align-self-start"><img src="https://ui-avatars.com/api/?name=Video+Conference&background=aa00ff&length=2&size=40&rounded=true&color=fff" class="img-fluid profile"></div>
						<div class="col-7 align-items-end"> <h3>${activity.title}</h3><small class="text-muted">${getFormattedDateTime(new Date(activity.created_at))}</small> <br> <p>${activity.description}</p></div>
						<div class="col-auto">${activity.followers.length} followers </div>`;
					if (new Date(activity.end_time) <= new Date())
						act += `<div class="col-12 text-center font-weight-bold text-danger">Meeting Completed</div>`;
					else if (Math.abs(new Date(activity.start_time).getTime() - new Date().getTime()) <= 10*60*1000)
						act += `<div class="col-12 text-success font-weight-bold">The start time of the conference is ${getFormattedDateTime(new Date(activity.start_time))} and end time is ${getFormattedDateTime(new Date(activity.end_time))} <a href="${videoConference.url}" target="_blank"><i class="fas fa-external-link-alt"></i></a></div>`
					else 
						act += `<div class="col-12 text-center font-weight-bold">The start time of the conference is ${getFormattedDateTime(new Date(activity.start_time))} and end time is ${getFormattedDateTime(new Date(activity.end_time))} (The link to meeting will activate only 10 mins before it starts)</div>`
					act += `<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>					
				</div>
			</div>`;      		
				} else if (activity.type == 'Material') {
					console.log(activity.file_url, activity.file_url.length)
					act = `<div class=" card px-3 py-3 mt-2">
					<div class="row">
					<div class="col-auto align-self-start"><img src="https://ui-avatars.com/api/?name=Material&background=81d4fa&length=1&size=40&rounded=true&color=fff" class="img-fluid profile"></div>
					<div class="col-7 align-items-end"> <h3>${activity.title}</h3><small class="text-muted">${getFormattedDateTime(new Date(activity.created_at))}</small> <br> <p>${activity.description}</p></div>
					<div class="col-auto">${activity.followers.length} followers </div>`
					if (activity.file_url && activity.file_url.length && ['jpeg', 'png', 'jpg', 'gif'].includes(activity.file_url.split('.').pop()))
						act += `<div class="col-12 d-flex align-items-center justify-content-center"><a href="${activity.file_url}" class="linkwrap" target="_blank"><img width="300" height="500" src="${activity.file_url}" class="img-fluid"></a></div>`;
					else if (activity.file_url && activity.file_url.length)
						act += `<div class="col-12 d-flex align-items-center justify-content-center"><a href="${activity.file_url}" class="text-dark" style="font-size: 30px;" target="_blank"><div class=""></div><i class="fas fa-file-pdf"></i></a></div>`;
					act += `<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>
					<div class="col-3 mt-3 forward"><button type="button" data-toggle="modal" data-target="#comments" data-type="Notification" data-id=${activity.id} class="btn btn-light"><i class="fas fa-comments"></i> ${typeof activity.comments_counts !== 'undefined'? activity.comments_counts: activity.comments_count} Comments</button></div>					
				</div>
			</div>`;		 
				} else if (activity.type == 'Subjective') {
					act = `<div class=" card px-3 py-3 mt-2">
					<div class="row">
						<div class="col-auto align-self-start"><img src="https://ui-avatars.com/api/?name=Subjective&background=0056b3&length=1&size=40&rounded=true&color=fff" class="img-fluid profile"></div>
						<div class="col-7 align-items-end"> <h3>${activity.title}</h3><small class="text-muted">${getFormattedDateTime(new Date(activity.created_at))}</small> <br> <p>${activity.description}</p></div>
						<div class="col-auto">${activity.followers.length} followers </div>`;
					let starttime = new Date(activity.starttime);
					let timelimit = activity.timelimit;
					let endtime = new Date(starttime.setTime(starttime.getTime() + timelimit*60*1000));

					if (endtime >= new Date()) {
						act += `<div class="col-12 mt-3">A subjective test named ${activity.title} created and set to start at ${getFormattedDateTime(starttime)} with a time limit of ${timelimit} minutes.</div>`;
					} else if (endtime < new Date() && !activity.evaluation_end_time.length) {
						act += `<div class="col-12 mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. ${ activity.answered? '': '<strong class="text-danger">(Test Expired)</strong>'}</div>`;
						act += `
								<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>
								<div class="col-3 mt-3 answered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Answered" data-id=${activity.id} class="btn btn-light"><i class="far fa-check-square"></i> ${activity.answered} Attempted</button></div>
								<div class="col-3 mt-3 unanswered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Unanswered" data-id=${activity.id} class="btn btn-light"><i class="far fa-window-close"></i> ${activity.sent_to - activity.answered} Unattempted</button></div>`;
						if (activity.answered)
						act +=	`<div class="col-3 mt-3"><button type="button" data-toggle="modal" data-target="#p2p" data-id=${activity.id} class="btn btn-primary">Start P2P Evaluation</button></div>				
							</div>`
						act += `</div>`;						
					} else if (endtime < new Date() && activity.evaluation_end_time.length && new Date(activity.evaluation_end_time) > new Date()) {
						act += `<div class="col-12 mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. The student peer evaluation started at ${new Date(activity.evaluation_started_time)} and will complete at ${new Date(activity.evaluation_end_time)}.</div>`
					} else if (activity.evaluation_end_time.length && new Date(activity.evaluation_end_time) <= new Date() && !activity.results_release_time.length) {
						act += `<div class="col-12 mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. The student peer evaluation has been completed. You can now start reviewing the student evaluations and release the results.</div>`
						act += `
								<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>
								<div class="col-3 mt-3 answered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Answered" data-id=${activity.id} class="btn btn-light"><i class="far fa-check-square"></i> ${activity.answered} Attempted</button></div>
								<div class="col-3 mt-3 unanswered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Unanswered" data-id=${activity.id} class="btn btn-light"><i class="far fa-window-close"></i> ${activity.sent_to - activity.answered} Unattempted</button></div>
								<div class="col-3 mt-3"><a href="https://develop.createtest.edwisely.com/subjectiveevaluation?test_id=${activity.id}&token=${$user.token}" target="_blank" type="button" class="btn btn-primary">Start Evaluation</a></div>
								<div class="col-3 mt-3"><a onclick="releaseResult(${activity.id})" target="_blank" type="button" class="btn btn-danger">Release Result</a></div>					
							</div>
						</div>`;
					} else if (activity.results_release_time.length) {
						act += `<div class="col-12 mt-3">A subjective test named ${activity.title} created and completed at ${getFormattedDateTime(endtime)}. The results are released, you can check them now.</div>`;
						act += `
								<div class="col-3 mt-3"><i class="fab fa-telegram-plane"></i> ${activity.sent_to} Send To</div>
								<div class="col-3 mt-3 answered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Answered" data-id=${activity.id} class="btn btn-light"><i class="far fa-check-square"></i> ${activity.answered} Attempted</button></div>
								<div class="col-3 mt-3 unanswered"><button type="button" data-toggle="modal" data-target="#answered" data-type="Unanswered" data-id=${activity.id} class="btn btn-light"><i class="far fa-window-close"></i> ${activity.sent_to - activity.answered} Unattempted</button></div>
								<div class="col-3 mt-3"><a href="https://develop.createtest.edwisely.com/facultysubjectivetestdashboard?test_id=${activity.id}&token=${$user.token}" target="_blank" type="button" class="btn btn-primary">View Result</a></div>					
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
								label: `Student Understanding Level: ${activity.results.understanding_level}`,
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
								position: 'top',
							},
							title: {
								display: true,
								text: `Student Understanding Level: ${activity.results.understanding_level}`
							},
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
		$('#activity').append('<a href="javascript:void(0)" id="viewactivity">View More</a>');
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
				console.log(peer.starttime);
				if (new Date(peer.starttime) > new Date())
					text += `, which starts at ${peer.starttime} and total time is ${peer.timelimit}.`;
				else if (new Date(peer.results_release_time) < new Date())
					text += `, for which results are released at ${peer.results_release_time}`;
				else if (new Date(peer.evaluation_started_time) < new Date())
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
			$col1 = $('<div></div>').addClass('col-2').append($img);
			$col2 = $('<div></div>').addClass('col-10').text(text);
			$row = $('<div></div>').addClass('row mb-3').append($col1, $col2);
			$('#peer').append($row);
		});
		$('#peer').append('<a href="peerData.html" id="viewpeer">View More</a>');
	}	

	try {
		console.log(getFormattedDateTime(new Date()));
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
				faculty = await facultyData(30, getFormattedDateTime(new Date(date_lt)));
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
		let list = ''
		$.each(students, (index, student) => {
			list += `<li><strong>${student.student_id}</strong> - ${student.name}</li>`;
		})
		// Update the modal's content. We'll use jQuery here, but you could use a data binding library or other methods instead.
		modal.find('.modal-title').text(`${type} Students`);
		list = list ? list : `No ${type} Students Found`
		modal.find('.modal-body ul').html(list);
	  });

	  $('#comments').on('show.bs.modal', async function (event) {
		var button = $(event.relatedTarget) // Button that triggered the modal
		var id = button.data('id');
		var type = button.data('type'); // Extract info from data-* attributes
		// If necessary, you could initiate an AJAX request here (and then do the updating in a callback).
		var modal = $(this);
		modal.find('.modal-body .chat-history ul').html("Loading...");
		const comments = await getComments(id, type);
		console.log(comments);
		let list = ''
		$.each(comments, (index, comment) => {
			if (comment.college_account_id == $user.user_id || comment.student_id == $user.user_id) {
				list += `
				<li class="clearfix">
					<div class="message-data align-right">
						<time class="timeago" datetime="${jQuery.timeago(new Date(comment.created_at))}">${jQuery.timeago(new Date(comment.created_at))}</time> &nbsp; &nbsp;
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
				  		<time class="timeago" datetime="${jQuery.timeago(new Date(comment.created_at))}">${jQuery.timeago(new Date(comment.created_at))}</time>
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
});