$(document).ready(function () {
  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
    $("#greetingNav").html($user.name);
  } else {
    window.location.replace("login.html");
  }

  const searchParams = new URLSearchParams(window.location.search);
  let id = 0, title = "",qc=0;

  if (searchParams.has('fname') && searchParams.has("id")) {
    title = searchParams.get('fname');
    id = searchParams.get('id');
    $("#codeName").text(title);
  }
  if (searchParams.has('qc')) {
    qc = searchParams.get("qc");
  }
  
  $(document).on('click', '#addques', function () {
    window.location.href = "addCodeQues.html?id=" + id;
  })
  
  $(document).on('click', '#chooseques', function () {
    window.location.href = "chooseCodeQues.html?id=" + id + "&fname=" + title;    
  })

  $("#sendCodeBtn").click(()=>{
    if(qc > 0){
      window.location.href = "sendCodingAssessment.html?id=" + id + "&tname=" + title;
    }
    else{
      new Notify ({
          title: 'Error',
          text : "Please add questions to assesment first",
          autoclose: true,
          status: 'error',
          autotimeout: 3000
      });
    }
  });

});
