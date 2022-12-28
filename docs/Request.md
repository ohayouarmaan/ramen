# The Request Class

It's a wrapper for the `req` object from the `http` module. The constructor takes in the http `req` object and from that, It is able to
retreive different properties such as the method used for that request, the headers passed on, which url was used, all the query parameters and the request body.

if you want a brief idea about the request object you can use the `Request.define` method, It will define the coming request a little. 
The parse method is an internal method which basically parses the url to get all the query parameters. And the addParams is also an internal method, It allows the main server class to add the request parameters.
Which means if you have a route defined like `/foo/:x` where x is a parameter and the user goes to `/foo/bar` you can access the value 
of `x` which is `bar` via `Request.params.x`
