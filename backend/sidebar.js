$(document).ready(function () {

  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/courses.html') {
    $('#allCourseNav').addClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/addCourses.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').addClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/myAssessment.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/liveClass.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').addClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/sendQuestionsPage.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').addClass('selectedNav')
  }




  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/addQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/addQuestionsPage.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/chooseQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/uploadQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/courseDetails.html') {
    $('#allCourseNav').addClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/frontend/pages/createAssessment.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }




});