'use client'

import { useState } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { HoverCard, HoverCardContent, HoverCardTrigger } from '@/components/ui/hover-card'

interface Lift {
    id: string
    name: string
    status: 'open' | 'closed' | 'hold'
    type: 'express' | 'quad' | 'magic-carpet'
    difficulty: 'beginner' | 'intermediate' | 'advanced'
    path: [number, number][]
    waitTime: number
}

const lifts: Lift[] = [
    {
        id: '1',
        name: 'Blue Mountain Express',
        status: 'open',
        type: 'express',
        difficulty: 'intermediate',
        path: [[120, 150], [180, 80], [250, 50]],
        waitTime: 5
    },
    {
        id: '2',
        name: 'Summit Quad',
        status: 'open',
        type: 'quad',
        difficulty: 'advanced',
        path: [[250, 200], [300, 150], [350, 100]],
        waitTime: 12
    },
    {
        id: '3',
        name: 'Beginner Magic Carpet',
        status: 'hold',
        type: 'magic-carpet',
        difficulty: 'beginner',
        path: [[180, 300], [180, 250]],
        waitTime: 3
    },
]

const statusColors = {
    open: 'bg-emerald-500 text-white',
    closed: 'bg-red-500 text-white',
    hold: 'bg-amber-500 text-white'
}

const difficultyColors = {
    beginner: 'bg-green-100 text-green-800',
    intermediate: 'bg-blue-100 text-blue-800',
    advanced: 'bg-black text-white'
}

const typeIcons = {
    express: '🚡',
    quad: '🚠',
    'magic-carpet': '✨'
}

export default function Home() {
    const [selectedLift, setSelectedLift] = useState<string | null>(null)

    const drawLiftLine = (points: [number, number][]) => {
        return `M ${points.map(point => point.join(' ')).join(' L ')}`
    }

    return (
        <div className="min-h-screen bg-gradient-to-b from-slate-50 to-slate-100">
            <main className="container mx-auto p-6 space-y-8 max-w-5xl">
                <div className="space-y-2">
                    <h1 className="text-4xl font-bold text-slate-900">Mountain Resort Map</h1>
                    <p className="text-slate-600">Select a lift to see its route and details</p>
                </div>

                {/* Status Legend */}
                <div className="flex gap-4 flex-wrap">
                    {Object.entries(statusColors).map(([status, color]) => (
                        <div key={status} className="flex items-center gap-2">
                            <div className={`w-3 h-3 rounded-full ${color.split(' ')[0]}`} />
                            <span className="capitalize text-sm text-slate-600">{status}</span>
                        </div>
                    ))}
                </div>

                {/* Map Container */}
                <Card className="relative w-full h-[600px] overflow-hidden shadow-xl">
                    <div className="absolute inset-0 bg-slate-200/50" /> {/* Placeholder for map */}

                    {/* SVG Layer for Lift Lines */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none">
                        {lifts.map((lift) => (
                            <path
                                key={lift.id}
                                d={drawLiftLine(lift.path)}
                                stroke={selectedLift === lift.id ? '#0f172a' : '#64748b'}
                                strokeWidth={selectedLift === lift.id ? 4 : 2}
                                fill="none"
                                className="transition-all duration-300"
                                strokeDasharray={lift.status === 'closed' ? '5,5' : 'none'}
                            />
                        ))}
                    </svg>

                    {/* Lift Markers */}
                    {lifts.map((lift) => (
                        <HoverCard key={lift.id}>
                            <HoverCardTrigger>
                                <div
                                    className={`absolute cursor-pointer transition-all duration-300
                    ${selectedLift === lift.id ? 'scale-150 z-20' : 'scale-100 z-10'}`}
                                    style={{
                                        left: lift.path[0][0],
                                        top: lift.path[0][1],
                                    }}
                                >
                                    <div className={`w-6 h-6 rounded-full ${statusColors[lift.status]} 
                    shadow-lg flex items-center justify-center
                    border-2 border-white transform -translate-x-1/2 -translate-y-1/2`}>
                                        <span className="text-xs">{typeIcons[lift.type]}</span>
                                    </div>
                                </div>
                            </HoverCardTrigger>
                            <HoverCardContent className="w-64">
                                <div className="space-y-2">
                                    <h4 className="font-semibold">{lift.name}</h4>
                                    <div className="flex gap-2">
                                        <Badge variant="secondary" className={statusColors[lift.status]}>
                                            {lift.status.toUpperCase()}
                                        </Badge>
                                        <Badge variant="secondary" className={difficultyColors[lift.difficulty]}>
                                            {lift.difficulty.toUpperCase()}
                                        </Badge>
                                    </div>
                                    <p className="text-sm text-slate-600">
                                        Wait time: {lift.waitTime} minutes
                                    </p>
                                </div>
                            </HoverCardContent>
                        </HoverCard>
                    ))}
                </Card>

                {/* Lift List */}
                <div className="grid gap-4">
                    <h2 className="text-2xl font-semibold text-slate-900">Lifts</h2>
                    <div className="grid gap-3">
                        {lifts.map((lift) => (
                            <Button
                                key={lift.id}
                                variant={selectedLift === lift.id ? "default" : "outline"}
                                onClick={() => setSelectedLift(lift.id)}
                                className={`w-full p-6 justify-between group hover:shadow-md
                  ${selectedLift === lift.id ? 'ring-2 ring-offset-2 ring-slate-900' : ''}
                  transition-all duration-300`}
                            >
                                <div className="flex items-center gap-3">
                                    <span className="text-xl">{typeIcons[lift.type]}</span>
                                    <div className="flex flex-col items-start">
                                        <span className="font-medium">{lift.name}</span>
                                        <span className="text-sm text-slate-600">{lift.waitTime} min wait</span>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Badge variant="secondary" className={difficultyColors[lift.difficulty]}>
                                        {lift.difficulty}
                                    </Badge>
                                    <Badge variant="secondary" className={statusColors[lift.status]}>
                                        {lift.status}
                                    </Badge>
                                </div>
                            </Button>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}