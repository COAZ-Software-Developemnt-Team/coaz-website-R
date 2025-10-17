import {useEffect, useState} from 'react';

function AGMCountdown() {
    const [timeLeft, setTimeLeft] = useState({
        days: 0,
        hours: 0,
        minutes: 0,
        seconds: 0
    });

    useEffect(() => {
        // Set target date to October 20th (current year)
        const currentYear = new Date().getFullYear();
        const targetDate = new Date(`${currentYear}-10-20T00:00:00`);

        // If October 20th already passed this year, use next year
        if (targetDate < new Date()) {
            targetDate.setFullYear(currentYear + 1);
        }

        const timer = setInterval(() => {
            const now = new Date();
            const difference = targetDate.getTime() - now.getTime();

            if (difference > 0) {
                const days = Math.floor(difference / (1000 * 60 * 60 * 24));
                const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
                const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((difference % (1000 * 60)) / 1000);

                setTimeLeft({ days, hours, minutes, seconds });
            } else {
                clearInterval(timer);
                setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
            }
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="flex flex-col items-center mt-4">
            <p className="text-lg font-semibold mb-2">Time Until AGM:</p>
            <div className="flex space-x-4 text-xl font-bold">
                <div className="bg-blue-100 px-3 py-2 rounded-md">
                    <span>{timeLeft.days}</span>
                    <span className="block text-sm">Days</span>
                </div>
                <div className="bg-green-100 px-3 py-2 rounded-md">
                    <span>{timeLeft.hours}</span>
                    <span className="block text-sm">Hours</span>
                </div>
                <div className="bg-yellow-100 px-3 py-2 rounded-md">
                    <span>{timeLeft.minutes}</span>
                    <span className="block text-sm">Minutes</span>
                </div>
                <div className="bg-red-100 px-3 py-2 rounded-md">
                    <span>{timeLeft.seconds}</span>
                    <span className="block text-sm">Seconds</span>
                </div>
            </div>
        </div>
    );
}

// Usage in your component:
<p className='w-full sm:w-[450px] md:w-[610px] px-4 lg:w-[730px] font-nunitoSansRegular text-[16px]/[28px] text-gray text-center'>
    We have our Annual General Meeting Coming Up
</p>
<AGMCountdown />