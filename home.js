var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var moving = false
class Star{
  static stars=[]
  constructor(x,y,mass,radius,landings){
    this.x=x
    this.y=y
    this.mass=mass
    this.radius=radius
    this.landings=landings
    this.bcolls=this.landings;
    this.rcolls=this.landings;
    Star.stars.push(this)
  }
  G=10;
  color="black"
  owner=null;
  draw(){
    //ctx.restore();
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.font=`${this.radius}px serif`
    ctx.fillStyle="white"
    ctx.fillText(this.rcolls+" "+this.bcolls,this.x-this.radius/2,this.y+this.radius/4)
    ctx.closePath();
  }
}
class Ships{
  static ships=[]
  constructor(){
    Ships.ships.push(this)
  }
  mass= 5
  radius= 5
  draw(){
    //var v = Math.sqrt(this.vx**2+this.vy**2)
    ctx.beginPath();
    // ctx.fillText("Theta="+this.theta,10,50)
    // ctx.fillText("Vx="+this.vx,10,60)
    // ctx.fillText("Vy="+this.vy,10,70)
    // ctx.fillText("V="+v,10,80)
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = this.color;
    ctx.fill();
    ctx.beginPath();
    // ctx.fillText("vx= "+`${lastRed.vx}`+"\n"+"vy= "+`${lastRed.vy}`,10,50)
    ctx.moveTo(this.x,this.y);
    ctx.lineWidth=3;
    ctx.lineTo(this.x+10*this.vx,this.y+10*this.vy);
    ctx.stroke();
    ctx.closePath();
  }
  // draw(){
  //   ctx.beginPath();
  //   ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
  //   ctx.strokeStyle = this.color;
  //   ctx.lineWidth=1;
  //   ctx.stroke();
  //   ctx.closePath();
  // }
}
class RedShips extends Ships{
  static rships=[];
  x=890;
  y=225;
  vx=-1.5;
  vy=0;
  moving=false;
  landed=false;
  theta=-Math.PI;
  color="red"
  constructor(){
    super()
    RedShips.rships.push(this);
  }
}
class BlueShips extends Ships{
  static bships=[];
  x=10;
  y=225;
  vx=1.5;
  vy=0;
  moving=false;
  landed=false;
  theta=0;
  color="blue"
  constructor(){
    super()
    BlueShips.bships.push(this);
  }
}
// var theship = {
//   x: 100,
//   y: 225,
//   xi:100,
//   yi:225,
//   mass: 5,
//   vx: 1.5,
//   vy: 0,
//   theta:0,
//   radius: 5,
//   color: 'blue',
//   draw: function() {
//     var v = Math.sqrt(this.vx**2+this.vy**2)
//     ctx.beginPath();
//     ctx.fillText("Theta="+this.theta,10,50)
//     ctx.fillText("Vx="+this.vx,10,60)
//     ctx.fillText("Vy="+this.vy,10,70)
//     ctx.fillText("V="+v,10,80)
//     ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2, true);
//     ctx.closePath();
//     ctx.fillStyle = this.color;
//     ctx.fill();
//     ctx.beginPath();
//     ctx.moveTo(this.x,this.y);
//     ctx.lineWidth=3;
//     ctx.lineTo(this.x+10*this.vx,this.y+10*this.vy);
//     ctx.stroke();
//     ctx.closePath();
//   }
//}
//var planet1 = new Ships(600,150,5,10);
var star1 = new Star(600,250,10,10,3);
var star2 = new Star(500,250,10,20,2);
//var planet2 = new Ships(500,150,5,10);
for (let i = 0; i < 10; i++) {
  new RedShips()
  new BlueShips()
}
// var rship1 = new RedShips()
// var bship1 = new BlueShips()

function firstNonMoving(shipList){
  for (let i = 0; i < shipList.length; i++) {
    if(! shipList[i].moving){
      return shipList[i]
    }
  }
  return null
}

function firstNonMovingIndex(shipList){
  for (let i = 0; i < shipList.length; i++) {
    if(! shipList[i].moving){
      return i
    }
  }
  return shipList.length-1
}

function lastMoving(shipList){
  if(! shipList[0].moving){
    return null
  }
  for (let i = 1; i < shipList.length; i++) {
    if(! shipList[i].moving){
      return shipList[i-1]
    }
  }
  return shipList[shipList.length-1]
}


