$(document).ready(function () {

  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/courses.html') {
    $('#allCourseNav').addClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/addCourses.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').addClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/myAssessment.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/liveClass.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').addClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/sendQuestionsPage.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').addClass('selectedNav')
  }




  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/addQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/addQuestionsPage.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/chooseQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/uploadQues.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/courseDetails.html') {
    $('#allCourseNav').addClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').removeClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }
  if (window.location.href == window.location.protocol + '//' + window.location.host + '/EdwiselyWeb/createAssessment.html') {
    $('#allCourseNav').removeClass('selectedNav')
    $('#addCourseNav').removeClass('selectedNav')
    $('#assessmentNav').addClass('selectedNav')
    $('#liveClassNav').removeClass('selectedNav')
    $('#sendAssessmentNav').removeClass('selectedNav')
  }




});