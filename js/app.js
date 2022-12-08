// //Video und Audio
// //
// function getUserMedia(constraints) {
//   // if Promise-based API is available, use it
//   if (navigator.mediaDevices) {
//     return navigator.mediaDevices.getUserMedia(constraints);
//   }
    
//   // otherwise try falling back to old, possibly prefixed API...
//   var legacyApi = navigator.getUserMedia || navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia || navigator.msGetUserMedia;
    
//   if (legacyApi) {
//     // ...and promisify it
//     return new Promise(function (resolve, reject) {
//       legacyApi.bind(navigator)(constraints, resolve, reject);
//     });
//   }
// }

// function getStream (type) {
//   if (!navigator.mediaDevices && !navigator.getUserMedia && !navigator.webkitGetUserMedia &&
//     !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
//     alert('User Media API not supported.');
//     return;
//   }

//   var constraints = {};
//   constraints[type] = true;
  
//   getUserMedia(constraints)
//     .then(function (stream) {
//       var mediaControl = document.querySelector(type);
      
//       if ('srcObject' in mediaControl) {
//         mediaControl.srcObject = stream;
//       } else if (navigator.mozGetUserMedia) {
//         mediaControl.mozSrcObject = stream;
//       } else {
//         mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
//       }
      
//       mediaControl.play();
//     })
//     .catch(function (err) {
//       alert('Error: ' + err);
//     });
// }
// function getUserMedia(options, successCallback, failureCallback) {
//   var api = navigator.getUserMedia || navigator.webkitGetUserMedia ||
//     navigator.mozGetUserMedia || navigator.msGetUserMedia;
//   if (api) {
//     return api.bind(navigator)(options, successCallback, failureCallback);
//   }
// }

// var theStream;
// var theRecorder;
// var recordedChunks = [];

// function getStream() {
//   if (!navigator.getUserMedia && !navigator.webkitGetUserMedia &&
//     !navigator.mozGetUserMedia && !navigator.msGetUserMedia) {
//     alert('User Media API not supported.');
//     return;
//   }
  
//   var constraints = {video: true, audio: true};
//   getUserMedia(constraints, function (stream) {
//     var mediaControl = document.querySelector('video');
    
//     if ('srcObject' in mediaControl) {
//       mediaControl.srcObject = stream;
//     } else if (navigator.mozGetUserMedia) {
//       mediaControl.mozSrcObject = stream;
//     } else {
//       mediaControl.src = (window.URL || window.webkitURL).createObjectURL(stream);
//     }
    
//     theStream = stream;
//     try {
//       recorder = new MediaRecorder(stream, {mimeType : "video/webm"});
//     } catch (e) {
//       console.error('Exception while creating MediaRecorder: ' + e);
//       return;
//     }
//     theRecorder = recorder;
//     console.log('MediaRecorder created');
//     recorder.ondataavailable = recorderOnDataAvailable;
//     recorder.start(100);
//   }, function (err) {
//     alert('Error: ' + err);
//   });
// }

// function recorderOnDataAvailable(event) {
//   if (event.data.size == 0) return;
//   recordedChunks.push(event.data);
// }

// function download() {
//   console.log('Saving data');
//   theRecorder.stop();
//   theStream.getTracks()[0].stop();

//   var blob = new Blob(recordedChunks, {type: "video/webm"});
//   var url = (window.URL || window.webkitURL).createObjectURL(blob);
//   var a = document.createElement("a");
//   document.body.appendChild(a);
//   a.style = "display: none";
//   a.href = url;
//   a.download = 'test.webm';
//   a.click();
  
//   // setTimeout() here is needed for Firefox.
//   setTimeout(function () {
//       (window.URL || window.webkitURL).revokeObjectURL(url);
//   }, 100); 
// }

// //Location and Position
// //
// var target = document.getElementById('target');
// var watchId;

// function appendLocation(location, verb) {
//   verb = verb || 'updated';
//   var newLocation = document.createElement('p');
//   newLocation.innerHTML = 'Location ' + verb + ': ' + location.coords.latitude + ', ' + location.coords.longitude + '';
//   target.appendChild(newLocation);
// }

// if ('geolocation' in navigator) {
//   document.getElementById('askButton').addEventListener('click', function () {
//     navigator.geolocation.getCurrentPosition(function (location) {
//       appendLocation(location, 'fetched');
//     });
//     watchId = navigator.geolocation.watchPosition(appendLocation);
//   });
// } else {
//   target.innerText = 'Geolocation API not supported.';
// }
// if ('DeviceOrientationEvent' in window) {
//   window.addEventListener('deviceorientation', deviceOrientationHandler, false);
// } else {
//   document.getElementById('logoContainer').innerText = 'Device Orientation API not supported.';
// }

