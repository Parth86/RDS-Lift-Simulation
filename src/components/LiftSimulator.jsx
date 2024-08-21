import React, { useEffect, useState, useCallback } from 'react';
import Lift from './Lift';
import './lift.css';

export default function LiftSimulator({ floorsCount = 10, liftsCount = 3 }) {
    const [calls, setCalls] = useState([]);
    const [lifts, setLifts] = useState([]);

    const floorHeight = 100;
    const timePerFloor = 2;
    const doorStateChangeTime = 2.5;

    const floors = Array.from({ length: floorsCount }, (_, i) => ({
        floor: floorsCount - i - 1
    }));

    useEffect(() => {
        // Initialize lifts based on the liftsCount prop
        const initializeLifts = Array.from({ length: liftsCount }, (_, i) => ({
            index: i,
            position: 0,
            isProcessing: false,
            transitionDuration: 0,
            doorState: '',
        }));
        setLifts(initializeLifts);
    }, [liftsCount]);

    const makeCall = useCallback((targetFloor) => {
        if (!calls.includes(targetFloor) && !lifts.some(lift => lift.position == targetFloor)) {
            setCalls((prevCalls) => [...prevCalls, targetFloor]);
        }
    }, [calls]);

    const findAvailableLift = useCallback((target) => {
        let availableLift = null;
        let minDistance = Infinity;

        lifts.forEach((lift) => {
            if (!lift.isProcessing && lift.doorState == '') {
                const distance = Math.abs(lift.position - target);
                if (distance < minDistance) {
                    minDistance = distance;
                    availableLift = lift;
                }
            }
        });

        return availableLift;
    }, [lifts]);

    const processCalls = useCallback(() => {
        if (calls.length === 0) return;
        const targetFloor = calls[0];

        const availableLift = findAvailableLift(targetFloor);
        if (!availableLift) return;

        const floorsToMove = Math.abs(targetFloor - availableLift.position);
        const duration = floorsToMove * timePerFloor;

        setLifts((prevLifts) =>
            prevLifts.map((lift) =>
                lift.index === availableLift.index
                    ? { ...lift, isProcessing: true, transitionDuration: duration, position: targetFloor, doorState: '' }
                    : lift
            )
        );

        setCalls((prevCalls) => prevCalls.slice(1));

        setTimeout(() => {
            // Open doors when lift reaches the floor
            setLifts((prevLifts) =>
                prevLifts.map((lift) =>
                    lift.index === availableLift.index
                        ? { ...lift, doorState: 'open', isProcessing: false }
                        : lift
                )
            );

            // Close doors
            setTimeout(() => {
                setLifts((prevLifts) =>
                    prevLifts.map((lift) =>
                        lift.index === availableLift.index
                            ? { ...lift, doorState: 'close' }
                            : lift
                    )
                );

                // Reset lift state after door closes
                setTimeout(() => {
                    setLifts((prevLifts) =>
                        prevLifts.map((lift) =>
                            lift.index === availableLift.index
                                ? { ...lift, transitionDuration: 0, doorState: '' }
                                : lift
                        )
                    );
                }, doorStateChangeTime * 1000); // Door closing animation time
            }, doorStateChangeTime * 1000); // Door open time
        }, duration * 1000);
    }, [calls, findAvailableLift, timePerFloor, doorStateChangeTime]);

    useEffect(() => {
        processCalls();
    }, [calls, lifts, processCalls]);

    useEffect(() => {
        // Reset the calls state when the floors prop changes
        setCalls([]);
    }, [floorsCount]);

    return (
        <div className="container relative">
            <p>Floors: {floorsCount}</p>
            <p>Lifts: {liftsCount}</p>

            {floors.map((x, ind) => {
                return (
                    <div
                        key={`floor-${x.floor}`}
                        style={{ height: floorHeight }}
                        className={`w-full border-t-2 border-collapse border-t-black border-b-black ${ind === floors.length - 1 ? 'border-b-2' : ''}`}
                    >
                        Floor {x.floor}
                        <div className="flex flex-col justify-center gap-2 text-left">
                            {x.floor < floorsCount - 1 && (
                                <button
                                    onClick={() => makeCall(x.floor)}
                                    className={`w-20 h-8 font-bold text-white bg-red-500 ${calls.includes(x.floor) ? 'border-red-600 border-2' : ''}`}
                                >
                                    UP
                                </button>
                            )}
                            {x.floor > 0 && (
                                <button
                                    onClick={() => makeCall(x.floor)}
                                    className={`w-20 h-8 font-bold text-white bg-green-500 ${calls.includes(x.floor) ? 'border-red-600 border-2' : ''}`}
                                >
                                    DOWN
                                </button>
                            )}
                        </div>
                    </div>
                );
            })}
            {lifts.map((lift) => (
                <Lift
                    key={'lift-' + lift.index}
                    style={{
                        transform: `translateY(-${(lift.position + 1) * floorHeight}px)`,
                        transition: `transform ${lift.transitionDuration}s ease-in-out`,
                        height: floorHeight * 0.75,
                        marginTop: floorHeight * 0.25,
                        left: (lift.index + 1) * floorHeight,
                    }}
                    doorState={lift.doorState} // pass doorState to Lift component
                    className="absolute mt-auto"
                />
            ))}
        </div>
    );
}