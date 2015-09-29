# The Presidential Gif Elections

An exercise with Meteor.js to display Gifs contained within tweets directed to the 2016 presidential candidates.

##### Twitter General Reqs

![Visual Display Requirements](https://i.imgur.com/Zb000N8.png)
[URL](https://about.twitter.com/company/display-requirements)


### Current Routes

- `/` >> Home
- `/about`  >> About Page
- `/feed/:handle` >> Displays Tweets from :handle
- `/tag/:hashtag` >> Displays Tweets from :hashtag

### Twitter API Streaming

- [Streaming Overview](https://dev.twitter.com/streaming/overview)
- [Using Streams](https://dev.twitter.com/streaming/userstreams)
- [Public Streams](https://dev.twitter.com/streaming/public)



### Requirements for Site Streaming

- Read all of the (streaming API documentation)[https://dev.twitter.com/streaming/overview] and understand best practices around establishing and maintaining streaming connections.
- Implement a single-user proof of concept using user streams, taking into consideration queueing, processing, REST fallback support, and scaling requirements for expanding to many users.

- Apply for beta access to the Site Streams API by filling out the form at http://bit.ly/sitestreams. If approved, you will receive an email with further instructions.



##### TODO:

- [x] Import feeds from twitter config file
- [x] Create view to display current feeds
- [ ] Write Twitter API Getters 
    - [ ] _Not sure if this should be timed requests or something else?_
    - [x] Get User Info
    - [x] Get Tweets for Handle
    - [ ] Get Tweets for Hashtag
- [ ] Display tweets from current candidates
- [ ] Create a tweet parser function ?
- [ ] Create a tweet storing function -



### Design Goals:

- Unbiased display of information by using culturally established norms
    + democrats on the left
    + republicans on the right
- 'red' / 'blue' color schemes
- 'donkey' / 'elephant'
