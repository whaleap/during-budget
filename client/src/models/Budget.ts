import Amount from './Amount';
import Category from './Category';

class Budget {
    private _id: string;
    private _title: string;
    private _startDate: Date;
    private _endDate: Date;
    private _total: {
        expense: Amount;
        income: Amount;
    };
    private _categories: Category[];

    get id() {
        return this._id;
    }

    get title() {
        return this._title;
    }

    get startDate() {
        return this._startDate;
    }

    get endDate() {
        return this._endDate;
    }

    get total() {
        return this._total;
    }

    get categories() {
        return this._categories;
    }

    set title(title: string) {
        this._title = title;
    }

    constructor(budget: {
        id: string;
        title: string;
        startDate: Date;
        endDate: Date;
        total: {
            expense: Amount;
            income: Amount;
        };
        categories: Category[];
    }) {
        const { id, title, startDate, endDate, total, categories } = budget;
        this._id = id;
        this._title = title;
        this._startDate = startDate;
        this._endDate = endDate;
        this._total = total;
        this._categories = categories;
    }
}

export default Budget;