const Cordinates = require('../models/Cordinates');
const User = require('../models/User');

exports.stats = async (req, res) => {
    if (req.user.user_role) {
        req.flash('error_msg', 'Admin-only content');
        res.redirect('/dashboard');
    }else {
        var docs = await Cordinates.aggregate([
            {
                $facet: {
                    popularHour: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },
                        {
                            "$group": {
                                "_id": {
                                    $hour: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
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
                    popularDay: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },
                        {
                            "$group": {
                                "_id": {
                                    $isoDayOfWeek: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
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
                    popularMonth: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },
                        {
                            "$group": {
                                "_id": {
                                    $month: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
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
                    popularYear: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
                        },
                        {
                            "$group": {
                                "_id": {
                                    $year: {
                                        $toDate: "$locations.activity.timestampMs"
                                    }
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
                    countActivities: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
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
                    sum: [
                        {
                            $unwind: "$locations"
                        },
                        {
                            $unwind: "$locations.activity"
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
                    ],
                    userCount:[
                        {
                            $lookup: {
                                from: "users",
                                localField: "user_id",
                                foreignField: "user_id",
                                as: "user"
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
                                "_id": {
                                    fname: "$user.firstName",
                                    lname: "$user.lastName"
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
                    ]
                }
            }
        ])
            .then(function (result) {

                return result;
            });
        res.send({ docs:docs[0]});

    }
};

