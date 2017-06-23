var rules = {
	number: /^\d+$/,
	string: /^\w[\w\d_]+$/
};
function match(type, array) { //foreground 前台标志
    var rule=rules[type];
	   if(rule){
        return array.every(function(temp){
                    return rule.test(temp);
                });
       }else{
           return false;
       }
   }
module.exports=match;
