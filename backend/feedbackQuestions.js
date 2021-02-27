$(document).ready(function () {
  $user = "";
  if (isLoggedIn()) {
    // console.log(isLoggedIn(), 'yes');
    $user = JSON.parse(isLoggedIn());
    $('html').removeClass('d-none');
  } else {
    window.location.replace("login.html");
  }


  //toasts
  $('#errorToast,#successToast').on('show.bs.toast', function () {
    $('#toastDiv').show();
    setTimeout(function () {
      $('#errorToast').toast('hide');
      $('#successToast').toast('hide');
      $('#toastDiv').hide();
    }, 5000);
  });


  let searchParams = new URLSearchParams(window.location.search);

  if (searchParams.get('cf') == 1) {
    let feedback_name = searchParams.get('fname');
    let feedback_id = searchParams.get('id');


    $(document).on('click', '#addques', function () {
      window.location.href = "addFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=0";
    })

    $(document).on('click', '#chooseques', function () {
      window.location.href = "chooseFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=0";
    })


    $('#sendFeedbackBtn').click(function () {
      $('#errorToastBody').text("Please Add Questions");
      $('#errorToast').toast('show');
    })

  }


  //coming on the page not from the created feedback window
  else {

    let feedback_name = ""
    let feedback_id = 0
    let question_count = 0

    if (searchParams.has('id')) {
      feedback_name = searchParams.get('fname');
      feedback_id = searchParams.get('id');
      question_count = searchParams.get('qc');
    }

    $(document).on('click', '#addques', function () {
      window.location.href = "addFeedQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=" + question_count;
    })

    $(document).on('click', '#chooseques', function () {
      window.location.href = "chooseQues.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=" + question_count;
    })

    $(document).on('click', '#sendFeedbackBtn', function () {
      if (question_count == 0) {
        $('#errorToastBody').text("Please Add Questions");
        $('#errorToast').toast('show');
      } else {
        window.location.href = "sendFeedbackPage.html?id=" + feedback_id + "&fname=" + feedback_name + "&qc=" + question_count;
      }
    })
  }
});
