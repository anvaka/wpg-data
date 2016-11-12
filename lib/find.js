var rp = require('request-promise');

var url = 'https://www.google.com/complete/search?client=hp&hl=en&sugexp=msedr&gs_rn=62&gs_ri=hp&cp=1&gs_id=9c&xhr=t&q='

var queue = [];
var lastCallTime = 0;
var timeBetweenRequests = 100;
var scheduledQueue = 0;

module.exports = find;

function find(query, callback) {
  queue.push({
    query: query,
    callback: callback
  });

  handleQueue()
}

function handleQueue() {
  if (queue.length === 0) return;

  var now = new Date();
  var diff = now - lastCallTime;
  if (diff < timeBetweenRequests) {
    if (!scheduledQueue) {
      scheduledQueue = setTimeout(handleQueue, timeBetweenRequests)
    }
    return
  }

  lastCallTime = now;
  scheduledQueue = 0;

  var item = queue.shift();
  console.log('Fetching ' + item.query);

  rp(url + item.query).then(function(html) {
    var response = JSON.parse(html);
    var suggestions = (response[1] || []).map(function(x) {
      return x[0];
    }).filter(byFullPhrase);

    // console.log(html) // Show the HTML for the Google homepage.
    return ({
      suggestions: suggestions,
      query: item.query
    });
  }).then(function(r) {
    item.callback(r);
    handleQueue();
  }).catch(function (err) {
    console.log('Failed to process ' + item.query);
    console.log('Error: ' + err);
    throw new Error(err);
  });
}

function byFullPhrase(x) {
  // we dont want half-complete answers
  return x.match(/<b>[^\s]/) === null;
}
