const redis = require("redis");

const redis_client = redis.createClient({
    host: 'localhost',
    port: '6379',
    //password: ''
});

redis_client.on("error", function(error) {
    console.error(error);
  });


var val;

function redis_get_wrapper(key) {
    return new Promise((resolve, reject) => {
     redis_client.get(key, (err, data) => {
      if (err) {
       reject(err)
       return
      }
      if (data) {
        val = true;
       resolve(val)
       return
      }
      if(!data){
          val = false;
          resolve(false)
        return
        }
     })
    })
}
//redis_client.set("missing", "valuz", redis.print);

var temp;
function helper() {
    console.log(temp)
}

async function get_wrapper(key){
    redis_client.get(key, async function(err, data) {
        if(data){
            temp = true;
    
        }
        else{
            temp = false;
        }
    
    })
}   

temp = await()
console.log(temp)