# How the Route Parsing works
this is still a work in progress but basically what happens is

You create a Callback for every path you want to repond to and and that callback alongside with it's path gets added to a graph and then whenever a request comes in we will have to loop through all the paths in the graph and try to match it if it matches then we'll pass the request and the response object to the callback which can then be used to process the request and send a proper response
