const Cordinates = require('../models/Cordinates');
const Json2csvParser = require("json2csv").Parser;
var js2xmlparser = require("js2xmlparser");
const fs = require("fs");

exports.activities = async (req, res) => {
    if (req.user.user_role) {
        req.flash('error_msg', 'Admin-only content');
        res.redirect('/dashboard');
    }else {
        var docs = await Cordinates.aggregate([
                                                        {$unwind: "$locations"},
                                                        {$unwind: "$locations.activity"},

            {
                "$project": {
                    _id: 0,
                    activity: {
                        $arrayElemAt: [
                            "$locations.activity.activity.type",
                            0
                        ]
                    }
                }
            },
                                                             {$group:{"_id": "$activity"}},
            {
                $group:{_id:null, array:{$push:"$_id"}}
            },
            {
                $project:{array:true,_id:false}
            },


            ])
.then(function (result) {

            return result;
        });
        res.send({docs:docs[0].array});

    }
};
exports.heatmap = async (req, res) => {
    if (req.user.user_role) {
        req.flash('error_msg', 'Admin-only content');
        res.redirect('/dashboard');
    }else {
        var yf=parseInt(req.body.year_from);
        var yt=parseInt(req.body.year_to);
        var mf=parseInt(req.body.month_from);
        var mt=parseInt(req.body.month_to);
        var df=parseInt(req.body.day_from);
        var dt=parseInt(req.body.day_to);
        var hf=parseInt(req.body.hour_from);
        var ht=parseInt(req.body.hour_to);
        var actArray=req.body.x;
        var docs = await Cordinates.aggregate([
            {
                $unwind: "$locations"
            },
            {
                $unwind: "$locations.activity"
            },
            {
                $addFields: {
                    convertedDate: {
                        $toDate: "$locations.activity.timestampMs"
                    }
                }
            },
            {
                "$project": {
                    _id: 0,
                    activity: {
                        $arrayElemAt: [
                            "$locations.activity.activity.type",
                            0
                        ]
                    },
                    latitude: "$locations.latitudeE7",
                    longitude: "$locations.longitudeE7",
                    hour: {
                        $hour: {
                            date: "$convertedDate",
                            timezone: "Europe/Athens"
                        }
                    },
                    dayOfWeek: {
                        $isoDayOfWeek: "$convertedDate"
                    },
                    date_month: {
                        $month: "$convertedDate"
                    },
                    date_year: {
                        $year: "$convertedDate"
                    }
                }
            },
            {
                "$match": {
                    $and: [
                        {
                            date_year: {
                                $gte: yf,
                                $lte: yt
                            }
                        },
                        {
                            date_month: {
                                $gte: mf,
                                $lte: mt
                            }
                        },
                        {
                            dayOfWeek: {
                                $gte: df,
                                $lte: dt
                            }
                        },
                        {
                            hour: {
                                $gte: hf,
                                $lte: ht
                            }
                        },
                        {
                            "activity": {
                                $in: actArray
                            }
                        }
                    ]
                }
            }
            , { $sort : { _id : 1 } },
            {
                $group: {
                    "_id": {
                        latitude: "$latitude",
                        longitude: "$longitude",
                    }
                }
            },
            {
                $group:{_id:null, array:{$push:"$_id"}}
            },
            {
                $project:{array:true,_id:false}
            }
        ])
            .then(function (result) {

                return result;
            });

        res.send({docs:docs[0].array});

    }
};
exports.export = async (req, res) => {
    if (req.user.user_role) {
        req.flash('error_msg', 'Admin-only content');
        res.redirect('/dashboard');
    }else {
        var yf = parseInt(req.body.year_from);
        var yt = parseInt(req.body.year_to);
        var mf = parseInt(req.body.month_from);
        var mt = parseInt(req.body.month_to);
        var df = parseInt(req.body.day_from);
        var dt = parseInt(req.body.day_to);
        var hf = parseInt(req.body.hour_from);
        var ht = parseInt(req.body.hour_to);
        var actArray = req.body.x;
        var data_type = req.body.data_type;

        var docs = await Cordinates.aggregate([
            {
                $unwind: "$locations"
            },
            {
                $unwind: "$locations.activity"
            },
            {
                $addFields: {
                    convertedDate: {
                        $toDate: "$locations.activity.timestampMs"
                    }
                }
            },
            {
                "$project": {
                    _id: 0,
                    locations: 1,
                    user_id: 1,
                    activity: {
                        $arrayElemAt: [
                            "$locations.activity.activity",
                            0
                        ]
                    },
                    hour: {
                        $hour: {
                            date: "$convertedDate",
                            timezone: "Europe/Athens"
                        }
                    },
                    dayOfWeek: {
                        $isoDayOfWeek: "$convertedDate"
                    },
                    date_month: {
                        $month: "$convertedDate"
                    },
                    date_year: {
                        $year: "$convertedDate"
                    }
                }
            },
            {
                "$match": {
                    $and: [
                        {
                            date_year: {
                                $gte: yf,
                                $lte: yt
                            }
                        },
                        {
                            date_month: {
                                $gte: mf,
                                $lte: mt
                            }
                        },
                        {
                            dayOfWeek: {
                                $gte: df,
                                $lte: dt
                            }
                        },
                        {
                            hour: {
                                $gte: hf,
                                $lte: ht
                            }
                        },
                        {
                            "activity.type": {
                                $in: actArray
                            }
                        }
                    ]
                }
            },
            {
                $project: {

                    "locations.activity.activity": 0,


                }
            },
            {
                $addFields: {
                    "locations.activity.activity": ["$activity"]
                }
            },
            {
                $project: {
                    "locations._id": 0,
                    "locations.activity._id": 0,
                    "locations.activity.activity._id": 0,
                    activity: 0,
                    date_month: 0,
                    date_year: 0,
                    dayOfWeek: 0,
                    hour: 0
                }
            }
        ])
            .then(function (result) {

                return result;
            });
        if (data_type === "CSV") {
            const json2csvParser = new Json2csvParser({header:true,encode:'utf-8'});
            const csvData = json2csvParser.parse(docs);

            fs.writeFile("C:\\Users\\user\\Desktop\\export.csv", csvData, function (error) {
                if (error) throw error;
            });
        } else if (data_type === "JSON") {
            var jsonData =JSON.stringify(docs);
            fs.writeFile("C:\\Users\\user\\Desktop\\export.json", jsonData, function (error) {
                if (error) throw error;
            });
        } else {
           var xmlData= js2xmlparser.parse("locations", docs);
            fs.writeFile("C:\\Users\\user\\Desktop\\export.xml", xmlData, function (error) {
                if (error) throw error;
            });
        }
    }
};

