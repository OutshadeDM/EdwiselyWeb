$(document).ready(function () {

    $user = "";
    if (isLoggedIn()) {
    //   console.log(isLoggedIn(), 'yes');
      $user = JSON.parse(isLoggedIn());
      $('html').removeClass('d-none');
    } else {
      window.location.replace("login.html");
    }

    let searchParams = new URLSearchParams(window.location.search);
    let url = "";
    let type = "";
    // let units = [];
    if (searchParams.has('url') && searchParams.has('type')) {
        url = searchParams.get('url');
        type = searchParams.get('type');

        // alert(url);

        if(type == "doc" || type == "pdf" || type == "ppt")
            $('#mainiFrame').attr('src',"https://drive.google.com/viewerng/viewer?embedded=true&url="+url.split('?')[0]);
        else if(type == "mp4" || type == "video"){
            // console.log(linkifyYouTubeURLs(url));
            if(url.includes("youtube"))
                $('#mainiFrame').attr('src',"https://www.youtube.com/embed/"+linkifyYouTubeURLs(url)+"?autoplay=1&mute=1");
        }
        else
            $('#mainiFrame').attr('src',url);
    }

    function linkifyYouTubeURLs(text) {
        var re = /https?:\/\/(?:[0-9A-Z-]+\.)?(?:youtu\.be\/|youtube(?:-nocookie)?\.com\S*?[^\w\s-])([\w-]{11})(?=[^\w-]|$)(?![?=&+%\w.-]*(?:['"][^<>]*>|<\/a>))[?=&+%\w.-]*/ig;
        return text.replace(re,'$1');
    }

  });
  