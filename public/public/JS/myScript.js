	function changeImage() {
		var images = new Array();
	    images[0] = "../Images/Image_2.jpg";
	    images[1] = "../Images/men_shoes.jpg";
		
		var x = 0;
		var img=document.getElementById("bgimages");
		img.src=images[x];
		x++;
		if (images.length == x) {
			x = 0;
		}
	}
	setInterval("changeImage()", 3000);
	function show(value){
		if(value=="boots"){
			if(sneakers.style.display=="inline-block"){
				sneakers.style.display='none' ;
			}
			boots.style.display='inline-block';
		}
		if(value=="sneakers"){
			if(boots.style.display=="inline-block"){
				boots.style.display='none' ;
			}
			sneakers.style.display='inline-block';
		}
	}