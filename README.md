# @Angular mock router

**MockRouterModule** - lightweight tool that intercepts Http requests and send you your own responses instead backend

**Basic usage**

```typescript
import { NgModule, Component, Input } from '@angular/core';
import { environment } from '../../environments/environment';
import { 
    MockRouterModule, 
    MockRoutes 
} from 'angular-mock-router';

const mockRoutes: MockRoutes = [
    {
        url: 'user/:id', /* any available url */
        method: 'GET', /* 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' */
        delay: 200, /* response timeout */
        handler: (request: MockRequest) => { /* handler which returns HttpResponse */
            /* 
            * this.http.get('api/user/2').subscribe(data => {
            *   console.log(data); // => user id is 2
            * });
            */
            return {
                userData: 'user id is ${request.query.id}'
            }
        },
    },
]

@NgModule({
  imports: [
    MockRouterModule.forRoot({
        routes: mockRoutes, // required option
        delay: 50 // set timeout for all responses, default delay - 100ms
        logResponse: (route: MockRoute, request: MockRequest, response: HttpResponse<any>) => {
            // log you responses or use default
        },
        prefix: 'api' // add "api" for every url. "user/:id" => "api/user/:id",
    })
  ]
})
export class AppModule { }
```

### MockRoute

#### url

Routes urls works the similar to angular routes. 

`user` => `user` - good

`user/info` => `user/info` - good

`user/:id` => `user/1` - good

`user/:id/info` => `user/1/info` - good

`user` => `users` - bad

`user/:id` => `user` - bad

`user/id` => `user/1` - bad

`user/:id` => `user/1/info` - bad

`user/:id/info` => `user/1` - bad

In this cases **:id** - are named URL segment that are used to capture the values specified at their position in the URL. The captured values are populated in the **request.query** object, with the name of the route parameter specified in the path as their respective keys.

Route path: /users/:userId/info/:postId

Request URL: http://localhost:4200/users/2/post/21

req.query: { "userId": "2", "postId": "21" }

#### handler

**handler** - required parameter in route, returns response with data. If returned data is "null" or "undefined" it will return HttpResponse with status 204.

```typescript
[{
    url: 'user',
    method: 'GET',
    handler: (request: MockRequest) => null
}]
```

will return

```typescript
this.http.get('user').subscribe(data => {
    console.log(data); // => null
});
```

If mock routes didn't have any matches interceptor will run `next.handle(request)` and *HttpClient* will send real HttpResponse and if server will not respond too - we will get *HttpErrorResponse*. 

Also you can send your own response

```typescript
{
    url: 'user',
    method: 'GET',
    handler: (request: MockRequest) => new HttpResponse({
        body: {...},
        headers: {...},
        status: 201
    })
}
```
