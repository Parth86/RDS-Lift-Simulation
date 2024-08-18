import React from 'react'

export default function Lift({ className, ...props }) {
    return (
        <div className={`w-20 bg-blue-500 ${className}`} {...props}></div>
    )
}
