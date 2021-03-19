$(document).ready(function () {
  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }

  const searchParams = new URLSearchParams(window.location.search);
  let id = 0, title = "";

  if (searchParams.has('fname') && searchParams.has("id")) {
    title = searchParams.get('fname');
    id = searchParams.get('id');
    $("#codeName").text(title);
  }

  $(document).on('click', '#addques', function () {
    window.location.href = "addCodeQues.html?id=" + id + "&fname=" + title;
  })

  $(document).on('click', '#chooseques', function () {
    window.location.href = "chooseCodeQues.html?id=" + id;

  })

  $("#sendCodeBtn").click(() => {
    if (qc > 0) {
      // window.location.href = "addFeedQues.html?id=" + id + "&fname=" + title;
    }
    else {
      new Notify({
        title: 'Error',
        text: "Please add questions to assesment first",
        autoclose: true,
        status: 'error',
        autotimeout: 3000
      });
    }
  })

});
