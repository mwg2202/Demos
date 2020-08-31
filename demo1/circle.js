console.log("index.js: I exist")

class Circle {
    constructor(object, xPos, yPos, xVel, yVel, radius, mass) {
        this.object = object;
        this.xPos = xPos;
        this.yPos = yPos;
        this.xVel = xVel;
        this.yVel = yVel;
        this.radius = radius;
        this.mass = mass;
        this.grabbed = false;
    }

    updatePosition(fps) {
        this.xPos += this.xVel / fps;
        this.yPos += this.yVel / fps;
    }

    draw() {
        this.object.style.left = this.xPos.toString() + "vw";
        this.object.style.top = this.yPos.toString() + "vh";
    }
}


function circleCollisionDetector(objects) {
    for (i = 0; i < objects.length; i++) {
        for (j = i + 1; j < objects.length; j++) {
            
            x1 = objects[i].xPos;
            y1 = objects[i].yPos;
            x2 = objects[j].xPos;
            y2 = objects[j].yPos;
            minDistance = objects[i].radius + objects[j].radius;
            
            distance = ((x1-x2)**2+(y1-y2)**2) ** (1/2);

            if (distance <= minDistance) {
                m1 = objects[i].mass;
                m2 = objects[j].mass;
                vx1 = objects[i].xVel;
                vy1 = objects[i].yVel;
                vx2 = objects[j].xVel;
                vy2 = objects[j].yVel;
                
                objects[i].xVel = vx1*(m1-m2)/(m1+m2)+2*vx2*m2/(m1+m2);
                objects[j].xVel = 2*m1*vx1/(m1+m2)-vx2*(m1-m2)/(m1+m2);
                objects[i].yVel = vy1*(m1-m2)/(m1+m2)+2*vy2*m2/(m1+m2);
                objects[j].yVel = 2*m1*vy1/(m1+m2)-vy2*(m1-m2)/(m1+m2);
                console.log("Collision Detected: Circles");
            }
        }

        if (objects[i].xPos <= objects[i].radius || objects[i].xPos >= 100 - objects[i].radius) {
            objects[i].xVel = -objects[i].xVel;
            console.log("Collision Detected: Wall");
        }

        if (objects[i].yPos <= objects[i].radius || objects[i].yPos >= 100 - objects[i].radius) {
            objects[i].yVel = -objects[i].yVel;
        }
    }
}

function runSimulation(objects, timeTillStop, fps) {
    var timesRun = 0;
    var interval = setInterval(() => {
        if (grabbed == false) {
            
            timesRun +=1;
            if(timesRun == timeTillStop * fps) {
                clearInterval(interval)
            }
            
            for (object of objects) {
                if (object != objectBeingGrabbed){
                    object.updatePosition(fps);
                    object.draw();
                }
            }
            
            circleCollisionDetector(objects);
        }
    }, 1000 / fps);
}

const circle1 = new Circle(
    document.getElementsByClassName("circle")[0],
    25, 50, 15, -15,
    3.5, 1
);

const circle2 = new Circle(
    document.getElementsByClassName("circle")[1],
    75, 50, -15, -12,
    3.5, 1
    );

const circle3 = new Circle(
    document.getElementsByClassName("circle")[2],
    50, 80, 15, -5,
    3.5, 1
    );
    
var objects = [circle1, circle2, circle3];
var objectBeingGrabbed;
var grabbed = false;

$( function() {
    $(".draggable").draggable({
        start: (event, ui) => {
            console.log("Something was Dragged");
            for (object of objects) {
                console.log((object.xPos * $(window).width() / 100), ui.position.left);
                if ((object.xPos * $(window).width() / 100).toPrecision(2) == ui.position.left.toPrecision(2)) {
                    console.log("found him")
                    objectBeingGrabbed = object;
                }
            }
        },
        
        stop: () => {
            objectBeingGrabbed = void(0);
        },

        drag: function(event, ui) {
            objectBeingGrabbed.xPos = ui.position.left / $(window).width() * 100;
            objectBeingGrabbed.yPos = ui.position.top / $(window).height() * 100;
        }
    });
});

runSimulation(objects, 
    timeTillStop = 30, // seconds to run sim
    fps = 60   // fps
    );