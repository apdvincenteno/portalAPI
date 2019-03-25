
var BaseCRUDController = {
  name: null,
  model: null,
  route: "",
  booleanFields: [],
  listFields: {},
  index: function (callback) {
    console.log(this.listFields);
    this.model.find({}, function (err, list) {
      callback(err, list);
    });
  },
  view: function (id, callback) {
    this.model.findById(id, function (err, singleObject) {
      callback(err, singleObject);
    });
  },
  save: function (obj, callback) {
    var mod = this.model;
    var newObject = new mod(obj);
    newObject.save(function (err, singleObject) {
      callback(err, singleObject);
    });
  },
  update: function (id, fieldsAndData, callback) {
    console.log("IM HERE WITH ID: " + id + "  " + JSON.stringify(fieldsAndData));
    this.model.findByIdAndUpdate(id, { $set: fieldsAndData }, function (err, singleObject) {
      console.log(JSON.stringify(err));
      console.log(JSON.stringify(singleObject));
      callback(err, singleObject);
    });
  },
  delete: function (id, callback) {
    this.model.findByIdAndRemove(id, function (err, singleObject) {
      callback(err, singleObject);
    });
  },
  search: function (seachCriteria, callback) {
    var lf = this.listFields;
    if (seachCriteria.pageNo != null || seachCriteria.numOfRecords != null) {
      var pNo = parseInt(seachCriteria.pageNo);
      var pNumRec = parseInt(seachCriteria.numOfRecords);
      var strictSearch = seachCriteria.strictSearch;
      var exactValue = seachCriteria.exactValue;
      delete seachCriteria.pageNo;
      delete seachCriteria.numOfRecords;
      delete seachCriteria.strictSearch;
      delete seachCriteria.exactValue;

      var isStrict = (typeof strictSearch != "undefined" || strictSearch != null);
      var isExactValue = (typeof isExactValue != "undefined" || isExactValue != null);

      var modifiedSearch = {};
      if (isStrict) {
        console.log("IS STRICT......");
        for (var key in seachCriteria) {
          var value = seachCriteria[key];
          if (!isExactValue) {
            if (!(value == "true" || value == "false" || value == true || value == false)) {
              value = new RegExp(value, "i");
            }
          }

          modifiedSearch[key] = value;
        }
      } else {
        //or conditions.. not strict
        var conditions = [];
        for (var key in seachCriteria) {
          var condition = {};
          var value = seachCriteria[key];
          if (!isExactValue) {
            if (!(value == "true" || value == "false" || value == true || value == false)) {
              value = new RegExp(value, "i");
            }
          }

          condition[key] = value;
          modifiedSearch[key] = value;
          conditions.push(condition);
        }
        if (conditions.length > 0) {
          modifiedSearch = { $or: conditions };
        } else
          modifiedSearch = {};

      }
      this.searchWithPagination(modifiedSearch, pNo, pNumRec, callback);
    } else {
      this.model.find(seachCriteria, function (err, list) {
        callback(err, list, list.length);
      }).sort({ created_at: -1 }).limit(20);
    }
  },
  searchWithPagination: function (seachCriteria, pageNo, numOfRecords, callback) {
    var lf = this.listFields;
    pageNo = pageNo || 0;
    numOfRecords = numOfRecords || 20;
    numOfRecords = parseInt(numOfRecords);

    this.model.count(seachCriteria, function (err, count) {
      console.log("COUNT... " + count + "  " + JSON.stringify(seachCriteria));
      this.model.find(seachCriteria, function (err, list) {
        callback(err, list, count);
      }).sort({ created_at: -1 }).skip(pageNo * numOfRecords).limit(numOfRecords);
    });
  },
  count: function (seachCriteria, callback) {
    this.model.count(seachCriteria, function (err, count) {
      callback(err, count);
    });
  },
  group: function (seachCriteria, callback) {
    this.model.aggregate([
      {
        /* Filter out users who have not yet subscribed */
        $match: {
          /* "joined" is an ISODate field */
          'created_at': { $ne: null }
        }
      },
      {
        /* group by year and month of the subscription event */
        $group: {
          _id: {
            year: {
              $year: '$created_at'
            },
            month: {
              $month: '$created_at'
            }
          },
        }
      },
      {
        /* sort descending (latest subscriptions first) */
        $sort: {
          '_id.year': -1,
          '_id.month': -1
        }
      },
      {
        $limit: 100,
      },
    ], function (err, result) {
      callback(err, result);
    });
  }
}

module.exports = function (modelName) {
  var model = require('../models/' + modelName);//model must exist
  var EmptyController = {};
  var Controller = Object.create(BaseCRUDController);
  Controller.__proto__ = BaseCRUDController;
  Controller.model = model;
  Controller.name = model || null;
  return Controller;
}
