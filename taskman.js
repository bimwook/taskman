var taskman = {};
taskman.create = function(){
  var running = false;
  var ret = {};
  ret.items = [];
  ret.add = function(f, d){
    if(running) return false;
    if(typeof(f)=="function") {
      this.items.push({handler: f, data:d});
    }
    return true;
  }
  ret.events = {callback: null, finish: null};
  ret.on = function(evt, f){
    if( (typeof(evt)=="string") && (typeof(f)=="function") ){
      this.events[evt] = f;
    }
  }
  ret.start = function(interval){
    var me = this;
    if(running) return;
    running = true;
    var busy = false; 
    var itv = interval || 0;
    var timer = global.setInterval(function(){
      if(busy) return;
      busy = true;
      var task = me.items.shift();
      if(task){
        task.handler(task.data, function(){
          var e = me.events["callback"];
          if(typeof(e)=="function"){
            e.apply(this, arguments);
          }
          global.setTimeout(function(){
            busy =false;
          }, itv);
        });
      }
      else {
        global.clearInterval(timer);
        var e = me.events["finish"];
        if(typeof(e)=="function"){
          e.apply(this);
        }
        busy =false;
        running =false;
      }
    }, 30);
  }
  return ret;
}

module.exports = taskman;
