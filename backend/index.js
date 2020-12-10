$(async function() {
	// Check if User is logged in
	$user = "";
	if ($user = isLoggedIn()) {
		$user = JSON.parse($user);
		$('html').removeClass('d-none');
	} else {
		window.location.replace("login.html");
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
	const peerData = () => {
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

	const createCoursesTab = (courses) => {


		$.each(courses, (index, course) => {
			$img = $('<img>').addClass('card-img-top img-fluid py-2').attr('src', course.course_image || '../images/onlineCourses.png');
			$title = $('<h5></h5>').addClass('card-title font-weight-bold pb-0 mb-0').text(course.name);
			$description = $('<p></p>').addClass('py-0 my-0')
							.append(
								$('<span></span>').addClass('span-heading').text(course.description || "No Description Available")
							)
			$sections = $('<div></div>').addClass('row container');
			$.each(course.sections, (i, section) => {
				$sectionSpan = $(`<span id="${section.id}" data-faculty="${section.faculty_section_id}" data-depart="${section.department_name}" data-depart-full=${section.department_fullname}></span>`)
								.addClass('span-heading span-dept').text(section.name)
				$sectionCol = $(`<div></div>`)
								.addClass('col-auto')
								.append($sectionSpan)
				$sections.append($sectionCol);
			});
			$cardBody = $('<div></div>').addClass('card-body p-2').append($title, $description, $sections);
			$card = $('<div></div>').addClass('card mb-3 shadow-sm addCourseCard').append($img, $cardBody);
			$course = $('<div></div>').addClass('course col-lg-4 col-md-6 col-12 h-100').append($card);
			$('#courseList').append($course);

			if (index == courses.length - 1) {
			    $('#courseList').slick({
				  infinite: false,
				  speed: 300,
				  slidesToShow: 3,
				  slidesToScroll: 3,
				  arrows: true,	
				  responsive: [
				    {
				      breakpoint: 1024,
				      settings: {
				        slidesToShow: 2,
				        slidesToScroll: 2,
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
		$.each(upcomings.objective_tests, (index, objective) => {
			let text = "";
			if (objective.start_time)
				text = `Objective Test named ${objective.title} - ${objective.description} is going to start at ${objective.start_time}`;
			else 
				text = `Objective Test named ${objective.title} - ${objective.description} is going to end at ${objective.end_time}`;
			// $img = $('<img>').attr('src', peer.college_account_details.profile_pic).addClass('img-fluid');
			// $col1 = $('<div></div>').addClass('col-2').append($img);
			$col2 = $('<div></div>').addClass('col-12').text(text);
			$row = $('<div></div>').addClass('row').append($col2);
			$('#upcoming').append($row);			
		});
		$.each(upcomings.subjective_tests, (index, subjective) => {
			let text = "";
			if (subjective.start_time)
				text = `Subjective Test named ${subjective.title} - ${subjective.description} is going to start at ${subjective.start_time}`;
			else 
				text = `Subjective Test named ${subjective.title} - ${subjective.description} is going to end at ${subjective.end_time}`;
			// $img = $('<img>').attr('src', peer.college_account_details.profile_pic).addClass('img-fluid');
			// $col1 = $('<div></div>').addClass('col-2').append($img);
			$col2 = $('<div></div>').addClass('col-12').text(text);
			$row = $('<div></div>').addClass('row').append($col2);
			$('#upcoming').append($row);			
		});
		$.each(upcomings.vc, (index, videoConference) => {
			let text = "";
			if (videoConference.start_time)
				text = `Live Class named ${videoConference.title} - ${videoConference.description} is going to start at ${videoConference.start_time}`;
			else 
				text = `Live Class named ${videoConference.title} - ${videoConference.description} is going to end at ${videoConference.end_time}`;
			// $img = $('<img>').attr('src', peer.college_account_details.profile_pic).addClass('img-fluid');
			// $col1 = $('<div></div>').addClass('col-2').append($img);
			$col2 = $('<div></div>').addClass('col-12').text(text);
			$row = $('<div></div>').addClass('row').append($col2);
			$('#upcoming').append($row);			
		});				
	}

	const activityTab = (activities) => {
		$.each(activities, (index, activity) => {
			let act = ""
			console.log(activity)
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
         	console.log(act);
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
			let end_time = peer.end_time;

			if (peer.type == 'Subjective')
				type = 'subjective test';
			else if (peer.type == 'Test')
				type = 'test';
			else if (peer.type == 'VideoConference')
				type = 'live class';
			else if (peer.type == 'Notification')
				type = 'notification';
			else
				type = 'material';			
			let text = `${role_name} ${faculty_name} has created a ${type} named ${title} - ${description} for ${sent_to} students, which expires at ${end_time}`;
			$img = $('<img>').attr('src', peer.college_account_details.profile_pic).addClass('img-fluid');
			$col1 = $('<div></div>').addClass('col-2').append($img);
			$col2 = $('<div></div>').addClass('col-10').text(text);
			$row = $('<div></div>').addClass('row').append($col1, $col2);
			$('#peer').append($row);
		});
	}	

	try {
		let faculty = await facultyData(10, '2020-10-30 18:42:38');
		createCoursesTab(faculty.courses);
		createUpcomingTab(faculty.upcoming_events);
		activityTab(faculty.activity_tab);
		let peers = await peerData();
		createPeersTab(peers.college_notifications);
	} catch (error) {
		console.log(error);
	}
});