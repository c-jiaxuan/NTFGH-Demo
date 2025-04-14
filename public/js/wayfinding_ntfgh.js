let destinations = {};   // Dictionary to store all destinations
destinations['Clinic A21'] = 's_c2a92071e3f2b297';
destinations['Outpatient & Retail Pharmacy'] = 's_26733d42d8a1c6cd';
destinations['Westgate MRT'] = 's_f3a6c0b32a9e0119';
destinations['Clinic A23'] = 's_ca970892e5db643b';
destinations['ATM'] = 's_6087e63b50cec4b0';
destinations['Self Registration Kiosk'] = 's_0e620fda8c949b29';

const iframe = document.getElementById('wayfinding-iframe');

function openWayfinding() {
    document.getElementById('wayfinding-modal').classList.remove('hidden');
    iframe.src = "https://app.mappedin.com/map/67b44dcc845fda000bf29a25?you-are-here=1.33481094%2C103.74408976";
}

function closeWayfinding() {
    document.getElementById('wayfinding-modal').classList.add('hidden');
}

function checkDestinations(stringName) {
    for (const key in destinations) {
        if(includeString(stringName, key)) {
            console.log("Found destination in wayfinding");
            return destinations[key];    // Return the key of the location if there is a match
        }
    }
    console.log("Unable to find destination in wayfinding");
    return null;
}

function setDestination(destination) {
    console.log("Setting destination to: " + destination);
    iframe.contentWindow.postMessage({
        type: 'set-state',
        payload: {
            state: '/directions', // or '/'
            floor: '',
            location: destination,
            departure: 's_0e620fda8c949b29'
        }
    }, "https://app.mappedin.com/map/67b44dcc845fda000bf29a25?you-are-here=1.33481094%2C103.74408976");
}