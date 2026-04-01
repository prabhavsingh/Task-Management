import Task from "../models/taskModel.js";

export const getAllUsersProductivity = async (req, res) => {
  const { range } = req.query;

  let matchStage = {};

  if (range === "daily") {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    matchStage = { createdAt: { $gte: today } };
  }

  if (range === "weekly") {
    const now = new Date();
    const firstDayOfWeek = new Date(now);
    firstDayOfWeek.setDate(now.getDate() - 7);

    matchStage = { createdAt: { $gte: firstDayOfWeek } };
  }

  const stats = await Task.aggregate([
    { $match: matchStage },
    {
      $group: {
        _id: "$username",

        totalTasks: { $sum: 1 },

        completedTasks: {
          $sum: {
            $cond: [{ $eq: ["$status", "completed"] }, 1, 0],
          },
        },

        totalTimeTaken: {
          $sum: {
            $cond: [
              { $eq: ["$status", "completed"] },
              { $subtract: ["$completedAt", "$createdAt"] },
              0,
            ],
          },
        },
      },
    },

    {
      $addFields: {
        completionRate: {
          $cond: [
            { $eq: ["$totalTasks", 0] },
            0,
            { $divide: ["$completedTasks", "$totalTasks"] },
          ],
        },

        avgTime: {
          $cond: [
            { $eq: ["$completedTasks", 0] },
            0,
            { $divide: ["$totalTimeTaken", "$completedTasks"] },
          ],
        },
      },
    },

    {
      $addFields: {
        productivityScore: {
          $add: [
            { $multiply: ["$completionRate", 0.7] },
            {
              $multiply: [
                {
                  $cond: [
                    { $eq: ["$avgTime", 0] },
                    0,
                    { $divide: [3600000, "$avgTime"] },
                  ],
                },
                0.3,
              ],
            },
          ],
        },
      },
    },

    {
      $project: {
        _id: 0,
        username: "$_id",
        totalTasks: 1,
        completedTasks: 1,
        completionRate: 1,
        totalTimeTaken: 1,
        avgTime: 1,
        productivityScore: 1,
      },
    },

    {
      $sort: { productivityScore: -1 },
    },
  ]);

  res.json({
    status: "success",
    results: stats.length,
    data: stats,
  });
};
