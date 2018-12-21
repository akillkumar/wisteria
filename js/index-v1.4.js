$(window).on("load",function(){
	
	//Handle Pre-loader
	$(".loader").fadeOut(500);
	$(".door-left").delay(500).animate({
		left: "-100%",
		opacity: "0"
	},200);
	$(".door-right").delay(500).animate({
		left: "100%",
		opacity: "0"
	},200);
	setTimeout(function(){
		$(".loader").remove();
		$(".split-door").remove();
		$("body").css("overflow","auto");
	},700);

	//Handle Click on nav buttons
	$("nav a").click(function(e){
		var sectionClicked = $(this).attr("href"),
			firstChar = sectionClicked.substring(0,1),
			scrollToElement = $(sectionClicked).offset().top;
		if(firstChar==='#'){
			$("html, body").animate({
	        	scrollTop: scrollToElement-60
	    	}, 700);
    		e.preventDefault();
		}
	});

	//Change Section 1 height as images are absolute
	var calcHeightBleed = $(".bleed-right").height();
	if($(window).width()<700){
		$(".section1").height($(window).height()-60);
	}
	else{
		$(".section1").height(calcHeightBleed);
	}

	//Load Content of section 2
	$(".section2 .section2-content-text").load("files/vibe.html");

	//Size of iframes
	var iframeVidHeight = $(".section2 iframe").width()/1.78;
	$(".section2 iframe").height(iframeVidHeight);
	var iframeMapHeight = $(".section2 iframe").width()/1.5;
	$(".section4 .map-container").height(iframeMapHeight);


	//Change heights on resize
	$(window).resize(function(){
		var calcHeightBleed = $(".bleed-right").height();
		$(".section1").height(calcHeightBleed);
		if($(window).width()<700){
			$(".section1").height($(window).height()-60);
		}
		else{
			$(".section1").height(calcHeightBleed);
		}
		var iframeHeight = $(".section2 iframe").width()/1.78;
		$(".section2 iframe").height(iframeHeight);
		var iframeMapHeight = $(".section2 iframe").width()/1.5;
		$(".section4 .map-container").height(iframeMapHeight);
	});

	$(window).scroll(function(){
		$(".notshown").each(function(){
			var bottomOfScreen = $(window).scrollTop() + $(window).height(),
				thisObject = $(this),
				fourthOfObject = thisObject.offset().top + (thisObject.height()/4);

			if(bottomOfScreen>fourthOfObject){
				thisObject.children(".text-container").css("opacity","1");
				thisObject.removeClass("notshown");
			}
		});
	});

    $(".detour-title").click(function(){
    	$(this).next().slideToggle(200);
    });

    $(".map-overlay").click(function(){
    	$(this).fadeOut(200);
    });
    
    //$("video").play();
});