// function deviceOrientationHandler (eventData) {
//   var tiltLR = eventData.gamma;
//   var tiltFB = eventData.beta;
//   var dir = eventData.alpha;
  
//   document.getElementById("doTiltLR").innerHTML = Math.round(tiltLR);
//   document.getElementById("doTiltFB").innerHTML = Math.round(tiltFB);
//   document.getElementById("doDirection").innerHTML = Math.round(dir);

//   var logo = document.getElementById("imgLogo");
//   logo.style.webkitTransform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
//   logo.style.MozTransform = "rotate(" + tiltLR + "deg)";
//   logo.style.transform = "rotate(" + tiltLR + "deg) rotate3d(1,0,0, " + (tiltFB * -1) + "deg)";
// }

//contacts
function readContacts() {
  var api = (navigator.contacts || navigator.mozContacts);
    
  if (api && !!api.select) { // new Chrome API
    api.select(['name', 'email'], {multiple: true})
      .then(function (contacts) {
        consoleLog('Found ' + contacts.length + ' contacts.');
        if (contacts.length) {
          consoleLog('First contact: ' + contacts[0].name + ' (' + contacts[0].email + ')');
        }
      })
      .catch(function (err) {
        consoleLog('Fetching contacts failed: ' + err.name);
      });
      
  } else if (api && !!api.find) { // old Firefox OS API
    var criteria = {
      sortBy: 'familyName',
      sortOrder: 'ascending'
    };

    api.find(criteria)
      .then(function (contacts) {
        consoleLog('Found ' + contacts.length + ' contacts.');
        if (contacts.length) {
          consoleLog('First contact: ' + contacts[0].givenName[0] + ' ' + contacts[0].familyName[0]);
        }
      })
      .catch(function (err) {
        consoleLog('Fetching contacts failed: ' + err.name);
      });
      
  } else {
    consoleLog('Contacts API not supported.');
  }
}
// //offline storage
// if ('localStorage' in window || 'sessionStorage' in window) {
//   var selectedEngine;

//   var logTarget = document.getElementById('target');
//   var valueInput = document.getElementById('value');

//   var reloadInputValue = function () {
//   console.log(selectedEngine, window[selectedEngine].getItem('myKey'))
//     valueInput.value = window[selectedEngine].getItem('myKey') || '';
//   }
  
//   var selectEngine = function (engine) {
//     selectedEngine = engine;
//     reloadInputValue();
//   };

//   function handleChange(change) {
//     var timeBadge = new Date().toTimeString().split(' ')[0];
//     var newState = document.createElement('p');
//     newState.innerHTML = '' + timeBadge + ' ' + change + '.';
//     logTarget.appendChild(newState);
//   }

//   var radios = document.querySelectorAll('#selectEngine input');
//   for (var i = 0; i < radios.length; ++i) {
//     radios[i].addEventListener('change', function () {
//       selectEngine(this.value)
//     });
//   }
  
//   selectEngine('localStorage');

//   valueInput.addEventListener('keyup', function () {
//     window[selectedEngine].setItem('myKey', this.value);
//   });

//   var onStorageChanged = function (change) {
//     var engine = change.storageArea === window.localStorage ? 'localStorage' : 'sessionStorage';
//     handleChange('External change in ' + engine + ': key ' + change.key + ' changed from ' + change.oldValue + ' to ' + change.newValue + '');
//     if (engine === selectedEngine) {
//       reloadInputValue();
//     }
//   }

//   window.addEventListener('storage', onStorageChanged);
// }
// function consoleLog(data) {
//   var logElement = document.getElementById('log');
//   logElement.innerHTML += data + '\n';
// }
// //file access
// function getReadFile(reader, i) {
//   return function () {
//     var li = document.querySelector('[data-idx="' + i + '"]');

//     li.innerHTML += 'File starts with "' + reader.result.substr(0, 25) + '"';
//   }
// }

// function readFiles(files) {
//   document.getElementById('count').innerHTML = files.length;

//   var target = document.getElementById('target');
//   target.innerHTML = '';

//   for (var i = 0; i < files.length; ++i) {
//     var item = document.createElement('li');
//     item.setAttribute('data-idx', i);
//     var file = files[i];

//     var reader = new FileReader();
//     reader.addEventListener('load', getReadFile(reader, i));
//     reader.readAsText(file);

//     item.innerHTML = '' + file.name + ', ' + file.type + ', ' + file.size + ' bytes, last modified ' + file.lastModifiedDate + '';
//     target.appendChild(item);
//     window.localStorage.setItem("My File", file);
//   }
// }

