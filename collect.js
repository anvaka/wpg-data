var find = require('./find.js');
var path = require('path');
var fs = require('fs');

var statesOut = path.join(__dirname, 'usa')
var countryOut = path.join(__dirname, 'world')
var fetchStates = true;

if (fetchStates) {
  fetchAnswers(getStatesQuestions(), getStateNames(), writeResults(statesOut));
} else {
  fetchAnswers(getCountryQuestions(), getCountries(), writeResults(countryOut));
}

function writeResults(outPath) {

  return function(results) {
    var fileName = saveResults(results)
    console.log('saved ' + fileName + ' into ' + path.join(outPath, fileName));
    console.log('updating index for ' + outPath + '...');

    var index = addToIndex(fileName);
    saveIndex(index);
    console.log('index updated');
  }

  function saveIndex(index) {
    fs.writeFileSync(path.join(outPath, 'index.json'), JSON.stringify(index), 'utf8');
  }

  function addToIndex(newFile) {
    var indexPath = path.join(outPath, 'index.json');
    if (fs.existsSync(indexPath)) {
      var index = require(indexPath);
      index.push(newFile);
      return index;
    }

    return [newFile];
  }

  function saveResults(results) {
    var content = JSON.stringify(results, null, 2);
    var fileName = (new Date()).toISOString().substr(0, '2016-11-11'.length) + '.json'
    var fullFilePath = path.join(outPath, fileName)
    console.log('Saving results into ' + fullFilePath);
    fs.writeFileSync(fullFilePath, content, 'utf8');

    return fileName;
  }
}

function fetchAnswers(questions, states, allDone) {
  var out = {};
  var objectKeys = Object.keys(questions);
  var totalQuestions = objectKeys.length * states.length

  objectKeys.forEach(function(questionId) {
    var q = questions[questionId];
    var questionOut = {
      display: q.display,
      records: []
    };

    out[questionId] = questionOut;

    states.forEach(function(state) {
      var query = q.query(state);
      find(query, function(response) {
        totalQuestions -= 1;
        questionOut.query = query;
        questionOut.records.push({
          suggestions: response.suggestions,
          state: state
        });
        if (totalQuestions === 0) {
          allDone(out)
        }
      });
    })
  })
}


function getStatesQuestions() {
  return {
      'why-is': {
      display: "Why is [state name] ... ?",
      query: function(x) {return "why is " + x + " ";}
    }, 'why-does': {
      display: "Why does [state name] ... ?",
      query: function(x) {return "why does " + x + " ";}
    }, 'can': {
      display: "Can [state name] ... ?",
      query: function(x) {return "can " + x + " ";}
    }, 'what-if': {
      display: "What if [state name] ... ?",
      query: function(x) {return "what if " + x + " ";}
    }, 'does': {
      display: "Does [state name] ... ?",
      query: function(x) {return "does " + x + " ";}
    }, 'how': {
      display: "How [state name] ... ?",
      query: function(x) {return "how " + x + " ";}
    }, 'is-not': {
      display: "[state name] is not ...",
      query: function(x) {return x + " is not ";}
    }, 'when-will': {
      display: "When will [state name] ...",
      query: function(x) {return "when will " + x;}
    }
  };
}

function getStateNames() {
  return [
    "Alabama",
    "Alaska",
    "Arizona",
    "Arkansas",
    "California",
    "Colorado",
    "Connecticut",
    "Delaware",
    "District of Columbia",
    "Florida",
    "Georgia",
    "Hawaii",
    "Idaho",
    "Illinois",
    "Indiana",
    "Iowa",
    "Kansas",
    "Kentucky",
    "Louisiana",
    "Maine",
    "Maryland",
    "Massachusetts",
    "Michigan",
    "Minnesota",
    "Mississippi",
    "Missouri",
    "Montana",
    "Nebraska",
    "Nevada",
    "New Hampshire",
    "New Jersey",
    "New Mexico",
    "New York",
    "North Carolina",
    "North Dakota",
    "Ohio",
    "Oklahoma",
    "Oregon",
    "Pennsylvania",
    "Rhode Island",
    "South Carolina",
    "South Dakota",
    "Tennessee",
    "Texas",
    "Utah",
    "Vermont",
    "Virginia",
    "Washington",
    "West Virginia",
    "Wisconsin",
    "Wyoming",
    "America Samoa",
    "Federated States of Micronesia",
    "Guam",
    "Marshall Islands",
    "Northern Mariana Islands",
    "Palau",
    "Puerto Rico",
    "U.S. Minor Outlying Islands",
    "Virgin Islands of the United States"
  ];
}

