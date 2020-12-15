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

	var url_string = window.location.href;
	var url = new URL(url_string);
	var status = url.searchParams.get("status");
	var message = url.searchParams.get("message");
	if (status) {
	  if (message == "notify")
		$('.alert strong').text('Successfully added Notification!');
	  else if (message == "liveclass")
		$('.alert strong').text('Successfully added Live Class');      
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
			        success: function (result1) {
						// alert(result.status);
						$.ajax({
							url: `https://stagingfacultypython.edwisely.com/college/getPeersDashboardData?from_date=${from_date}&delta_days=${delta_days}`,
							type: 'GET',
							contentType: 'application/json',
							headers: {
								'Authorization': `Bearer ${$user.token}`
							},
							success: function (result2) {
								// alert(result.status);
								result = [...result1.college_notifications, ...result2.college_notifications];
								resolve(result);
							},
							error: function (error) {
								console.log(error);
								reject(error);
							}
						});						
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

	const activityTab = (activities) => {
		$.each(activities, (index, activity) => {
			let act = ""
			if (activity.type == 'Notification') {
	            act = `<div class=" card px-3 py-3 mt-2">
	                <div class="row">
	                  <div class="col-1"><img src="${activity.thumb_url}" class="img-fluid"></div>
	                  <div class="col-10">${activity.title}</div>
	                  <div class="col-1"><a href="#" title="${activity.followers[0].faculty_name}"><img src="${activity.followers[0].profile_pic}" class="img-fluid"></a></div>
	                  <div class="col-12">
	                      ${activity.description}
	                  </div>
	                  <div class="col-12 py-3"></div>
	                  <div class="col-3"><button class="btn btn-lg btn-primary" style="width: fit-content; white-space: nowrap;">Send to </button></div>
	                  <div class="col-3"><button class="btn btn-lg btn-success" style="width: fit-content; white-space: nowrap;">Attempted </button></div>
	                  <div class="col-3"><button class="btn btn-lg btn-danger" style="width: fit-content; white-space: nowrap;">Not Attempted</button></div>
	                  <div class="col-3"><button class="btn btn-lg btn-warning" style="width: fit-content; white-space: nowrap;">Forward to  </button></div>
	                </div>
	             </div>`;
         	} else if (activity.type == 'Test' || activity.type == 'Subjective') {
         		act = `<div class=" card px-3 py-3 mt-2">
                  <div class="row">
                    <div class="col-1"><img src="${activity.college_account_details.profile_pic}" class="img-fluid"></div>
                    <div class="col-10">${activity.title}</div>
                    <div class="col-1"><a href="#" title="${activity.followers[0].faculty_name}"><img src="${activity.followers[0].profile_pic}" class="img-fluid"></a></div>
                    <div class="col-12">
                        ${activity.description}
                    </div>
                    <div class="col-12 py-3"></div>
                    <div class="col-3">Send to ${activity.sent_to} </div>
                    <div class="col-3">Follower ${activity.followers.length} </div>
                  </div>
               </div>`;
         	} else if (activity.type == 'VideoConference') {
         		act = `<div class=" card px-3 py-3 mt-2">
                  <div class="row">
                    <div class="col-1"><img src="${activity.college_account_details.profile_pic}" class="img-fluid"></div>
                    <div class="col-10">${activity.title}</div>
                    <div class="col-1"><a href="#" title="${activity.followers[0].faculty_name}"><img src="${activity.followers[0].profile_pic}" class="img-fluid"></a></div>
                    <div class="col-12">
                        ${activity.description}
                    </div>
                    <div class="col-12 py-3"></div>
                    <div class="col-3">Send to ${activity.sent_to} </div>
                    <div class="col-3">${activity.followers.length} Comments</div>
                  </div>
               </div>`;         		
         	}
         	$('#activity').append(act);
		});
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
	}	

	try {
		console.log(getFormattedDateTime(new Date()));
		let faculty = await facultyData(10, getFormattedDateTime(new Date()));
		createCoursesTab(faculty.courses);
		createUpcomingTab(faculty.upcoming_events);
		activityTab(faculty.activity_tab);
		let peers = await peerData(10, getFormattedDateTime(new Date()));
		createPeersTab(peers);
	} catch (error) {
		console.log(error);
	}
});