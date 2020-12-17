$("document").ready(function () {
      var recentCities = JSON.parse(localStorage.getItem("cities")) || []
      function getWeather(cityName) {
            var currentWthrURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/weather?q=" + cityName + "&units=imperial&appid=af1a956362d5886e7e0d1d06e4b5d0a0"
            $.ajax({
                  url: currentWthrURL,
                  method: "GET"
            }).then(function (response) {
                  console.log(response)
                  var now = moment()
                  var future1 = moment().add(1, 'days').format("MM/DD")
                  var future2 = moment().add(2, 'days)').format("MM/DD")
                  var future3 = moment().add(3, 'days').format("MM/DD")
                  var future4 = moment().add(4, 'days').format("MM/DD")
                  var future5 = moment().add(5, 'days').format("MM/DD")

                  $("#wthrIcn").attr("src", "http://openweathermap.org/img/wn/" + response.weather[0].icon + ".png")
                  $("#city-date-wthr-icon").text(response.name + ", " + response.sys.country + ", " + now.format("MMM Do YYYY, h:mm a"))
                  $("#currentTemp").text("Temperature: " + Math.floor(response.main.temp) + " \u00B0" + "F")
                  $("#currentHum").text("Humidity: " + response.main.humidity + "%")
                  $("#currentSpeed").text("Wind Speed: " + response.wind.speed + " mph")

                  var uvURL = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/uvi?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&appid=af1a956362d5886e7e0d1d06e4b5d0a0"

                  $.ajax({
                        url: uvURL,
                        method: "GET"
                  }).then(function (uvResponse) {
                        console.log(uvResponse)
                        $("#currentUV").text("UV Index: ")
                        $("#uvText").text(uvResponse.value)
                        $("#uvText").attr("style", "background-color: #DB5461; color: white; border-radius: 6px; padding: 2px 4px;")
                  })
                  //Dates for forecast cards
                  $("#future1day").text(future1)
                  $("#future2day").text(future2)
                  $("#future3day").text(future3)
                  $("#future4day").text(future4)
                  $("#future5day").text(future5)
                  //weather symbols, temps, annd humidity for forecast cards
                  var foreCastUrl = "https://cors-anywhere.herokuapp.com/http://api.openweathermap.org/data/2.5/onecall?lat=" + response.coord.lat + "&lon=" + response.coord.lon + "&units=imperial&cnt=5&appid=af1a956362d5886e7e0d1d06e4b5d0a0"
                  $.ajax({
                        url: foreCastUrl,
                        method: "GET"
                  }).then(function (future) {
                        console.log(future)

                        $("#futurewthrSym1").attr("src", "http://openweathermap.org/img/wn/" + future.daily[0].weather[0].icon + ".png")
                        $("#futurewthrSym2").attr("src", "http://openweathermap.org/img/wn/" + future.daily[1].weather[0].icon + ".png")
                        $("#futurewthrSym3").attr("src", "http://openweathermap.org/img/wn/" + future.daily[2].weather[0].icon + ".png")
                        $("#futurewthrSym4").attr("src", "http://openweathermap.org/img/wn/" + future.daily[3].weather[0].icon + ".png")
                        $("#futurewthrSym5").attr("src", "http://openweathermap.org/img/wn/" + future.daily[4].weather[0].icon + ".png")

                        $("#futurehigh1").text("High: " + Math.floor(future.daily[0].temp.max) + " \u00B0" + "F")
                        $("#futurehigh2").text("High: " + Math.floor(future.daily[1].temp.max) + " \u00B0" + "F")
                        $("#futurehigh3").text("High: " + Math.floor(future.daily[2].temp.max) + " \u00B0" + "F")
                        $("#futurehigh4").text("High: " + Math.floor(future.daily[3].temp.max) + " \u00B0" + "F")
                        $("#futurehigh5").text("High: " + Math.floor(future.daily[4].temp.max) + " \u00B0" + "F")

                        $("#futurelow1").text("Low: " + Math.floor(future.daily[0].temp.min) + " \u00B0" + "F")
                        $("#futurelow2").text("Low: " + Math.floor(future.daily[1].temp.min) + " \u00B0" + "F")
                        $("#futurelow3").text("Low: " + Math.floor(future.daily[2].temp.min) + " \u00B0" + "F")
                        $("#futurelow4").text("Low: " + Math.floor(future.daily[3].temp.min) + " \u00B0" + "F")
                        $("#futurelow5").text("Low: " + Math.floor(future.daily[4].temp.min) + " \u00B0" + "F")

                        $("#futureHum1").text("Humidity: " + future.daily[0].humidity + "%")
                        $("#futureHum2").text("Humidity: " + future.daily[1].humidity + "%")
                        $("#futureHum3").text("Humidity: " + future.daily[2].humidity + "%")
                        $("#futureHum4").text("Humidity: " + future.daily[3].humidity + "%")
                        $("#futureHum5").text("Humidity: " + future.daily[4].humidity + "%")
                  })
            })
      }

      $("button").on("click", function () {
            const cityName = $("#locationInput").val()
            if (cityName == "" || cityName == "null" || cityName == "Null") {
                  alert("Enter a valid city")
                  return
            } else {
                  getWeather(cityName)
                  recentCities.push(cityName)
                  localStorage.setItem("cities", JSON.stringify(recentCities))
                  renderSearchHistory()
            }

      })

      $("#clearButton").on("click", function () {
            checkDupCities = []
            uniqueCities = []
            recentCities = []
            localStorage.clear()
            $("input").remove("#recentCity")
            window.location.reload()
      })

      function renderSearchHistory() {
            const historyEl = $("#recentSearchSection").html("")
            var retrievedCities = localStorage.getItem("cities")
            var checkDupCities = JSON.parse(retrievedCities)
            let uniqueCities = [...new Set(checkDupCities)]
            for (let i = 0; i < uniqueCities.length; i++) {
                  const historyItem = $("<input>")
                  historyItem.attr("type", "text")
                  historyItem.attr("readonly", true)
                  historyItem.attr("id", "recentCity")
                  historyItem.attr("value", uniqueCities[i])
                  historyItem.on("click", function () {
                        getWeather(historyItem.val())
                  })
                  historyEl.append(historyItem)
            } if (uniqueCities.length > 0) {
                  getWeather(uniqueCities[uniqueCities.length - 1])
            }
      }
      renderSearchHistory()


})