const Cordinates = require('../models/Cordinates');

exports.stats = async (req, res) => {
    if (req.user.admin_role) {
        req.flash('error_msg', 'User-only content');
        res.redirect('/adminpanel');
    }else {
        var start=Math.round(new Date(req.body.dates[0]).getTime());
        var end=Math.round(new Date(req.body.dates[1]).getTime());
        start = new Date(start).toISOString();
        end = new Date(end).toISOString();
        var id = req.user.user_id;
        var docs = await Cordinates.aggregate([
            {
                $facet: {
                    popularHour: [
                        {$match: {"user_id": id}},
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
                            "$match": {
                                convertedDate: {
                                    $gte: new Date(start),
                                    $lte: new Date(end)
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    $arrayElemAt: [
                                        "$locations.activity.activity.type",
                                        0
                                    ]
                                },
                                "array": {
                                    $push: {
                                        $hour: {
                                            $toDate: "$locations.activity.timestampMs"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$array"
                        },
                        {
                            "$group": {
                                _id: {
                                    "type": "$_id",
                                    "day": "$array"
                                },
                                count: {
                                    "$sum": 1
                                }
                            }
                        },
                        {
                            "$sort": {
                                "_id.type": -1,
                                "count": -1
                            }
                        },
                        {
                            "$group": {
                                "_id": "$_id.type",
                                "hour": {
                                    "$first": "$_id.day"
                                }
                            }
                        },
                        {
                            "$sort": {
                                "_id": 1,

                            }
                        }
                    ],
                    popularDay: [
                        {$match: {"user_id": id}},
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
                            "$match": {
                                convertedDate: {
                                    $gte: new Date(start),
                                    $lte: new Date(end)
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    $arrayElemAt: [
                                        "$locations.activity.activity.type",
                                        0
                                    ]
                                },
                                "array": {
                                    $push: {
                                        $isoDayOfWeek: {
                                            $toDate: "$locations.activity.timestampMs"
                                        }
                                    }
                                }
                            }
                        },
                        {
                            $unwind: "$array"
                        },
                        {
                            "$group": {
                                _id: {
                                    "type": "$_id",
                                    "day": "$array"
                                },
                                count: {
                                    "$sum": 1
                                }
                            }
                        },
                        {
                            "$sort": {
                                "_id.type": -1,
                                "count": -1
                            }
                        },
                        {
                            "$group": {
                                "_id": "$_id.type",
                                "day": {
                                    "$first": "$_id.day"
                                }
                            }
                        },
                        {
                            "$sort": {
                                "_id": 1,

                            }
                        }
                    ],
                    countActivities: [
                        {$match: {"user_id": id}},
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
                            "$match": {
                                convertedDate: {
                                    $gte: new Date(start),
                                    $lte: new Date(end)
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": {
                                    $arrayElemAt: [
                                        "$locations.activity.activity.type",
                                        0
                                    ]
                                },
                                "count": {
                                    "$sum": 1
                                }
                            }
                        },
                        {
                            "$sort": {
                                "_id": 1,

                            }
                        }
                    ],
                    cord: [
                        {$match: {"user_id": id}},
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
                            "$match": {
                                convertedDate: {
                                    $gte: new Date(start),
                                    $lte: new Date(end)
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "cords": {
                                    $push: {
                                        lat: "$locations.latitudeE7",
                                        long: "$locations.longitudeE7"
                                    }
                                }
                            }
                        },
                        {
                            $project: {
                                cords: true,
                                _id: false
                            }
                        }
                    ],
                    sum: [
                        {$match: {"user_id": id}},
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
                            "$match": {
                                convertedDate: {
                                    $gte: new Date(start),
                                    $lte: new Date(end)
                                }
                            }
                        },
                        {
                            "$group": {
                                "_id": null,
                                "count": {
                                    "$sum": 1
                                }
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

        res.send({popularHour: docs[0].popularHour , data:docs[0].cord[0],popularDay: docs[0].popularDay,sum:docs[0].sum,countActivities: docs[0].countActivities});
    }
};

