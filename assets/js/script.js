const apiKey = 'e2ee9ad2eb29f4a7f86758f6e0395c6d',
  cityForm = document.querySelector('.city-form'),
  cityName = document.querySelector('.city-input'),
  inputError = document.querySelector('.validate-city'),
  instruction = document.querySelector('.instruction'),
  inputGroup = document.querySelector('.input-group'),
  weatherContainer = document.querySelector('.weather-container .wrapper'),
  weatherItem = document.querySelector('.weather-items'),
  errorContainer = document.querySelector('.error-container');
let isValid;

// function to fetch weather url
const fetchData = (url) => {
  fetch(url).then((response) => {
    if (response.status === 404) {
      throw 'Please enter proper city name';
    } else {
      return response.json();
    }
  }).then((data) => {
    showData(data);
  }).catch((error) => {
    instruction.classList.add('hide-content');
    errorContainer.classList.remove('hide-content');
    inputError.innerText = error;
  });
}

// validation function
const validateInput = (input) => {
  isValid = true;
  instruction.classList.remove('hide-content');
  if (!input.value) {
    inputError.innerText = "City name can't be null!";
    isValid = false;
  }
  return isValid;
}

// form event
cityForm.addEventListener('submit', (e) => {
  e.preventDefault();
  validateInput(cityName);
  if (isValid === true) {
    errorContainer.classList.add('hide-content');
    weatherItem.innerHTML = '';
    const cityList = cityName.value.split(',');
    for (let i = 0; i < cityList.length; i++) {
      const city = cityList[i].trim();
      const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;
      fetchData(url);
    }
  } else {
    errorContainer.classList.remove('hide-content');
  }
});

// function to create and show data from fetch
const showData = (data) => {
  const dateObj = new Date(),
    day = dateObj.toLocaleString("en", { weekday: 'short' }),
    date = dateObj.getDate(),
    month = dateObj.toLocaleString('default', { month: 'short' }),
    time = dateObj.getHours() + ":" + dateObj.getMinutes(),
    [sH, sM] = time.split(':'),
    iconCode = data.list[0].weather[0].icon,
    weatherList = document.createElement('li'),
    weatherContent = document.createElement('div');
  weatherList.classList.add('weather-list');
  weatherContent.classList.add('weather-content');

  weatherContent.innerHTML = `
    <div class="data-container">
      <div class="city-time">
        <h3 class="city-name">${data.city.name}</h3>
        <span class="date">${sH == 12 ? 12 : sH >= 12 ? sH - 12 : sH}:${sM}${sH >= 12 ? 'PM' : 'AM'}
        </span>
      </div>
      <ul class="today-date">
        <li><span class="day">${day}</span></li>
        <li><span class="date">${date} </span><span class="date-month">${month}</span></li>
      </ul>
    </div>
    <div class="degree-content">
      <figure class="icon">
        <img src="http://openweathermap.org/img/w/${iconCode}.png" alt="">
      </figure>
      <h4 class="degree">${data.list[0].main.temp}°</h4>
    </div>`;
  weatherList.appendChild(weatherContent);
  // five day forecasting start here
  const filterForecast = [];
  data.list.forEach((el, idx) => {
    if (idx > 0) {
      const compareForecast = data.list[idx - 1];
      if (el.dt_txt.slice(0, 10) !== compareForecast.dt_txt.slice(0, 10)) {
        filterForecast.push(el);
      }
    }
  })

  const daysContainer = document.createElement('ul');
  daysContainer.classList.add('days-container');
  filterForecast.forEach(data => {
    const elIcon = data.weather[0].icon,
      elTemp = data.main.temp,
      elDay = new Date(data.dt_txt.split(' ')[0]).toLocaleString("en", { weekday: 'short' }),
      elHumidity = data.main.humidity,
      dayList = document.createElement('li');

    dayList.classList.add('day-list');
    dayList.innerHTML = `
    <ul class="upcoming-date"><li><span class="upcoming-day">${elDay}</span></li>
    <li><figure class="icon">
    <img src="http://openweathermap.org/img/w/${elIcon}.png" alt="">
    </figure></li>
    <li><span class="upcoming-temp">${elTemp}°</span></li>
    <li class="humidity-list"><span>Humidity</span><span>${elHumidity}°</span></li></ul>`;
    daysContainer.appendChild(dayList);
    weatherList.appendChild(daysContainer);
  });
  weatherItem.appendChild(weatherList);
  weatherContainer.appendChild(weatherItem);
}




















