
exports.filterCategory=function(terms){
	var result = [];
	for(var i=0;i<terms.length;i++){
		if(terms[i].taxonomy==="category"){
			result.push(terms[i]);
		}
	}
	return result;
};


exports.filterTags=function(terms){
	var result = [];
	for(var i=0;i<terms.length;i++){
		if(terms[i].taxonomy==="post_tag"){
			result.push(terms[i]);
		}
	}
	return result;
};