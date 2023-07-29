# The Response class

The response class is basically a wrapper around the default http response object, It's made easy to use and is pretty cool.
What it does is the constructor takes in the response object given by the http module and then adds a default status code of 200
and the send function takes two parameters

* `data`: Data which you want to send
* `status`: (optional) the status code which you want to send this data with