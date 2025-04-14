const chargingPos = {
    x: 1.5,
    y: 1.5,
    theta: 90
};

const demoPos = {
    x: 1.5,
    y: 1.5,
    theta: 90
};

var targetPos;

async function navigate(coor_x, coor_y, coor_theta)
{
    const baseUrl = "http://192.168.50.111:7001/destination_command_by_coordinate/";
    const url = `${baseUrl}?coor_x=${coor_x}&coor_y=${coor_y}&coor_theta=${coor_theta}`;

    const data = await sendRequestAPI(url);
}

async function getCurrentPos(){
    const url = "http://192.168.50.111:7001/steu_status_all/";

    const data = await sendRequestAPI(url);

    var currentPos = {
        x: data.curr_x,
        y: data.curr_y,
        theta: data.curr_angle
    }

    return currentPos;
}

async function turnHead(angle)
{
    const baseUrl = "http://192.168.50.111:7001/face_control/";
    const url = `${baseUrl}?angle=${angle}`;

    const data = await sendRequestAPI(url);
}

async function unlockDoor(isUnlocked){
    const baseUrl = "http://192.168.50.111:7001/key_control/";
    const url = `${baseUrl}?command=${isUnlocked ? "lock" : "unlock"}`;

    const data = await sendRequestAPI(url);
}

async function sendRequestAPI(url){
    try {
        const response = await fetch(url);
        
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log("Response:", data);
        return data;
    } catch (error) {
        console.error("Error fetching data:", error);
    }
}

function isTargetReached(currentPos){
    const isXSame = currentPos.x === targetPos.x;
    const isYSame = currentPos.y === targetPos.y;
    const isThetaSame = currentPos.theta === targetPos.theta;

    if (isXSame && isYSame && isThetaSame) {
        console.log("All values match!");
        return true;
    } else {
        console.log(`X Match: ${isXSame}, Y Match: ${isYSame}, Theta Match: ${isThetaSame}`);
        return false;
    }
}