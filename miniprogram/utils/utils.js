export async function wait(duration, timeoutProcess = false){
  return new Promise((resolve, reject)=>{
    setTimeout(()=>{
      if(timeoutProcess){
        reject('timeout')
      } else {
        resolve();
      }
    }, duration);
  });
}
export function nodup(fn){
  let isExcuting = false;
  let result = null;
  let excutingPromise = null;
  return async function(...args){
    if(result){
      return result;
    }
    if(isExcuting) {
      return excutingPromise;
    }
    isExcuting = true;
    try {
      excutingPromise = fn.apply(this, args);
      result = await excutingPromise;
    } catch(e){
      console.log(e);
    }
    excutingPromise = null;
    isExcuting = false;
    return result;
  }
}

export const getOpenIdAndUnionId = nodup( async function(){
  const res = await wx.cloud.callFunction({
    name: 'login'
  }).then(r=>r.result);
  return res;
});