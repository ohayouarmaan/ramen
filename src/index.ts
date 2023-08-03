import Ramen from "./server";
import {default as r} from "./router";
import { Route as route, Get as get, Use as use } from "./router";
import {default as request} from "./Request";
import {default as response} from "./Response";

export const Router = r;
export const Route = route;
export const Get = get;
export const Use = use;
export const Request = request;
export const Response = response;
export default Ramen;
