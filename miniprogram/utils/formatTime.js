export default function formatTime (date){
  if(typeof date === 'string'){
    date = new Date(date);
  }
  let fmtStr = 'yyyy-MM-dd hh:mm:ss';
  const o = {
    'M+': date.getMonth()+1,
    'd+': date.getDate(),
    'h+': date.getHours(),
    'm+': date.getMinutes(),
    's+': date.getSeconds(),
  }
  if(/(y+)/.test(fmtStr)){
    fmtStr = fmtStr.replace(RegExp.$1, date.getFullYear());
  }
  for(let key in o){
    if(new RegExp(`(${key})`).test(fmtStr)){
      fmtStr = fmtStr.replace(RegExp.$1, o[key] < 10 ? '0'+ o[key]: o[key]);
    }
  }
  return fmtStr;
}