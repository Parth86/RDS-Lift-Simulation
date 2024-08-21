import React from 'react'

export default function Lift({ doorState, className, ...props }) {
    return (
        <div className={`w-20 bg-gray-500 ${className}`} {...props}>
            <div className={`lift-door ${doorState} bg-blue-500`}></div>
        </div>
    )
}
