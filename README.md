# Backend [jsramverk.se - Projekt](https://jsramverk.se/project)

[![Scrutinizer Code Quality](https://scrutinizer-ci.com/g/sonnerberg/jsramverk-project-backend/badges/quality-score.png?b=main)](https://scrutinizer-ci.com/g/sonnerberg/jsramverk-project-backend/?branch=main) [![Code Coverage](https://scrutinizer-ci.com/g/sonnerberg/jsramverk-project-backend/badges/coverage.png?b=main)](https://scrutinizer-ci.com/g/sonnerberg/jsramverk-project-backend/?branch=main) [![Build Status](https://scrutinizer-ci.com/g/sonnerberg/jsramverk-project-backend/badges/build.png?b=main)](https://scrutinizer-ci.com/g/sonnerberg/jsramverk-project-backend/build-status/main) [![Build Status](https://travis-ci.com/sonnerberg/jsramverk-project-backend.svg?branch=main)](https://travis-ci.com/sonnerberg/jsramverk-project-backend)

## Technology choices

During the start of the summer of 2020 I came across a book that I found very interesting
which is called [JavaScript Everywhere](https://www.oreilly.com/library/view/javascript-everywhere/9781492046974/).
During the same time period I came across GraphQL for the first time in the Massive Open Online Course (MOOC)
[FullstackOpen](https://fullstackopen.com/en/part8). When it came time for the project in the course
[jsramverk.se](https://jsramverk.se/) I decided to try to make use of Apollo and GraphQL, both tools
being described in both JavaScript Everywhere and at FullstackOpen.

The reason for choosing GraphQL over REST is mostly because I think GraphQL seems to be an interesting
technology that I wanted to try out. This project felt like a good opportuinty to get my feet wet.

### [express - npm](https://www.npmjs.com/package/express)

I have been using [Express - Node.js web application framework](http://expressjs.com/) earlier in the course
and I felt it would be interesting to keep using Express together with GraphQL.

### [apollo-server-express - npm](https://www.npmjs.com/package/apollo-server-express)

As both of my main sources for information about GraphQL are using
[Apollo GraphQL | Apollo Data Graph Platform— unify APIs, microservices, and databases into a data graph that you can query with GraphQL](https://www.apollographql.com/)
, this is what I decided to use for the GraphQL implementation in my project.

### [bcrypt - npm](https://www.npmjs.com/package/bcrypt)

`bcrypt` is described at [jsramverk.se](https://jsramverk.se/), [Full stack open 2020](https://fullstackopen.com/en)
and in [JavaScript Everywhere](https://www.oreilly.com/library/view/javascript-everywhere/9781492046974/)
for hashing passwords in a database. This is why I decided to use this library for hashing passwords.

### [colors - npm](https://www.npmjs.com/package/colors)

The colors package is used to colorize the terminal output on the command line. I used this package to make
my terminal output look a bit nicer.

This package is a candidate for deletion if minimizing the application size is deemed necessary as it does
not provide any necessary functionality for the application to work.

### [cors - npm](https://www.npmjs.com/package/cors)

The `cors` express middleware is used to allow requests from different sources.

### [dotenv - npm](https://www.npmjs.com/package/dotenv)

The `dotenv` package is used to read environment variables from an `.env` file.
This is a popular package for reading environment variables and by using a file
that has been ignored by git for storing enviroment variables, security is hardened.

### [graphql-iso-date - npm](https://www.npmjs.com/package/graphql-iso-date)

This package is used in the application to store timestamps in the database for
events. The package is mentioned in
[JavaScript Everywhere](https://www.oreilly.com/library/view/javascript-everywhere/9781492046974/)
and that is why I decided to use it.

### [helmet - npm](https://www.npmjs.com/package/helmet)

`helmet` is also decribed in
[JavaScript Everywhere](https://www.oreilly.com/library/view/javascript-everywhere/9781492046974/)
to improve security. That is why I have added it.

It might be worth mentioning that by using `helmet` the access to GraphQL Playground is lost.

### [joi - npm](https://www.npmjs.com/package/joi) and [joigoose - npm](https://www.npmjs.com/package/joigoose)

A while back I came across [yup - npm](https://www.npmjs.com/package/yup) for client validation of
inputs. I liked it a lot and started searching for how to do the same on the server. I came across `joi`
and was looking for an opportuity to use the two tools together.

While developing my database schema I wanted to validate email addresses supplied by users and this is how
I came across `joigoose` that allows the developer to use `joi` together with `mongoose`.

So even though I am only using `joi` and `joigoose` for email validation I felt it was useful practice for
me to see the tools in action in a project. Another way to get the same funtionality would most likely be
to just use a regular expression to validate the email adress.

### [jsonwebtoken - npm](https://www.npmjs.com/package/jsonwebtoken)

`jsonwebtoken` is used in an authorization header with requests to determine if a user is
authenticated. This package is used at [jsramverk.se](https://jsramverk.se/),
[Full stack open 2020](https://fullstackopen.com/en) and in
[JavaScript Everywhere](https://www.oreilly.com/library/view/javascript-everywhere/9781492046974/).

### [md5 - npm](https://www.npmjs.com/package/md5)

In
[JavaScript Everywhere](https://www.oreilly.com/library/view/javascript-everywhere/9781492046974/)
there is a section on how to retrieve the [Gravatar - Globally Recognized Avatars](http://en.gravatar.com/)
of a user. I used the same code as in the book to retrieve gravatars and the `md5` package is used
to calculate where a gravatar is stored.

### [mongoose - npm](https://www.npmjs.com/package/mongoose)

`mongoose` is used together with `mongodb` as an Object Document Mapper (ODM). `mongoose` is used in this
application to create schemas for the collections in the database.

One thing I feel worth mentioning is that during the development of this application I learned how to
create a capped collection with a maximum of 1000 documents using `mongoose`.

### [mocha - npm](https://www.npmjs.com/package/mocha) and [chai - npm](https://www.npmjs.com/package/chai)

For testing I am using `mocha` and `chai`. These tools were described in [jsramverk.se](https://jsramverk.se/)
and I knew that I would be able to get code coverage by using these.

I initially tried to use another testing library which did not play well with `mongoose`.

## Attribution

“JavaScript Everywhere by Adam D. Scott (O’Reilly). Copyright 2020 Adam D. Scott, 978-1-492-04698-1.”
