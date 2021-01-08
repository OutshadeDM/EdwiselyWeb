$(document).ready(function () {

    $user = "";
    if (isLoggedIn()) {
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }

    let searchParams = new URLSearchParams(window.location.search);
    let url = "";
    let type = "";
    if (searchParams.has('url') && searchParams.has('type')) {
        url = searchParams.get('url');
        type = searchParams.get('type');

        if(type == "doc" || type == "pdf" || type == "ppt")
            $('#mainiFrame').attr('src',"https://drive.google.com/viewerng/viewer?embedded=true&url="+url.split('?')[0]);
        else if(type == "mp4" || type == "video"){
            if(url.includes("youtube"))
                $('#mainiFrame').attr('src',"https://www.youtube.com/embed/"+linkifyYouTubeURLs(url)+"?autoplay=1&mute=1");
        }
        else if(type == "img"){
          $('#mainImg').show();
          $('#mainiFrame').hide();
          $('#mainImg').attr('src',url);
        }
        else{
          $('#mainImg').show();
          $('#mainiFrame').hide();
          $('#mainImg').attr('src','../images/page-not-found.png');
        }
    }
    else{
      $('#mainImg').show();
      $('#mainiFrame').hide();
      $('#mainImg').attr('src','../images/page-not-found.png');
    }

    function linkifyYouTubeURLs(text) {
        var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        return text.replace(re,'$1');
    }

  });
  