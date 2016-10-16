$(document).ready(function(){
	var scroll_pos_test = $('.navbar').offset().top;
	$(window).on('scroll', function(){
		var top_ = $(window).scrollTop();
		if (top_ > scroll_pos_test) {
			$('.navbar').addClass('scroll');
		}
		else {
			$('.navbar').removeClass('scroll');
		}
	});

	$('.carousel .item').each(function(e) {
		var bg_ = 'url(' + $(this).find('>img').attr('src') + ')';
		$(this).find('>img').hide();
		$(this).css('background-image', bg_);
	});

	$('.btn-menu').click(function(){
		$('body').toggleClass('menu-opened');
		return false;
	});

	$('<span class="fader">').appendTo('body');

	$('.fader').click(function(){
		$('body').removeClass('menu-opened');
	});

	$('.main-nav > ul > li').has('ul').addClass('has-drop');

	$('.main-nav .has-drop > a').append('<span class="opener">Open Drop</span>');

	$('.main-nav .has-drop .opener').click(function(){
		if ($(window).width() <= 767) {
			$(this).parent('a').siblings('ul').slideToggle(300);
			$(this).parent('a').closest('li').toggleClass('active');
			$(this).parent('a').closest('li').siblings('.active').removeClass('active').children('ul').slideUp(300);
		}
	});
/*$("input[name='demo_vertical']").TouchSpin({
      verticalbuttons: true
    });
*/
	$('#itemdetail').click(function() {
	  $(".two2").hide("fast")
		$(".three3").hide("fast")

			  $('.one1').slideToggle("slide");
	});
});