function Fx(cel_obj,theship){
  netFx=0;
  cel_obj.forEach(function(obj){
    let d=Math.sqrt(((obj.x-theship.x)**2+(obj.y-theship.y)**2));
    netFx+=obj.G*(obj.mass*theship.mass)*(obj.x-theship.x)/Math.pow(d,3);
  })
  return netFx;
}
function Fy(cel_obj,theship){
  netFy=0;
  cel_obj.forEach(function(obj){
    let d=Math.sqrt(((obj.x-theship.x)**2+(obj.y-theship.y)**2));
    netFy+=obj.G*(obj.mass*theship.mass)*(obj.y-theship.y)/Math.pow(d,3);
  })
  return netFy;
}
var rho = 0;
function Fvx(theship){
  return -rho*theship.vx;
}
function Fvy(theship){
  return -rho*theship.vy;
}
// function isOrbitComplete(theship,star,t){
//   let m1 = (theship.yi-star.y)/(star.x-theship.xi)
//   let m2 = (theship.y-star.y)/(star.x-theship.x)
//   let t1 = (theship.xi>star.x) ? ((180/Math.PI)*Math.atan(m1)) : (180+(180/Math.PI)*Math.atan(m1))
//   let t2 = (theship.x>star.x) ? ((180/Math.PI)*Math.atan(m2)) : (180+(180/Math.PI)*Math.atan(m2))
//   if((t2-t1)/(2*Math.PI*t)>0.999){
//     return true
//   }
//   return false
//}
var cel_obj=Star.stars


var c=0.1;
var d;
// var lastRed;
// var lastBlu;
var redV;
var bluV;
function draw() {
  //theship.draw();
  
  // Star.stars.forEach(function(star){
    // })
    // let lastRed;
    // let lastBlu;
    // let redV;
    // let bluV;
    lastRed = firstNonMoving(RedShips.rships)
    lastBlu = firstNonMoving(BlueShips.bships)
    if(lastRed!=null & lastBlu!=null){

      redV = Math.sqrt(lastRed.vx**2+lastRed.vy**2)
      bluV = Math.sqrt(lastBlu.vx**2+lastBlu.vy**2)
      if(! lastRed.moving){
        if(keyState[1]){
          lastRed.theta -= 1;
          //alert('up arrow')
        }
        if(keyState[2]){
          lastRed.theta += 1;
          //alert('down arrow')
        }
        if(keyState[5]){
          redV += 0.5;
        }
        if(keyState[6]){
          redV -= 0.5;
        }
        lastRed.vx = Math.cos((Math.PI/180)*lastRed.theta)*redV;
        lastRed.vy = -Math.sin((Math.PI/180)*lastRed.theta)*redV;
      }
      if(! lastBlu.moving){
        if(keyState[3]){
          lastBlu.theta += 1;
        }
        if(keyState[4]){
          lastBlu.theta -= 1;
        }
        if(keyState[7]){
          bluV -= 0.5;
        }
        if(keyState[8]){
          bluV += 0.5;
        }
        lastBlu.vx = Math.cos((Math.PI/180)*lastBlu.theta)*bluV;
        lastBlu.vy = -Math.sin((Math.PI/180)*lastBlu.theta)*bluV;
      }
    }
    
    
    
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // ctx.fillText("vx= "+`${lastRed.vx}`+"\n"+"vy= "+`${lastRed.vy}`,10,50)
    // ctx.fillText("vx= "+`${lastBlu.vx}`+"\n"+"vy= "+`${lastBlu.vy}`,10,50)
    // RedShips.rships.forEach(function(redship){
    //   redship.draw()
    // })
    // BlueShips.bships.forEach(function(blueship){
    //   blueship.draw()
    // })
    Ships.ships.forEach(function(theship){
      theship.draw();
      if(theship.y<0){
        theship.y=canvas.height
      }
      else if(theship.y>canvas.height){
        theship.y=0
      }
      if(theship.x<0){
        theship.x=canvas.width
      }
      else if(theship.x>canvas.width){
        theship.x=0
      }

    })
    ctx.fillText((RedShips.rships.length-firstNonMovingIndex(RedShips.rships))+" "+(BlueShips.bships.length-firstNonMovingIndex(BlueShips.bships)),10,20)
    //c=0.1
  
  RedShips.rships.forEach(function(aship){
    if(aship.moving){
      aship.vx+= c*(Fx(cel_obj,aship)+Fvx(aship))/aship.mass
      aship.vy+= c*(Fy(cel_obj,aship)+Fvy(aship))/aship.mass
      
      aship.x += aship.vx;
      aship.y += aship.vy;
      aship.theta = (aship.vx>0) ? ((180/Math.PI)*Math.atan(-aship.vy/aship.vx)) : (180+(180/Math.PI)*Math.atan(-aship.vy/aship.vx))
  
    }
  })
  BlueShips.bships.forEach(function(aship){
    if(aship.moving){
      aship.vx+= c*(Fx(cel_obj,aship)+Fvx(aship))/aship.mass
      aship.vy+= c*(Fy(cel_obj,aship)+Fvy(aship))/aship.mass
      
      aship.x += aship.vx;
      aship.y += aship.vy;
      aship.theta = (aship.vx>0) ? ((180/Math.PI)*Math.atan(-aship.vy/aship.vx)) : (180+(180/Math.PI)*Math.atan(-aship.vy/aship.vx))
  
    }
  })
  Star.stars.forEach(function(astar){
    // if(astar.landings>0){
      //   if(isOrbitComplete(theship,astar,1)){
    //     astar.landings-=1;
    //     astar.color = theship.color
    //     //astar.x=10
    //     //alert("benchooo")
    //   }
    // }
    // else if(astar.landings==0){
      //   astar.owner=theship
      // }
    if(astar.rcolls==0 & astar.bcolls!=0){
      astar.color="red"
    }
    else if(astar.bcolls==0 & astar.rcolls!=0){
      astar.color="blue"
    }
    else if(astar.bcolls==0 & astar.rcolls==0){

    }

    astar.draw()
    Ships.ships.forEach(function(aship){
      d=Math.sqrt(((astar.x-aship.x)**2+(astar.y-aship.y)**2));
      if(d<astar.radius+aship.radius & ! aship.landed){
        if(aship instanceof RedShips  & astar.bcolls>0 & astar.rcolls>0){
          astar.rcolls-=1;
          //console.log("red hit"+astar.rcolls+" "+astar.bcolls+" vx="+aship.vx+" vy="+aship.vy)
          
        }
        else if(aship instanceof BlueShips & astar.rcolls>0 & astar.bcolls>0){
          astar.bcolls-=1;
          //console.log("blu hit"+astar.rcolls+" "+astar.bcolls+" vx="+aship.vx+" vy="+aship.vy)
          
        }
        aship.mass=0;
        aship.vx=0;
        aship.vy=0;
        aship.landed=true
        //console.log("red hit"+astar.rcolls+" "+astar.bcolls+" vx="+aship.vx+" vy="+aship.vy)
      }
    })
  })

  

  // Star.stars.forEach(function(obj){
  //   let d=Math.sqrt(((obj.x-theship.x)**2+(obj.y-theship.y)**2));
  //   if (d<obj.radius){
  //     theship.vx=0
  //     theship.vy=0
  //     window.cancelAnimationFrame(window.requestAnimationFrame(draw));
  //   }
  // })
  
  
  raf = window.requestAnimationFrame(draw);
}


