# Ramen - A micro framework for creating REST API in Nodejs
![Ramen image i got from google lol](https://res.cloudinary.com/practicaldev/image/fetch/s--QGRMnu9Q--/c_limit%2Cf_auto%2Cfl_progressive%2Cq_auto%2Cw_880/https://dev-to-uploads.s3.amazonaws.com/uploads/articles/nfg8h1baize3kntwatl5.png)

Just another ✨Backend API Framework✨ for javascript
## The plan
Currently it's just me trying to create a javascript framework for making APIs. This is definitely inspired from the Express framework

the `Server` class in `main.js` file can be initialized which will create an HTTP server and you can use the listen function to listen to a specific port

the `Request` class in the `Request.js` file holds the request object which can be used to access all the properties for the http request.

### How to use Ramen

Using the annotations syntax
```typescript
import Ramen, {Request, Response} from "ramen"
import { Route, Get } from "ramen/router"; 

const ramen = new Ramen();

@Route("/posts")
class PostRouter {
    @Get("/:id")
    fetchPostWithId(req: Request, res: Response) {
        const postId = req.params.id;
        const post: object = fetchPost(postId);
        return res.send(post);
    }
}

ramen.use("/api", PostRouter);

ramen.listen(port || process.env.PORT, (_port) => {
    console.log(`[SERVER]: Running on port ${_port}`);
});
```
