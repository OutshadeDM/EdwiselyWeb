$(document).ready(function () {

  let page = window.location.href.substring(window.location.href.lastIndexOf('/') + 1);



  if (page == 'courses.html') {
    $('#allCourseNav').addClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'addCourses.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').addClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'myAssessment.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'liveClass.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').addClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'sendQuestionsPage.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').addClass('selectedNav')
  }




  if (page == 'addQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'addQuestionsPage.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'chooseQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'uploadQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'courseDetails.html') {
    $('#allCourseNav').addClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (page == 'createAssessment.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }




});