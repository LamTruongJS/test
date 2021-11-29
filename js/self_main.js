const colors = () => {
  return randomColor({
    count: 8,
    luminosity: 'bright',
    format: 'rgb',
  });
};

const randomNumber = (first, second) => {
  let arrayNumber = [];

  for (let i = 0; i < second + 1; i++) {
    let number = Math.round(Math.random() * (second - first)) + first;
    if (!arrayNumber.includes(number)) {
      arrayNumber.push(number);
    } else i = i - 1;
  }
  return arrayNumber;
};
const setColor = (listArea) => {
  let color = colors();

  let numberSit = randomNumber(0, listArea.length - 1);

  if (numberSit.length < listArea.length) return '';
  for (let i = 0; i < listArea.length; i++) {
    let index = Math.trunc(i / 2);
    listArea[numberSit[i]].querySelector('.overlay').style.backgroundColor = color[index];
  }
};
const checkColorCommon = (arrayDone, arrayIndex, arrayResult) => {
  let result = false;
  if (arrayDone.length < 2) return false;
  const itemOne = arrayDone[0].querySelector('.overlay').style.backgroundColor;
  const itemTwo = arrayDone[1].querySelector('.overlay').style.backgroundColor;

  if (itemOne.toString() === itemTwo.toString()) {
    arrayDone[0].classList.add('active');
    arrayDone[1].classList.add('active');
    document.querySelector('section').style.backgroundColor = itemTwo;
    arrayResult.push(...arrayIndex);

    arrayDone == [];
    arrayIndex = [];

    return true;
  }
  return result;
};

const playGame = (item, listArea, arrayDone, index, arrayIndex, arrayResult, time, status) => {
  if (status.type !== 'play') return;
  item.addEventListener('click', () => {
    const checkStatus = setStatus(status);
    if (checkStatus !== 'play') return;
    if (arrayResult.includes(index)) return;
    if (arrayIndex.length === 1 && arrayIndex.indexOf(index) === 0) return;

    item.classList.add('active');

    let isCommonColor = checkColorCommon(arrayDone, arrayIndex, arrayResult);

    if (arrayDone.length < 2) {
      arrayDone.push(item);
      arrayIndex.push(index);
    } else {
      if (arrayIndex.indexOf(index) < 0) {
        arrayDone.push(item);
        arrayDone.shift();
        arrayIndex.push(index);
        arrayIndex.shift();
        isCommonColor = checkColorCommon(arrayDone, arrayIndex, arrayResult);
      }
    }

    if (!isCommonColor) {
      setTimeout(() => {
        item.classList.remove('active');
      }, 250);
    }
  });
};
const checkWinGame = (arrayResult, listArea, time, intervalID) => {
  const newArray = Array.from(new Set(arrayResult));
  if (time > 0 && newArray.length === listArea.length) {
    const inputConfirm = document.querySelector('.game__win__confirm');
    inputConfirm.classList.add('show');
    clearInterval(intervalID);
    moveNewPage(inputConfirm);
  }
};

const moveNewPage = (inputConfirm) => {
  inputConfirm.value = '';
  inputConfirm.addEventListener('keydown', (e) => {
    if (e.which === 13) {
      if (inputConfirm.value === '1912') {
        const hostName = window.location.host;
        const pathName = '/birthDay/index.html';
        const newUrl = hostName.concat(pathName);
        console.log(newUrl);
        window.location.assign(newUrl);
      } else {
        document.querySelector('.game__win__desc').classList.add('show');
      }
    }
    if (inputConfirm.value === '') {
      document.querySelector('.game__win__desc').classList.remove('show');
    }
  });
};

const resetGame = (arrayResult, listArea, time, status) => {
  const newArray = Array.from(new Set(arrayResult));
  if (time > 0 || newArray.length === listArea.length) return;
  if (time <= 0 && newArray.length !== listArea.length) {
    status.type = 'gameOver';
    const resetBtn = document.querySelector('.game__button');
    resetBtn.classList.add('show');
    resetBtn.addEventListener('click', () => {
      handleResetGame(arrayResult, listArea, time);
    });
  }
};
const handleResetGame = (arrayResult, listArea, time) => {
  for (let i = 0; i < listArea.length; i++) {
    listArea[i].classList.remove('active');
  }

  document.querySelector('.game__button').classList.remove('show');
  firstRun();
};

const timePlayGame = (arrayResult, listArea, time, status) => {
  document.querySelector('.game__timer').textContent = time;
  let intervalID = setInterval(() => {
    if (time >= 0) {
      if (time < 10) time = '0' + time;
      document.querySelector('.game__timer').textContent = time;
      checkWinGame(arrayResult, listArea, time, intervalID);
      resetGame(arrayResult, listArea, time, status);
    }
    time--;
    if (time < 0) {
      resetGame(arrayResult, listArea, time, status);
      clearInterval(intervalID);
    }
  }, 1000);
};
const checkTime = () => {
  return document.querySelector('.game__timer').textContent;
};
const setStatus = (status) => {
  const currentTime = checkTime();
  if (Number(currentTime) <= 0) {
    return (status.type = 'game__over');
  }
  return status.type;
};
const main = (listArea, time, arrayDone, arrayResult, arrayIndex, status) => {
  timePlayGame(arrayResult, listArea, time, status);
  for (let index = 0; index < listArea.length; index++) {
    playGame(listArea[index], listArea, arrayDone, index, arrayIndex, arrayResult, time, status);
  }
};

const firstRun = () => {
  let status = { type: 'play' };
  let time = 30;
  let arrayDone = [];
  let arrayIndex = [];
  let arrayResult = [];

  const ulElement = document.getElementById('colorList');
  const listArea = ulElement.querySelectorAll('li');

  main(listArea, time, arrayDone, arrayResult, arrayIndex, status);
  setColor(listArea);
};
firstRun();
