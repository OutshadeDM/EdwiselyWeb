$(document).ready(function(){
    // alert("ok");
    let searchParams = new URLSearchParams(window.location.search);
    let subSemId;
    if(searchParams.has('id'))
        subSemId = searchParams.get('id');
    else 
        window.location.href = "courses.html";
    // alert(subSemId);

});
