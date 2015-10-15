import "babel/polyfill"

import http   from "http";
import parse  from "./parse";

import {HOST, PATH, DEFAULT_PARAMS} from "./constants";

export default function(event, context) {
  const params = Object.assign({}, DEFAULT_PARAMS, {
    lat: event.lat,
    lng: event.lng,
    range: getRangeCodeFromMeter(event.range)
  });

  const query = Object.keys(params).map(k => `${k}=${params[k]}`).join("&");

  http.get(`${HOST}${PATH.gourmet}?${query}`, (res) => {
    let body = "";
    res.setEncoding("utf8");

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      context.done(null, parse(body));
    });
  }).on("error", (e) => {
      context.fail(e);
  });
}

function getRangeCodeFromMeter(range) {
  if (range <= 300) {
    return 1;
  } else if (range > 300 && range <= 500) {
    return 2;
  } else if (range > 500 && range <= 1000) {
    return 3;
  } else if (range > 1000 && range <= 2000) {
    return 4;
  } else {
    return 5;
  }
}
