#Testing AS Server

Tests are done with the [Mocha Framework](http://visionmedia.github.io/mocha/).

Test can easily run with:
>npm test

Remember to do it in the same folder where is the package.json.

Npm test is a script inside the package.json and it translates into
```js
mocha test -R spec -t 3000
```

Where you can define the timeout -t for the async test and the output of the test.