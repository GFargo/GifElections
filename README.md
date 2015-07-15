# The Presidential Gif Elections

An exercise with Meteor.js to display Gifs contained within tweets directed to the 2016 presidential candidates.


### Current Routes

- `/` >> Home
- `/about`  >> About Page
- `/feed/:handle` >> Displays Tweets from :handle
- `/tag/:hashtag` >> Displays Tweets from :hashtag


##### TODO:

- [x] Import feeds from twitter config file
- [x] Create view to display current feeds
- [ ] Write Twitter API Getters
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
