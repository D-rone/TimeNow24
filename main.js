let timeZone = jstz.determine().name();
let clock = document.getElementById("clock");
let start = new Date().getTime();
let sync = 0;
let noErr = true;
let timeObject = await fetch(
  "https://worldtimeapi.org/api/timezone/" + timeZone
)
  .then((response) => response.json())
  .then((time) => {
    sync = new Date().getTime() - start;
    return time.unixtime * 1000 + sync;
  })
  .catch((e) => {
    noErr = false;
    clock.innerHTML = e;
  });

let diff = async () => {
  let sDate = new Date(timeObject);
  let nDate = new Date();
  let res = {
    hours: Math.abs(sDate.getHours() - nDate.getHours()),
    mins: Math.abs(sDate.getMinutes() - nDate.getMinutes()),
    secs: Math.abs(sDate.getSeconds() - nDate.getSeconds()),
  };
  return res;
};

let updateTime = async (TO) => {
  if (noErr) {
    timeObject += 1000;
  }
  TO += 1000;
  let date = new Date(TO);
  let hours = date.getHours();
  let mins = date.getMinutes();
  let secs = date.getSeconds();
  hours = hours < 10 ? "0" + hours : hours;
  let ampm = document.getElementById("ampm");

  if (hours >= 12) {
    hours -= 12;
    ampm.innerHTML = "PM";
  } else {
    ampm.innerHTML = "AM";
  }
  let time = `${hours}:${mins < 10 ? "0" + mins : mins}:${
    secs < 10 ? "0" + secs : secs
  } `;
  clock.innerHTML = time;
};

setInterval(() => {
  if (noErr) {
    updateTime(timeObject);
  } else {
    updateTime(new Date().getTime() - 1000);
  }
}, 1000);
if (noErr) {
  diff().then(({ hours, mins, secs }) => {
    let diffStr = `Your clock is offset: ${hours} hours, ${mins} minutes, ${secs} seconds`;
    document.getElementById("diff").innerHTML = diffStr;
  });
} else {
  document.getElementById("diff").innerHTML =
    "Something went wrong! \n Here's your local clock";
}