function getCountries() {
  return ["Afghanistan","Angola","Albania","United Arab Emirates","Argentina","Armenia","Antarctica","French Southern and Antarctic Lands","Australia","Austria","Azerbaijan","Burundi","Belgium","Benin","Burkina Faso","Bangladesh","Bulgaria","The Bahamas","Bosnia and Herzegovina","Belarus","Belize","Bolivia","Brazil","Brunei","Bhutan","Botswana","Central African Republic","Canada","Switzerland","Chile","China","Ivory Coast","Cameroon","Democratic Republic of the Congo","Republic of the Congo","Colombia","Costa Rica","Cuba","Northern Cyprus","Cyprus","Czech Republic","Germany","Djibouti","Denmark","Dominican Republic","Algeria","Ecuador","Egypt","Eritrea","Spain","Estonia","Ethiopia","Finland","Fiji","Falkland Islands","France","Gabon","United Kingdom","Georgia","Ghana","Guinea","Gambia","Guinea Bissau","Equatorial Guinea","Greece","Greenland","Guatemala","Guyana","Honduras","Croatia","Haiti","Hungary","Indonesia","India","Ireland","Iran","Iraq","Iceland","Israel","Italy","Jamaica","Jordan","Japan","Kazakhstan","Kenya","Kyrgyzstan","Cambodia","South Korea","Kosovo","Kuwait","Laos","Lebanon","Liberia","Libya","Sri Lanka","Lesotho","Lithuania","Luxembourg","Latvia","Morocco","Moldova","Madagascar","Mexico","Macedonia","Mali","Myanmar","Montenegro","Mongolia","Mozambique","Mauritania","Malawi","Malaysia","Namibia","New Caledonia","Niger","Nigeria","Nicaragua","Netherlands","Norway","Nepal","New Zealand","Oman","Pakistan","Panama","Peru","Philippines","Papua New Guinea","Poland","Puerto Rico","North Korea","Portugal","Paraguay","Qatar","Romania","Russia","Rwanda","Western Sahara","Saudi Arabia","Sudan","South Sudan","Senegal","Solomon Islands","Sierra Leone","El Salvador","Somaliland","Somalia","Republic of Serbia","Suriname","Slovakia","Slovenia","Sweden","Swaziland","Syria","Chad","Togo","Thailand","Tajikistan","Turkmenistan","East Timor","Trinidad and Tobago","Tunisia","Turkey","Taiwan","Tanzania","Uganda","Ukraine","Uruguay","United States","Uzbekistan","Venezuela","Vietnam","Vanuatu","West Bank","Yemen","South Africa","Zambia","Zimbabwe"];
}

function getCountryQuestions() {
    return {
      'why-is': {
      display: "Why is [country name] ... ?",
      query: function(x) {return "why is " + x + " ";}
    }, 'why-does': {
      display: "Why does [country name] ... ?",
      query: function(x) {return "why does " + x + " ";}
    }, 'can': {
      display: "Can [country name] ... ?",
      query: function(x) {return "can " + x + " ";}
    }, 'what-if': {
      display: "What if [country name] ... ?",
      query: function(x) {return "what if " + x + " ";}
    }, 'does': {
      display: "Does [country name] ... ?",
      query: function(x) {return "does " + x + " ";}
    }, 'how': {
      display: "How [country name] ... ?",
      query: function(x) {return "how " + x + " ";}
    }, 'is-not': {
      display: "[country name] is not ...",
      query: function(x) {return x + " is not ";}
    }, 'when-will': {
      display: "When will [country name] ...",
      query: function(x) {return "when will " + x;}
    }
  };
}
