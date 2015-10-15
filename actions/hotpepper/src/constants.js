import * as secrets from "./secrets";

export const API_KEY = secrets.API_KEY;
export const HOST = "http://webservice.recruit.co.jp";
export const PATH = {
  gourmet: "/hotpepper/gourmet/v1/"
};

export const DEFAULT_PARAMS = {
  key: API_KEY,
  format: "json",
  datum: "world"
};
