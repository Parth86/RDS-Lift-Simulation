import React, { useEffect, useState } from 'react';
import Lift from './Lift';

export default function LiftSimulator({ floors = 4 }) {
    const [liftPos, setLiftPos] = useState(0);
    const [transitionDuration, setTransitionDuration] = useState(0);
    const [calls, setCalls] = useState([]);
    const [isProcessing, setIsProcessing] = useState(false);

    const floorHeight = 100;
    const timePerFloor = 2;

    const makeCall = (targetFloor) => {
        if (calls.includes(targetFloor)) return

        setCalls((prevCalls) => [...prevCalls, targetFloor]);
    };

    const processCalls = () => {
        if (calls.length > 0 && !isProcessing) {
            const targetFloor = calls[0];
            const floorsToMove = Math.abs(targetFloor - liftPos);
            const duration = floorsToMove * timePerFloor;

            setTransitionDuration(duration);
            setLiftPos(targetFloor);
            setIsProcessing(true);
        }
    };

    useEffect(() => {
        if (isProcessing && liftPos === calls[0]) {
            const timeoutId = setTimeout(() => {
                setCalls((prevCalls) => prevCalls.slice(1));
                setIsProcessing(false);
            }, transitionDuration * 1000);

            return () => clearTimeout(timeoutId);
        }
    }, [liftPos]);

    useEffect(() => {
        if (!isProcessing && calls.length > 0) {
            processCalls();
        }
    }, [calls]);

    return (
        <div className='container relative'>
            {[...Array(floors + 1)].map((_, ind) => {
                const floor = floors - ind;
                return (
                    <div
                        key={floor}
                        style={{ height: floorHeight }}
                        className={`w-full border-t-2 border-collapse border-t-black border-b-black ${ind === floors ? 'border-b-2' : ''}`}
                    >
                        Floor {floor}
                        <div className='flex flex-col gap-4 text-left'>
                            <button
                                onClick={() => makeCall(floor)}
                                className={`w-20 h-10 font-bold text-white bg-blue-500 ${calls.includes(floor) ? 'border-red-600 border-2' : ''}`}
                            >
                                CALL
                            </button>
                        </div>
                    </div>
                );
            })}
            <Lift
                style={{
                    transform: `translateY(-${(liftPos + 1) * floorHeight}px)`,
                    transition: `transform ${transitionDuration}s ease-in-out`,
                    height: floorHeight * 0.75,
                    marginTop: floorHeight * 0.25,
                }}
                className="absolute mt-auto ml-52"
            />
        </div>
    );
}