var keyState = [];
// const KEY_UP = 38;
// const KEY_DOWN = 40;
// const KEY_LEFT = 37;
// const KEY_RIGHT = 39;
var keyCodes = {"ArrowUp":1,"ArrowDown":2,"w":3,"s":4,"ArrowLeft":5,"ArrowRight":6,"a":7,"d":8}

// create a logging function
const keyEventLogger =  function (e) {  keyState[keyCodes[e.key.toString()]] = e.type == 'keydown'; console.log(e.key+" was triggerred") }
window.addEventListener("keydown", keyEventLogger);
window.addEventListener("keyup", keyEventLogger);

window.addEventListener("keydown", function(e) {
  if(e.key==="Enter" & firstNonMoving(RedShips.rships)!=null){
      firstNonMoving(RedShips.rships).moving=true
      //RedShips.rships[RedShips.rships.length]=new RedShips()
      //Object.create(new RedShips())
      //new RedShips()
      raf = window.requestAnimationFrame(draw);
  }
    // if(!moving){
    //   moving = true
    // }
  // else{
  //     moving = false
  //     window.cancelAnimationFrame(raf);
  //   }
  // }
});
window.addEventListener("keydown", function(e) {
  if(e.key===" " & firstNonMoving(BlueShips.bships)!=null){
    firstNonMoving(BlueShips.bships).moving=true
    //console.log(BlueShips.bships[BlueShips.bships.length-1].vx+" "+BlueShips.bships[BlueShips.bships.length-1].vy)
    //BlueShips.bships.push(new BlueShips())
    //new BlueShips()
    //console.log(BlueShips.bships[BlueShips.bships.length-1].vx+" "+BlueShips.bships[BlueShips.bships.length-1].vy)
    raf = window.requestAnimationFrame(draw);
  }
});
window.addEventListener("keypress", function(e) {
  if(e.key==="r"){
    //moving = false;
    this.location.reload();

  }
});
//var v = Math.sqrt(theship.vx**2+theship.vy**2)
// window.addEventListener("keydown",function(e){
//   let thership = RedShips.rships[RedShips.rships.length-1]
//   let theship = BlueShips.bships[BlueShips.bships.length-1]
//   let v = Math.sqrt(thership.vx**2+thership.vy**2)
//   if(e.key==="ArrowDown"){
//     thership.theta-=1;
//   }
//   else if(e.key==="ArrowUp"){
//     thership.theta+=1;
//   }
//   if(e.key==="s"){
//     // let theship = theship
//      theship.theta-=1;
//    }
//    else if(e.key==="w"){
//      theship.theta+=1;
//    }
//    if(e.key==="ArrowLeft"){
//     v -=0.5
//   }
//   else if(e.key==="ArrowRight"){
//     v +=0.5
//   }
//   if(e.key==="a"){
//     v -=0.5
//   }
//   else if(e.key==="d"){
//     v +=0.5
//   }
//   theship.vx = Math.cos((Math.PI/180)*theship.theta)*v;
//   theship.vy = -Math.sin((Math.PI/180)*theship.theta)*v;
//   ctx.clearRect(0, 0, canvas.width, canvas.height)
//   cel_obj.forEach(function(obj){
//     obj.draw()
//   })
//   RedShips.rships.forEach(function(redship){
//     redship.draw()
//   })
//   BlueShips.bships.forEach(function(blueship){
//     blueship.draw()
//   })
//   ctx.beginPath();
//   ctx.moveTo(thership.x,thership.y);
//   ctx.lineWidth=0.5;
//   ctx.lineTo(thership.x+1000*thership.vx,thership.y+1000*thership.vy);
//   ctx.stroke();
//   ctx.closePath();
// })

