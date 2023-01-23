const mongoose = require("mongoose");

const categorySchema = mongoose.Schema({
  isExpense: { type: Boolean, default: true },
  title: String,
  icon: String,
  ammount: {
    type: Number,
    default: 0,
  },
});

const budgetSchema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    startDate: Date,
    endDate: Date,
    title: String,

    ammountScheduled: {
      //예정 지출
      type: Number,
      select: false,
    },
    ammountCurrent: {
      //현재 지출
      type: Number,
      select: false,
    },
    ammountBudget: {
      //예산 총액
      type: Number,
      default: 0,
    },
    categories: [categorySchema],
  },
  { timestamps: true }
);

budgetSchema.index({
  user: 1,
  startDate: -1,
});

module.exports = mongoose.model("Budget", budgetSchema);