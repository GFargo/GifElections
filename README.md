# The Presidential Gif Elections

An exercise with Meteor.js to display Gifs contained within tweets directed to the 2016 presidential candidates.


### Current Routes

- `/` >> Home
- `/about`  >> About Page
- `/feed/:handle` >> Displays Tweets from :handle
- `/tag/:hashtag` >> Displays Tweets from :hashtag


### Requirements for Site Streaming

- Read all of the (streaming API documentation)[https://dev.twitter.com/streaming/overview] and understand best practices around establishing and maintaining streaming connections.
- Implement a single-user proof of concept using user streams, taking into consideration queueing, processing, REST fallback support, and scaling requirements for expanding to many users.

- Apply for beta access to the Site Streams API by filling out the form at http://bit.ly/sitestreams. If approved, you will receive an email with further instructions.



##### TODO:

- [x] Import feeds from twitter config file
- [x] Create view to display current feeds
- [ ] Write Twitter API Getters 
- [ ]( Not sure if this should be timed requests or something else? )
    - [x] Get User Info
    - [x] Get Tweets for Handle
    - [ ] Get Tweets for Hashtag
- [ ] Display tweets from current candidates
- [ ] Create a tweet parser function
- [ ] Create a tweet storing function



### Design Goals:

- Unbiased display of information by using culturally established norms
    + democrats on the left
    + republicans on the right
- 'red' / 'blue' color schemes
- 'donkey' / 'elephant'
