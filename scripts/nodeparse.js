
// ID of Google Spreadsheet
var SPREADSHEET_ID = "139PsTgVBtHDL-GgmnP_-M7oRP_GCYPdG2S6iF_Odyps",
    URL = "https://spreadsheets.google.com/feeds/list/" + SPREADSHEET_ID + "/od6/public/values?alt=json";

// fetch entry values from google sheets json url
function getSheetJSON(url) {
  var entry = null;
  $.ajax({
    async: false,
    url: url,
    dataType: "json",
    success: function(data) {
      entry = data.feed.entry;
    }});
  return entry;
};

// return teacher/student values from google json for easier manipulation
function parseEntries(entries) {
  var items = [];
  for (var i = 0; i < entries.length; i++) {
    var item = {
      "teacher": entries[i].gsx$teacher.$t.trim(),
      "student": entries[i].gsx$student.$t.trim()
    };
    items.push(item);
  }
  return items;
};

// return unique items in values, regardless of student or teacher
function uniqueValues(items) {
  var values = [];
  items.forEach(function(item) {
    values.push(item.teacher, item.student);
  })
  // filter duplicates
  var uniqueValues = values.filter(function(value, i) {
    return values.indexOf(value) === i});
  return uniqueValues;
};


// return a list of students given a teacher and a list of entries
function parseNode(teacher, entries) {
  var filteredEntries = entries.filter(function(entry, i) {
    return teacher == entry.teacher;
  });
  var students = []
  filteredEntries.forEach(function(entry) {
    students.push(entry.student);
  });
  return {"teacher": teacher, "students": students}
}

// main function to retrieve and parse data
function getNodes(url) {
  var nodes = [];
  var entries = parseEntries(getSheetJSON(url)),
      values = uniqueValues(entries).sort();
  values.forEach(function(value, i) {
    nodes.push(parseNode(value, entries));
  });
  return nodes;
};