// async function writeFile() {
//   if (!window.chooseFileSystemEntries) {
//     alert('Native File System API not supported');
//     return;
//   }
  
//   const target = document.getElementById('target');
//   target.innerHTML = 'Opening file handle...';
  
//   const handle = await window.chooseFileSystemEntries({
//     type: 'save-file',
//   });
  
//   const file = await handle.getFile()
//   const writer = await handle.createWriter();
//   await writer.write(0, 'Hello world from What Web Can Do!');
//   await writer.close()
  
//   target.innerHTML = 'Test content written to ' + file.name + '.';
// }
// //storage quotas
// if ('storage' in navigator && 'estimate' in navigator.storage) {
//   navigator.storage.estimate()
//     .then(estimate => {
//       document.getElementById('usage').innerHTML = estimate.usage;
//       document.getElementById('quota').innerHTML = estimate.quota;
//       document.getElementById('percent').innerHTML = (estimate.usage * 100 / estimate.quota).toFixed(0);
//     });
// }

// if ('storage' in navigator && 'persisted' in navigator.storage) {
//   navigator.storage.persisted()
//     .then(persisted => {
//       document.getElementById('persisted').innerHTML = persisted ? 'persisted' : 'not persisted';
//     });
// }

// function requestPersistence() {
//   if ('storage' in navigator && 'persist' in navigator.storage) {
//     navigator.storage.persist()
//       .then(persisted => {
//         document.getElementById('persisted').innerHTML = persisted ? 'persisted' : 'not persisted';
//       });
//   }
// }
//Local Notification
var $status = document.getElementById('status');

if ('Notification' in window) {
  $status.innerText = Notification.permission;
}

function requestPermission() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  Notification.requestPermission(function (result) {
    $status.innerText = result;
  });
}

function nonPersistentNotification() {
  if (!('Notification' in window)) {
    alert('Notification API not supported!');
    return;
  }
  
  try {
    var notification = new Notification("Hi there - non-persistent!");
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}

function persistentNotification() {
  if (!('Notification' in window) || !('ServiceWorkerRegistration' in window)) {
    alert('Persistent Notification API not supported!');
    return;
  }
  
  try {
    navigator.serviceWorker.getRegistration()
      .then((reg) => reg.showNotification("Hi there - persistent!"))
      .catch((err) => alert('Service Worker registration error: ' + err));
  } catch (err) {
    alert('Notification API error: ' + err);
  }
}
// //Permission
if ('permissions' in navigator) {
  var logTarget = document.getElementById('logTarget');

  function handleChange(permissionName, newState) {
    var timeBadge = new Date().toTimeString().split(' ')[0];
    var newStateInfo = document.createElement('p');
    newStateInfo.innerHTML = '' + timeBadge + ' State of ' + permissionName + ' permission status changed to ' + newState + '.';
    logTarget.appendChild(newStateInfo);
  }

  function checkPermission(permissionName, descriptor) {
    try {
    navigator.permissions.query(Object.assign({name: permissionName}, descriptor))
      .then(function (permission) {
        document.getElementById(permissionName + '-status').innerHTML = permission.state;
        permission.addEventListener('change', function (e) {
          document.getElementById(permissionName + '-status').innerHTML = permission.state;
          handleChange(permissionName, permission.state);
        });
      });
    } catch (e) {
    }
  }

  checkPermission('geolocation');
  checkPermission('notifications');
  checkPermission('push', {userVisibleOnly: true});
  checkPermission('midi', {sysex: true});
  checkPermission('camera');
  checkPermission('microphone');
  checkPermission('background-sync');
  checkPermission('ambient-light-sensor');
  checkPermission('accelerometer');
  checkPermission('gyroscope');
  checkPermission('magnetometer');

  var noop = function () {};
  navigator.getUserMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
  
  function requestGeolocation() {
    navigator.geolocation.getCurrentPosition(noop);
  }

  function requestNotifications() {
    Notification.requestPermission();
  }

  function requestPush() {
    navigator.serviceWorker.getRegistration()
      .then(function (serviceWorkerRegistration) {
        serviceWorkerRegistration.pushManager.subscribe();
      });
  }

  function requestMidi() {
    navigator.requestMIDIAccess({sysex: true});
  }
  
  function requestCamera() {
    navigator.getUserMedia({video: true}, noop, noop)
  }
  
  function requestMicrophone() {
    navigator.getUserMedia({audio: true}, noop, noop)
  }
}
//Service Worker
//
if ("serviceWorker" in navigator) {
  window.addEventListener("load", function() {
    navigator.serviceWorker
      .register("/serviceWorker.js")
      .then(res => console.log("service worker registered"))
      .catch(err => console.log("service worker not registered", err));
  });
}
