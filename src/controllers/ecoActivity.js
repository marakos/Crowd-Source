const Cordinates = require('../models/Cordinates');
const  User = require('../models/User')
exports.activity = async (req, res) => {
    if (req.user.admin_role) {
        req.flash('error_msg', 'User-only content');
        res.redirect('/adminpanel');
    } else {
        var id = req.user.user_id;
        var d=new Date(Date.now()).getTime();
      d=d-28927183000;
      var thisMonth=new Date(Date.now())
        var docs = await Cordinates.aggregate([
            {
                $facet: {
                    ranking: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },
                        {
                            $addFields: {
                                activities: {
                                    $arrayElemAt: [
                                        "$locations.activity.activity.type",
                                        0
                                    ]
                                },
                                year: {
                                    $year: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
                                },
                                month: {
                                    $month: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
                                },

                            }
                        },
                        {
                            $match: {
                                "activities": {
                                    "$in": [
                                        "ON_FOOT",
                                        "ON_BICYCLE",
                                        "RUNNING",
                                        "WALKING",

                                        "IN_VEHICLE",
                                        "IN_ROAD_VEHICLE",
                                        "IN_RAIL_VEHICLE",
                                        "IN_FOUR_WHEELER_VEHICLE",
                                        "IN_CAR",
                                        "EXITING_VEHICLE",
                                        "ON_VEHICLE"

                                    ]
                                }
                            }
                        },
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "user_id",
                                as: "user"
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    id: "$user_id",
                                    month: "$month",
                                    year:"$year",
                                    fname: "$user.firstName",
                                    lname: "$user.lastName"
                                },
                                "physical": {
                                    "$sum": {
                                        "$cond": [
                                            {$or:[
                                                    { "$eq": [
                                                            "$activities",
                                                            "ON_BICYCLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "ON_FOOT"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "WALKING"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "RUNNING"
                                                        ]},
                                                ]},
                                            1,
                                            0
                                        ]
                                    }
                                },
                                "vehicle": {
                                    "$sum": {
                                        "$cond": [
                                            {$or:[
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_ROAD_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_RAIL_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_FOUR_WHEELER_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_CAR"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "EXITING_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "ON_VEHICLE"
                                                        ]},
                                                ]},
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        {$match: {$and: [{"_id.month": thisMonth.getMonth()+1},
                                    {"_id.year": thisMonth.getFullYear()},
                        ]}},
                        {
                            $addFields: {
                                "_id.perc": {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$physical",
                                                {
                                                    $add: [
                                                        "$vehicle",
                                                        "$physical"
                                                    ]
                                                }
                                            ]
                                        },
                                        100
                                    ]
                                }
                            }
                        },
                        {
                            $sort: {
                                "_id.perc": -1,
                                "_id.id": 1
                            }
                        },
                        {$limit:3},
                        {
                            $project: {
                                "physical": 0,
                                "vehicle": 0,
                                "_id.month": 0,
                                "_id.year": 0,
                            }
                        },
                        {
                            $group: {
                                _id: {},
                                arr: {
                                    $push: {
                                        id: "$_id.id",
                                        perc: "$_id.perc",
                                        lname:"$_id.lname",
                                        fname:"$_id.fname",
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                arr:1,
                                index: {
                                    $indexOfArray: [
                                        "$arr.id",
                                        req.user.user_id
                                    ]
                                },
                            }
                        },
                        {$project:{
                                arr: {
                                    "$slice": [
                                        "$arr",
                                        3
                                    ]
                                },
                                index:1,
                                matched: {
                                    "$arrayElemAt": [
                                        "$arr",
                                        "$index"
                                    ]
                                },
                                _id:0
                            }}
                    ],
                    ecoActivityUser: [
                        {$match: {"user_id": id}},
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },
                        {
                            $match:
                                {"locations.activity.timestampMs": {$gte:d}}

                        },
                        {
                            $addFields: {
                                activities: {
                                    $arrayElemAt: [
                                        "$locations.activity.activity.type",
                                        0
                                    ]
                                },
                                year: {
                                    $year: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
                                },
                                month: {
                                    $month: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
                                },

                            }
                        },
                        {
                            $match: {
                                "activities": {
                                    "$in": [
                                        "ON_FOOT",
                                        "ON_BICYCLE",
                                        "RUNNING",
                                        "WALKING",

                                        "IN_VEHICLE",
                                        "IN_ROAD_VEHICLE",
                                        "IN_RAIL_VEHICLE",
                                        "IN_FOUR_WHEELER_VEHICLE",
                                        "IN_CAR",
                                        "EXITING_VEHICLE",
                                        "ON_VEHICLE"

                                    ]
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    id: "$user_id",
                                    month: "$month",
                                    year:"$year"
                                },
                                "physical": {
                                    "$sum": {
                                        "$cond": [
                                            {$or:[
                                                    { "$eq": [
                                                            "$activities",
                                                            "ON_BICYCLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "ON_FOOT"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "WALKING"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "RUNNING"
                                                        ]},
                                            ]},
                                            1,
                                            0
                                        ]
                                    }
                                },
                                "vehicle": {
                                    "$sum": {
                                        "$cond": [
                                            {$or:[
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_ROAD_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_RAIL_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_FOUR_WHEELER_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "IN_CAR"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "EXITING_VEHICLE"
                                                        ]},
                                                    { "$eq": [
                                                            "$activities",
                                                            "ON_VEHICLE"
                                                        ]},
                                                ]},
                                            1,
                                            0
                                        ]
                                    }
                                }
                            }
                        },
                        {
                            $addFields: {
                                "_id.perc": {
                                    $multiply: [
                                        {
                                            $divide: [
                                                "$physical",
                                                {
                                                    $add: [
                                                        "$vehicle",
                                                        "$physical"
                                                    ]
                                                }
                                            ]
                                        },
                                        100
                                    ]
                                }
                            }
                        },
                        {
                            $sort: {
                                "_id.year": -1,
                                "_id.month": -1
                            }
                        },
                        {
                            $project: {
                                "physical": 0,
                                "vehicle": 0
                            }
                        }],
                    firstLastDate_dateCreated: [
                        {$match: {"user_id": id}},
                        {
                            $sort: {
                                createdAt: 1
                            }
                        },
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },

                        {
                            "$group": {
                                "_id": "$locations.activity.timestampMs",
                                lastDate: {
                                    $last: {
                                        "$dateToString": {
                                            "format": "%Y-%m-%d",
                                            "date": "$createdAt",
                                            timezone: "Europe/Athens"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $sort: {
                                _id: 1
                            }
                        },
                        {
                            "$group": {
                                _id: null,
                                lastDate: {
                                    $last: "$lastDate"
                                },
                                first: {
                                    $first: {
                                        "$dateToString": {
                                            "format": "%Y-%m-%d",
                                            "date": {
                                                $toDate: "$_id"
                                            },
                                            timezone: "Europe/Athens"
                                        }
                                    }
                                },
                                last: {
                                    $last: {
                                        "$dateToString": {
                                            "format": "%Y-%m-%d",
                                            "date": {
                                                $toDate: "$_id"
                                            },
                                         timezone: "Europe/Athens"
                                        }
                                    }
                                },

                            }
                        },
                        {
                            $project: {
                                _id: 0
                            }
                        }
                    ]
                }
            }
        ])
            .then(function (result) {
                return result;
            });
        res.send({docs:docs[0]});
    }
};
