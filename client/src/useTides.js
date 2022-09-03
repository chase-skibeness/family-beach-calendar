import { useState, useEffect } from 'react';

function useTides({ startDate, endDate }) {
  const [tideInfo, setTideInfo] = useState({ predictions: [] });
  let dateOrganizedTideArray = [];
  let tidiedTideInfo = [];
  const tideBaseURL =
    'https://api.tidesandcurrents.noaa.gov/api/prod/datagetter?product=predictions&datum=MLLW&station=9446583&time_zone=lst_ldt&units=english&interval=hilo&format=json&application=NOS.COOPS.TAC.TidePred';

  useEffect(() => {
    const fetchTideData = async () => {
      try {
        await fetch(tideBaseURL + `&begin_date=${startDate}&end_date=${endDate}`, {
          headers: {
            accept: '*/*',
            'accept-language': 'en-US,en;q=0.9',
            'sec-ch-ua': '"Chromium";v="104", " Not A;Brand";v="99", "Google Chrome";v="104"',
            'sec-ch-ua-mobile': '?0',
            'sec-ch-ua-platform': '"Windows"',
            'sec-fetch-dest': 'empty',
            'sec-fetch-mode': 'cors',
            'sec-fetch-site': 'cross-site'
          },
          referrerPolicy: 'strict-origin-when-cross-origin',
          body: null,
          method: 'GET',
          mode: 'cors',
          credentials: 'omit'
        })
          .then((response) => response.json())
          .then((responseJson) => setTideInfo(responseJson));
      } catch (error) {
        console.error(error);
      }
    };

    fetchTideData();
  }, []);

  for (let i = 0; i < tideInfo.predictions.length - 1; i++) {
    if (tideInfo.predictions[i].t.slice(0, 10) != tideInfo.predictions[i + 1].t.slice(0, 10)) {
      dateOrganizedTideArray.push(
        tideInfo.predictions.filter(
          (tidePrediction) =>
            tideInfo.predictions[i].t.slice(0, 10) == tidePrediction.t.slice(0, 10)
        )
      );
    }
  }

  dateOrganizedTideArray.map((tidePredicitions) => {
    tidiedTideInfo.push({
      lowTide: tidePredicitions.sort(
        (prevTidePrediction, nextTidePrediction) =>
          parseFloat(prevTidePrediction.v) - parseFloat(nextTidePrediction.v)
      )[0],
      highTide: tidePredicitions.sort(
        (prevTidePrediction, nextTidePrediction) =>
          parseFloat(nextTidePrediction.v) - parseFloat(prevTidePrediction.v)
      )[0]
    });
  });

  return tidiedTideInfo;
}

export default useTides;
