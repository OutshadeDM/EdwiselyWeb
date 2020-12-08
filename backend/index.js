$(function() {
	// Check if User is logged in
	$user = "";
	if ($user = isLoggedIn()) {
		$('html').removeClass('d-none');
	} else {
		window.location.replace("login.html");
	}

	
});