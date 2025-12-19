import React from 'react';
import TextHeatmap from './TextHeatmap';
import { Clock, Tag, AlertTriangle } from 'lucide-react';

const MetricCard: React.FC<{ title: string; value: string; subtext: string; icon: React.ReactNode; color: string }> = ({
    title, value, subtext, icon, color
}) => (
    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
        <div>
            <div className="text-gray-500 text-xs font-bold uppercase tracking-wider mb-1">{title}</div>
            <div className="text-2xl font-bold text-gray-900 mb-1">{value}</div>
            <div className="text-xs text-gray-400">{subtext}</div>
        </div>
        <div className={`p-3 rounded-lg ${color} text-white`}>
            {icon}
        </div>
    </div>
);

const TeacherDashboard: React.FC = () => {
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <header className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Class Analytics: AP Lang Period 3</h1>
                <p className="text-gray-500">Assignment: Queen Elizabeth I - Speech at Tilbury</p>
            </header>

            {/* Metrics Rows */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
                <MetricCard
                    title="Avg. Time on Text"
                    value="12m 45s"
                    subtext="+2m vs Class Average"
                    icon={<Clock size={20} />}
                    color="bg-indigo-500"
                />
                <MetricCard
                    title="Top Rhetorical Tag"
                    value="To Contrast"
                    subtext="Used in 45% of annotations"
                    icon={<Tag size={20} />}
                    color="bg-emerald-500"
                />
                <MetricCard
                    title="Hardest Speed Bump"
                    value="Tone Shift (Pg 3)"
                    subtext="60% failure rate on 1st try"
                    icon={<AlertTriangle size={20} />}
                    color="bg-amber-500"
                />
            </div>

            {/* Heatmap Section */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-xl font-bold text-gray-800">Engagement Heatmap</h2>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-amber-100 rounded-sm"></div>
                            <span>Low</span>
                        </div>
                        <div className="flex items-center gap-1">
                            <div className="w-3 h-3 bg-red-500 rounded-sm"></div>
                            <span>High Intensity</span>
                        </div>
                    </div>
                </div>

                <TextHeatmap />
            </div>
        </div>
    );
};

export default TeacherDashboard;
