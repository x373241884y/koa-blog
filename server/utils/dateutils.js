function formatDate(date, style) { //date format util
	var y = date.getFullYear();
	var M = "0" + (date.getMonth() + 1);
	M = M.substring(M.length - 2);
	var d = "0" + date.getDate();
	d = d.substring(d.length - 2);
	var h = "0" + date.getHours();
	h = h.substring(h.length - 2);
	var m = "0" + date.getMinutes();
	m = m.substring(m.length - 2);
	var s = "0" + date.getSeconds();
	s = s.substring(s.length - 2);
	return style.replace('yyyy', y).replace('MM', M).replace('dd', d).replace('HH', h).replace('mm', m).replace('ss', s);
}

exports.format = formatDate;

exports.randomStr=function(l) {
	var  x="0123456789qwertyuioplkjhgfdsazxcvbnm";
	var  tmp="";
	var timestamp = new Date().getTime();
	for(var  i=0;i<  l;i++)  {
		tmp  +=  x.charAt(Math.ceil(Math.random()*100000000)%x.length);
	}
	return  timestamp+tmp;
};