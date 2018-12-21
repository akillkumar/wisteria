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

});

$(document).ready(function(){

	var boxActive = false;

	//Initiating all events in category arrays for lesser manual code in HTML
	var entrepreneurship = ["entrepreneurship","The Corporates Pitch"],
		fine_arts = ["fine-arts","Junk Jugaad","Impromptu Impressions"],
		literary = ["literary","6-Words Stories","Slam Dunk"],
		music = ["music","Battle of the Bands","Vocal Solo"],
		performing_arts = ["performing-arts","Ramp It Up","Synthesis","Rang Manch","Nukkad Naatak"],
		photography = ["photography","Shutterbug"],
		quiz = ["quiz","MELA Quiz","General Quiz"],
		eventCategories = [entrepreneurship,fine_arts,literary,music,performing_arts,photography,quiz];

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

	//Load Content of Hexagon
	$(".section1 #hexGrid").load("files/hexagons-v1.1.html",function(){

		//Handle Click on each hexagon
		$(".hexIn").click(function(e){
			boxActive = true;
			$(".category-box-parent").css("display","flex");
			var extractedHref = $(this).attr("href");
			$(".category-box-parent ." + extractedHref).slideDown(400).addClass("active-category-box");
			$("body").css("overflow","hidden");

			$(".active-category-box .event:nth-child(1)").show().addClass("active-event");
			$(".active-category-box .category-event:nth-child(1)").addClass("active-category-event");
			e.preventDefault();
		});

	});

	//Populate each of the Category Boxes
	$(".category-box").each(function(){
		$(this).append('<div class="category-events-list"></div>\n<div class="events-container"></div>');
	});
	for(var i=0; i<eventCategories.length; i++){
		var thisCategory = eventCategories[i];
		for(var j=1; j<thisCategory.length; j++){
			var eventClassName = eventCategories[i][j].toLowerCase().split(' ').join('-');
			$("." + thisCategory[0] + " .category-events-list").append('<h1 class="category-event" data-mappedinfo="'+ eventClassName +'">'+ eventCategories[i][j] +'</h1>');
			$("." + thisCategory[0] + " .events-container").append('<div class="event '+ eventClassName +'"></div>');
			$("." + eventClassName).load("files/events/" + eventCategories[i][0] + "/" + eventClassName + ".html");
		}
	}

	//Add Close Button to Each of the Description Boxes
	$(".category-box").prepend('<p class="cross">&times;</p>');

	//Handle Click on Close
	$(".category-box .cross").click(function(){
		$(this).parent(".category-box").slideUp(200).removeClass("active-category-box");
		$(".category-box-parent").delay(200).hide(0);
		$("body").css("overflow","auto");
		$(".active-event").hide().removeClass("active-event");
		$(".active-category-event").removeClass("active-category-event");
		boxActive = false;
	});
	//Handle Escape key press - Trigger Click on Cross
	$(document).keyup(function(e){
		if((boxActive === true)&&(e.which === 27)){
			$(".active-category-box .cross").trigger("click");
		}
	});
	//Handle Click on outside the category-box to close it - Trigger click on cross
	$(".category-box-parent").click(function(e){
		if((boxActive===true)&&(e.target.className==="category-box-parent")){
			$(".active-category-box .cross").trigger("click");
		}
	});

	//Handle click on category-event
	$(".category-event").click(function(){
		$(".active-category-event").removeClass("active-category-event");
		$(".active-event").hide().removeClass("active-event");
		$(this).addClass("active-category-event")
		var relatedInfoDivClass = $(this).attr("data-mappedinfo");
		$("." + relatedInfoDivClass).show().addClass("active-event");
	});

});