// window.addEventListener("keydown",function(e){
//   let theship = BlueShips.bships[BlueShips.bships.length-1]
//   let v = Math.sqrt(theship.vx**2+theship.vy**2)
//   if(e.key==="s"){
//    // let theship = theship
//     theship.theta-=1;
//     theship.vx = Math.cos((Math.PI/180)*theship.theta)*v;
//     theship.vy = -Math.sin((Math.PI/180)*theship.theta)*v;
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     cel_obj.forEach(function(obj){
//       obj.draw()
//     })
//   }
//   else if(e.key==="w"){
//     theship.theta+=1;
//     theship.vx = Math.cos((Math.PI/180)*theship.theta)*v;
//     theship.vy = -Math.sin((Math.PI/180)*theship.theta)*v;
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     cel_obj.forEach(function(obj){
//       obj.draw()
//     })
//   }
//   RedShips.rships.forEach(function(redship){
//     redship.draw()
//   })
//   BlueShips.bships.forEach(function(blueship){
//     blueship.draw()
//   })
//   ctx.beginPath();
//   ctx.moveTo(theship.x,theship.y);
//   ctx.lineWidth=0.5;
//   ctx.lineTo(theship.x+1000*theship.vx,theship.y+1000*theship.vy);
//   ctx.stroke();
//   ctx.closePath();
// })



// // window.addEventListener("keyup",function(e){
// //   if(e.key==="ArrowDown"&moving){
// //     Fngy=0;
// //     raf = window.requestAnimationFrame(draw);
// //   }
// //   else if(e.key==="ArrowUp"&moving){
// //     Fngy=0;
// //     raf = window.requestAnimationFrame(draw);
// //   }
// // })
// window.addEventListener("keydown",function(e){
//   let thership = RedShips.rships[RedShips.rships.length-1]
//   let theship = BlueShips.bships[BlueShips.bships.length-1]
//   let v = Math.sqrt(thership.vx**2+thership.vy**2)
//   if(e.key==="ArrowLeft"){
//     v -=0.5
//     thership.vx = Math.cos((Math.PI/180)*thership.theta)*v;
//     thership.vy = -Math.sin((Math.PI/180)*thership.theta)*v
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     cel_obj.forEach(function(obj){
//       obj.draw()
//     })
//   }
//   else if(e.key==="ArrowRight"){
//     v +=0.5
//     thership.vx = Math.cos((Math.PI/180)*thership.theta)*v;
//     thership.vy = -Math.sin((Math.PI/180)*thership.theta)*v
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     cel_obj.forEach(function(obj){
//       obj.draw()
//     })
//   }
//   RedShips.rships.forEach(function(redship){
//     redship.draw()
//   })
//   BlueShips.bships.forEach(function(blueship){
//     blueship.draw()
//   })
//   ctx.beginPath();
//   ctx.moveTo(thership.x,thership.y);
//   ctx.lineWidth=0.5;
//   ctx.lineTo(thership.x+1000*thership.vx,thership.y+1000*thership.vy);
//   ctx.stroke();
//   ctx.closePath();
// })

// window.addEventListener("keydown",function(e){
//   let theship = BlueShips.bships[BlueShips.bships.length-1]
//   let v = Math.sqrt(theship.vx**2+theship.vy**2)
//   if(e.key==="a"){
//     v -=0.5
//     theship.vx = Math.cos((Math.PI/180)*theship.theta)*v;
//     theship.vy = -Math.sin((Math.PI/180)*theship.theta)*v
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     cel_obj.forEach(function(obj){
//       obj.draw()
//     })
//   }
//   else if(e.key==="d"){
//     v +=0.5
//     theship.vx = Math.cos((Math.PI/180)*theship.theta)*v;
//     theship.vy = -Math.sin((Math.PI/180)*theship.theta)*v
//     ctx.clearRect(0, 0, canvas.width, canvas.height)
//     cel_obj.forEach(function(obj){
//       obj.draw()
//     })
//   }
//   RedShips.rships.forEach(function(redship){
//     redship.draw()
//   })
//   BlueShips.bships.forEach(function(blueship){
//     blueship.draw()
//   })
//   ctx.beginPath();
//   ctx.moveTo(theship.x,theship.y);
//   ctx.lineWidth=0.5;
//   ctx.lineTo(theship.x+1000*theship.vx,theship.y+1000*theship.vy);
//   ctx.stroke();
//   ctx.closePath();
// })
// window.addEventListener("keyup",function(e){
//   if(e.key==="ArrowLeft"&moving){
//     Fngx=0;
//     raf = window.requestAnimationFrame(draw);
//   }
//   else if(e.key==="ArrowRight"&moving){
//     Fngx=0;
//     raf = window.requestAnimationFrame(draw);
//   }
// })
// ctx.fillText(U(cel_obj,theship),100,60)
// ctx.fillText(K(theship),100,70)
ctx.clearRect(0, 0, canvas.width, canvas.height)
var lastRed = firstNonMoving(RedShips.rships)
var lastBlu = firstNonMoving(BlueShips.bships)
// ctx.fillText("vx= "+`${lastRed.vx}`+"\n"+"vy= "+`${lastRed.vy}`,10,50)
// ctx.fillText("vx= "+`${lastBlu.vx}`+"\n"+"vy= "+`${lastBlu.vy}`,10,50)
//theship.draw()
Ships.ships.forEach(function(theship){
  theship.draw()
})
ctx.beginPath();
ctx.moveTo(lastRed.x,lastRed.y);
ctx.lineWidth=0.5;
ctx.lineTo(lastRed.x+1000*lastRed.vx,lastRed.y+1000*lastRed.vy);
ctx.stroke();

ctx.moveTo(lastBlu.x,lastBlu.y);
ctx.lineWidth=0.5;
ctx.lineTo(lastBlu.x+1000*lastBlu.vx,lastBlu.y+1000*lastBlu.vy);
ctx.stroke();
// BlueShips.bships.forEach(function(blueship){
//   blueship.draw()
// })
//var cel_obj=Star.stars.concat(Ships.ships)
cel_obj.forEach(function(obj){
  obj.draw()
})
ctx.fillText((RedShips.rships.length-firstNonMovingIndex(RedShips.rships))+" "+(BlueShips.bships.length-firstNonMovingIndex(BlueShips.bships)),10,20)
ctx.closePath();
window.requestAnimationFrame(draw);
//planet3.draw()

// RedShips.rships.forEach(function(){
//   console.log("red")
// })
// BlueShips.bships.forEach(function(){
//   console.log("blue")
// })
// Ships.ships.forEach(function(theship){
//   console.log(theship instanceof RedShips)
// })
