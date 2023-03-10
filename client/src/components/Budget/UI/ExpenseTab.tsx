import RadioTab from '../../UI/RadioTab';

function ExpenseTab(props: {
    id: string;
    isExpense: boolean;
    setIsExpense: (isExpense: boolean) => void;
}) {
    const tabs = [
        {
            label: '지출',
            value: 'expense',
            defaultChecked: props.isExpense,
            onChange: () => {
                props.setIsExpense(true);
            },
        },
        {
            label: '수입',
            value: 'income',
            defaultChecked: !props.isExpense,
            onChange: () => {
                props.setIsExpense(false);
            },
        },
    ];

    return <RadioTab name={props.id} values={tabs} />;
}

export default ExpenseTab;
