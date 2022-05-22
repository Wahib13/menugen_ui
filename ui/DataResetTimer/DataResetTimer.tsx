import { useEffect, useState } from 'react';
import styles from './DataResetTimer.module.css'


const useCountdown = (startTime: number, targetDate: number) => {
    const countDownDate = startTime + targetDate;

    const [countDown, setCountDown] = useState(
        countDownDate
    );

    useEffect(() => {
        const interval = setInterval(() => {
            setCountDown(countDownDate - new Date().getTime());
        }, 1000);

        return () => clearInterval(interval);
    }, [countDown]);

    return getReturnValues(countDown);
};

const getReturnValues = (countDown: number) => {
    const hours = Math.floor(
        (countDown % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
    );
    const minutes = Math.floor((countDown % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((countDown % (1000 * 60)) / 1000);

    return [hours, minutes, seconds];
};

export { useCountdown };

const NOW = new Date().getTime();

const DataResetTimer = () => {

    const NUMBER_OF_MINUTES_TILL_NEXT_HOUR = 60 - (getReturnValues(NOW)[1] * 1)

    const [hours, minutes, seconds] = useCountdown(NOW, NUMBER_OF_MINUTES_TILL_NEXT_HOUR * 60 * 1000);


    return (
        <div className={styles.demo_text}>Data is reset every hour. Any changes you make will be lost in<br /> <b>{minutes}m: {seconds}s</b></div>
    )
}

export default DataResetTimer