function isLoggedIn() {
	return $.cookie('user');
}

function logout() {
	$.cookie('user', "");
	window.location.replace('login.html?status=success&message=200');
}