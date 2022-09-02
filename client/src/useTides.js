import { useState, useEffect } from 'react';

function useTides({ startDate, endDate }) {
  const [tideInfo, setTideInfo] = useState({ predictions: [] });
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

  const tidiedTideInfo = {
    lowTide: tideInfo.predictions.sort(
      (prevTidePrediction, nextTidePrediction) =>
        parseFloat(prevTidePrediction.v) - parseFloat(nextTidePrediction.v)
    )[0],
    highTide: tideInfo.predictions.sort(
      (prevTidePrediction, nextTidePrediction) =>
        parseFloat(nextTidePrediction.v) - parseFloat(prevTidePrediction.v)
    )[0]
  };

  return tidiedTideInfo;
}

export default useTides;
