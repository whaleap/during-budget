import classes from './Carousel.module.css';
import { useEffect } from 'react';

const DIVIDER = '-';
const SLIDE_ID = 'slide';
const NAV_ID = 'nav';

function Carousel(props: {
    children: React.ReactNode;
    id: string;
    initialIndex: number;
    containerClassName?: string;
    itemClassName?: string;
}) {
    const { id: carouselId, initialIndex, children } = props;

    const carouselItems = Array.isArray(children) ? children : [children];

    const slideIdPrefix = `${carouselId}${DIVIDER}${SLIDE_ID}${DIVIDER}`;
    const navIdPrefix = `${carouselId}${DIVIDER}${NAV_ID}${DIVIDER}`;

    const observer = getObserver(`.${classes.carouselList}`);

    useEffect(() => {
        // initiate scroll
        scrollCarouselTo(initialIndex);
        const currentIdx = getNavIndexById(window.location.hash);
        toggleActive(currentIdx);

        // initiate observer
        document
            .querySelectorAll(`.${classes.carouselItem}`)
            .forEach((item) => {
                observer.observe(item);
            });
    }, []);

    return (
        <section className={`${classes.container} ${props.containerClassName}`}>
            <ol className={classes.carouselList}>
                {carouselItems!.map((item: any, index: number) => {
                    const id = `${slideIdPrefix}${index}`;
                    return (
                        <li
                            key={id}
                            id={id}
                            className={`${classes.carouselItem} ${props.itemClassName}`}
                        >
                            {item}
                        </li>
                    );
                })}
            </ol>
            <nav className={classes.carouselNav}>
                {carouselItems!.map((_: any, index: number) => {
                    return (
                        <button
                            key={index}
                            id={`${navIdPrefix}${index}`}
                            onClick={(event) => {
                                event.preventDefault();
                                scrollCarouselTo(index);
                            }}
                        ></button>
                    );
                })}
            </nav>
        </section>
    );
}

const getObserver = (selector: any) => {
    return new IntersectionObserver(
        (entries) => {
            const activated = entries.reduce((max, entry) => {
                const entryRatio = entry.intersectionRatio;
                const maxRatio = max.intersectionRatio;
                return entryRatio > maxRatio ? entry : max;
            });

            if (activated.intersectionRatio > 0) {
                const activatedId = activated.target.getAttribute('id');
                const currentIdx = getNavIndexById(activatedId!);
                toggleActive(currentIdx);
            }
        },
        {
            root: document.querySelector(selector),
            rootMargin: '0px',
            threshold: 0.5,
        }
    );
};

const toggleActive = (currentIdx: number) => {
    const navItems = document.querySelectorAll(
        `.${classes.carouselNav} button`
    );
    for (const target of navItems) {
        if (currentIdx === getNavIndexById(target.id)) {
            target.className = classes.active;
        } else {
            target.className = '';
        }
    }
};

const getNavIndexById = (id: string) => {
    return +id.split(DIVIDER)[2];
};

const scrollCarouselTo = (index: number) => {
    const item = document.querySelectorAll(`.${classes.carouselItem}`)[index];
    item.scrollIntoView({
        behavior: 'smooth',
        block: 'end',
        inline: 'center',
    });
};

export default Carousel;
