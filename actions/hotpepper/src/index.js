import "babel/polyfill"

import http   from "http";
import Parser from "./parser";

import {HOST, PATH, DEFAULT_PARAMS} from "./constants";

export default function(event, context) {
  const queryParams = event.queryParams;
  const params = Object.assign({}, DEFAULT_PARAMS, {
    lat: queryParams.lat,
    lng: queryParams.lng,
    range: getRangeCodeFromMeter(queryParams.range),
    limit: queryParams.limit,
    offset: queryParams.offset
  });

  const query = Object.keys(params).map(k => `${k}=${params[k]}`).join("&");

  http.get(`${HOST}${PATH.gourmet}?${query}`, (res) => {
    let body = "";
    res.setEncoding("utf8");

    res.on("data", (chunk) => {
      body += chunk;
    });

    res.on("end", () => {
      const parser = new Parser(queryParams.lat, queryParams.lng, queryParams.range);
      context.done(null, parser.parse(body));
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
