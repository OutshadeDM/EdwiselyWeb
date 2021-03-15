$(document).ready(function () {
    $user = "";
    if (isLoggedIn()) {
      // console.log(isLoggedIn(), 'yes');
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }
  
    $('#errorToast,#successToast').on('show.bs.toast', function () {
      $('#toastDiv').show();
      setTimeout(function () {
        $('#errorToast').toast('hide');
        $('#successToast').toast('hide');
        $('#toastDiv').hide();
      }, 5000);
    });
  
    const searchParams = new URLSearchParams(window.location.search);
    let id = 0, qc = 0, title = "";
  
    if (searchParams.has('fname') && searchParams.has("id") && searchParams.has("qc")) {
      title = searchParams.get('fname');
      id = searchParams.get('id');
      qc = searchParams.get("qc");
      $("#codeName").text(title);
    }
  
    $(document).on('click', '#addques', function () {
      window.location.href = "addCodeQues.html?id=" + id + "&fname=" + title;
    })
  
    $(document).on('click', '#chooseques', function () {
      window.location.href = "chooseCodeQues.html?id=" + id + "&fname=" + title;
        
    })

    $("#sendCodeBtn").click(()=>{
      if(qc > 0){
        // window.location.href = "addFeedQues.html?id=" + id + "&fname=" + title;
      }
      else{
        $('#errorToastBody').text("Please add questions to assesment first");
        $('#errorToast').toast('show');
      }
    })

  });
  