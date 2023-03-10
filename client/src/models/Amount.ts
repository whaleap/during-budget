const locale: 'ko-KR' | 'en-US' =
    navigator.language === 'ko-KR' ? 'ko-KR' : 'en-US';
const amountUnit = {
    'en-US': {
        prefix: '$',
        suffix: '',
    },
    'ko-KR': {
        prefix: '',
        suffix: '원',
    },
};
const prefix = amountUnit[locale].prefix;
const suffix = amountUnit[locale].suffix;

const formatCurrent = (amount: number) => {
    return `${prefix}${amount.toLocaleString()}${suffix}`;
};

const formatScheduled = (amount: number) => {
    return `(${prefix}${amount.toLocaleString()}${suffix})`;
};

const formatPlanned = (amount: number) => {
    return `/${prefix}${amount.toLocaleString()}${suffix}`;
};

class Amount {
    private _current: number;
    private _scheduled: number;
    private _planned: number;
    private _state: {
        target: string;
        over: string;
        isOver: boolean;
        amount: number;
    }[];

    constructor(current: number, scheduled: number, planned: number) {
        this._current = current;
        this._scheduled = scheduled;
        this._planned = planned;
        this._state = this.getState();
    }

    get current() {
        return this._current;
    }

    get scheduled() {
        return this._scheduled;
    }

    get planned() {
        return this._planned;
    }

    get state() {
        return this._state;
    }

    getLeftScheduled = () => {
        return this._scheduled - this._current;
    };

    getLeftPlanned = () => {
        const bigger =
            this._scheduled > this._current ? this._scheduled : this._current;
        return this._planned - bigger;
    };

    getCurrentStr = () => {
        return formatCurrent(this.current);
    };

    getScheduledStr = (isLeft?: boolean) => {
        const scheduled = isLeft ? this.getLeftScheduled() : this._scheduled;
        return formatScheduled(scheduled);
    };

    getPlannedStr = (isLeft?: boolean) => {
        const planned = isLeft ? this.getLeftPlanned() : this._planned;
        return formatPlanned(planned);
    };

    getLeftScheduledStr = () => {
        return formatScheduled(this.getLeftScheduled());
    };

    getLeftPlannedStr = () => {
        return formatPlanned(this.getLeftPlanned());
    };

    getCurrentRatio = () => {
        if (this._planned === 0) {
            return 0;
        } else {
            return this._current / this._planned;
        }
    };

    getScheduledRatio = () => {
        if (this._planned === 0) {
            return 0;
        } else {
            return this._scheduled / this._planned;
        }
    };

    static getAmountStr = (amount: number) => {
        return formatCurrent(amount);
    }

    private getEachState = (
        target: string,
        over: string,
        overAmount: number
    ) => {
        const isOver = overAmount < 0;
        return {
            target,
            over,
            isOver,
            amount: isOver ? -overAmount : 0,
        };
    };

    private getState = () => {
        const currentOverSchedule = this.getEachState(
            '현재 내역',
            '예정',
            this._scheduled - this._current
        );
        const currentOverPlanned = this.getEachState(
            '현재 내역',
            '목표',
            this._planned - this._current
        );
        const scheduledOverplanned = this.getEachState(
            '예정 내역',
            '목표',
            this._planned - this.scheduled
        );

        return [currentOverSchedule, currentOverPlanned, scheduledOverplanned];
    };
}

export default Amount;
