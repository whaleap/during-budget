const mongoose = require("mongoose");

const categorySchema = mongoose.Schema(
  {
    categoryId: mongoose.Types.ObjectId,
    isExpense: { type: Boolean, default: false },
    isIncome: { type: Boolean, default: false },
    title: String,
    icon: String,
  },
  { _id: false }
);

const transactionSchema = mongoose.Schema(
  {
    userId: mongoose.Types.ObjectId,
    budgetId: mongoose.Types.ObjectId,
    date: Date,
    isCurrent: Boolean, // true - current, false - scheduled
    linkId: mongoose.Types.ObjectId, // isCurrent - scheduledId, !isCurrent - currentId
    title: [String],
    ammount: Number,
    category: categorySchema, // category of budget
    tags: [String],
    memo: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

transactionSchema.index({
  user: 1,
  Date: -1,
});

module.exports = mongoose.model("Transaction", transactionSchema);
