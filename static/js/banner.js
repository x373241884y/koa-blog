function scrollToId(id) {
	document.getElementById(id).scrollIntoView();
	return false;
}
$(document).ready(function () {
	var leftHeight = $('#left').height();
	var viewHeight = $(window).height();
	$("#right").css("min-height", leftHeight);
	$("#gotop").click(function (event) {
		$('html,body').animate({scrollTop: '0px'}, 500);
		$(this).animate({"bottom": viewHeight + "px"}, 450).promise().done(function () {
			$(this).css("bottom", "-40px");
			$(this).animate({"bottom": "20px"}, 50);
		});
		return false;
	});
});
$(window).scroll(function (event) {
	var scrollY = window.scrollY;
	if (scrollY > 0) {
		$("#gotop").removeClass("disabled");
	} else {
		$("#gotop").addClass("disabled");
	}
});
function hereDoc(f) {
	return f.toString().replace(/^[^\/]+\/\*!?\s?/, '').replace(/\*\/[^\/]+$/, '');
}
var string = hereDoc(function () {/*
 --->无善无恶心之体,有善有恶意之动.
	 知善知恶是良知,为善去恶是格物.
	 This is x373241884y's front-end technology blog, github:x373241884y
	 */
});
console.log(string);