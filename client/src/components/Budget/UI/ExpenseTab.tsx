import RadioTab from '../../UI/RadioTab';

function ExpenseTab(props: {
    id: string;
    isExpense: boolean;
    setIsExpense: (isExpense: boolean) => void;
}) {
    const tabs = [
        {
            label: 'μ§μΆ',
            value: 'expense',
            defaultChecked: props.isExpense,
            onChange: () => {
                props.setIsExpense(true);
            },
        },
        {
            label: 'μμ',
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
