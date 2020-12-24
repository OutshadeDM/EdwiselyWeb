function isLoggedIn() {
	return $.cookie('user');
}

function logout() {
	$.cookie('user', "");
	$.cookie('status', 'success');
	$.cookie('message', '200');
	window.location.replace('login.html')
}