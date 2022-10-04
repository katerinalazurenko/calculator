import classes from "./Calc.module.scss";
import React, {useEffect, useRef, useState} from 'react';

export const Calc = () => {
    let [carCost, setCarCost] = useState(3300000)
    let [percent, setPercent] = useState(13)

    let startDownPayment = carCost * percent/100

    let [downPayment, setDownPayment] = useState((startDownPayment))
    let [leasingPeriod, setLeasingPeriod] = useState(60)
    let [disabled, setDisabled] = useState(false)
    let [editMode, setEditMode] = useState(false)
    let [ width1, setWidth1 ] = useState((carCost - 1000000) / (6000000 - 1000000) * 100);
    let [ width2, setWidth2 ] = useState((percent - 10) / (60 - 10) * 100);
    let [ width3, setWidth3 ] = useState((leasingPeriod - 0) / (60 - 0) * 100);

    const styles1 = { backgroundImage: `linear-gradient(90deg, #FF9514 ${width1}%, #E1E1E1 ${width1}%)` };
    const styles2 = { backgroundImage: `linear-gradient(90deg, #FF9514 ${width2}%, #E1E1E1 ${width2}%)` };
    const styles3 = { backgroundImage: `linear-gradient(90deg, #FF9514 ${width3}%, #E1E1E1 ${width3}%)` };

    const startMonthlyPayment = Math.round((carCost - downPayment) * ((0.035 * Math.pow((1 + 0.035), leasingPeriod)) /
            (Math.pow((1 + 0.035), leasingPeriod) - 1)))

    const startLeasingAmount = Math.round(downPayment + leasingPeriod * startMonthlyPayment)

    let [monthlyPayment, setMonthlyPayment] = useState(startMonthlyPayment)
    let [leasingAmount, setLeasingAmount] = useState(startLeasingAmount)

    const setResults = () => {
        setMonthlyPayment(Math.round((carCost - downPayment) * ((0.035 * Math.pow((1 + 0.035), leasingPeriod)) /
            (Math.pow((1 + 0.035), leasingPeriod) - 1))))
        setLeasingAmount(Math.round(downPayment + leasingPeriod * monthlyPayment))
    }


    useEffect( () => {
        if(carCost >= 1000000 && carCost <= 6000000 && downPayment * 100/carCost >= 10 && downPayment * 100/carCost <= 60){
            // setDownPayment(Math.round(carCost * percent / 100))
            setPercent(Math.round(downPayment * 100/carCost))
            setWidth1((carCost - 1000000) / (6000000 - 1000000) * 100)
            setWidth2((percent - 10) / (60 - 10) * 100)
            setResults()
        }
    }, [carCost, percent, leasingPeriod, downPayment, monthlyPayment])

    const sendData = async (data) => {
        try {
            await fetch(`https://eoj3r7f3r4ef6v4.m.pipedream.net`,  {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });

        } catch (err) {
            console.log(err)
        }
    };


    const changeCarCost = (e) => {
        setCarCost(Number(e.target.value.replace(/\s/g, '')))
        setDownPayment(Math.round(Number(e.target.value.replace(/\s/g, '')) * percent / 100))
        setWidth1((carCost - 1000000) / (6000000 - 1000000) * 100)
    }

    const getCarCost = (e) => {
        if(Number(e.target.value.replace(/\s/g, '')) < 1000000){
            setCarCost(1000000)
            setDownPayment(Math.round(1000000 * percent / 100))
        } else if(Number(e.target.value.replace(/\s/g, '')) > 6000000){
            setCarCost(6000000)
            setDownPayment(Math.round(6000000 * percent / 100))
        } else {
            setCarCost(Number(e.target.value.replace(/\s/g, '')))
            setDownPayment(Math.round(Number(e.target.value.replace(/\s/g, '')) * percent / 100))
        }
    }

    const getDownPayment = (e) => {
        setPercent(Number(e.target.value.replace(/\s/g, '')))
        setDownPayment(Math.round(carCost * Number(e.target.value.replace(/\s/g, ''))/100))
    }

    const getDownPaymentInput = (e) => {
        setEditMode(true)
        setDownPayment(Number(e.target.value.replace(/\s/g, '').match(/\d+/g)))
    }


    const getLeasingPeriod = (e) => {
        if(Number(e.target.value) > 60){
            setLeasingPeriod(60)
        }
        else if(Number(e.target.value) < 1){
            setLeasingPeriod(1)
        } else {
            setLeasingPeriod(Number(e.target.value))
        }
        setWidth3((e.target.value - 0) / (60 - 0) * 100)
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        const data = {
            "car_coast": carCost,
            "initail_payment": downPayment,
            "initail_payment_percent": percent,
            "lease_term": leasingPeriod,
            "total_sum": monthlyPayment,
            "monthly_payment_from": leasingAmount
        }
        sendData(data)
        setDisabled(true)
    }

    return (
        <form>
            <h1>Рассчитайте стоимость автомобиля в лизинг</h1>
            <div className={classes.top}>
                <label className={classes.rangeBlock} htmlFor="carCost"><span className={classes.text}>Стоимость автомобиля</span>
                    <input className={classes.rangeInput} disabled={disabled} value={carCost.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')} type="text" name="carCost"
                           onChange={changeCarCost} onBlur={getCarCost}/>
                    <input className={classes.range} disabled={disabled} style={styles1} type="range" min="1000000" max="6000000" step="1" value={carCost}
                           onChange={changeCarCost}/>
                </label>
                <label className={classes.rangeBlock} htmlFor="downPayment"><span className={classes.text}>Первоначальный взнос</span>
                    {editMode && <input className={classes.rangeInput} autoFocus disabled={disabled}
                           value={`${downPayment.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}`}
                           type="text" name="downPayment" onChange={getDownPaymentInput}/>}
                    {!editMode && <span className={classes.rangeInput} data-disabled={disabled} onClick={getDownPaymentInput}>
                        {`${downPayment.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')} ₽`}</span>}
                    <input className={`${classes.range}  ${classes.rangeMedium}`} style={styles2} disabled={disabled}
                           type="range" min='10' max='60' step="1" value={percent} onChange={getDownPayment}/>
                    <div className={classes.percent}>{`${percent}%`}</div>
                </label>
                <label className={classes.rangeBlock} htmlFor="leasingPeriod"><span className={classes.text}>Срок лизинга</span>
                    <input className={classes.rangeInput} disabled={disabled} value={leasingPeriod} type="text" name="leasingPeriod" onChange={getLeasingPeriod}/>
                    <input className={classes.range} style={styles3} disabled={disabled} type="range" min="1" max="60" step="1"
                           value={leasingPeriod} onChange={getLeasingPeriod}/>
                </label>
            </div>
            <div className={classes.bottom}>
                    <div className={classes.total}>
                        <p className={classes.text}>Сумма договора лизинга</p>
                        <div className={classes.totalValue}>{leasingAmount.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}₽</div>
                    </div>
                    <div className={classes.total}>
                        <p className={classes.text}>Ежемесячный платеж от</p>
                        <div className={classes.totalValue}>{monthlyPayment.toString().replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ')}₽</div>
                    </div>
                <button onClick={handleSubmit} disabled={disabled} className={classes.btn}>
                    {!disabled && <span>Оставить заявку</span>}
                    {disabled && <div className={classes.preloader}></div>}
                </button>
            </div>
        </form>
    )
}