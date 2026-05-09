import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Progress } from '../../primitives/progress';
import { TrendingUp, Target, Award } from 'lucide-react';

interface PerformanceStatsData {
    currentMonthTarget: number;
    currentMonthSales: number;
    achievementPercent: number;
    teamRank: number;
    totalTeamMembers: number;
    overallRank: number;
    totalAgents: number;
}

interface PerformanceStatsProps {
    data: PerformanceStatsData;
}

export function PerformanceStats({ data }: PerformanceStatsProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const remaining = data.currentMonthTarget - data.currentMonthSales;
    const isTargetMet = data.currentMonthSales >= data.currentMonthTarget;

    return (
        <div className="grid gap-6 lg:grid-cols-3">
            {/* Current Month Target */}
            <Card className="lg:col-span-2">
                <CardHeader>
                    <div className="flex items-center gap-2">
                        <Target className="h-5 w-5" />
                        <CardTitle>Sasaran Bulan Ini</CardTitle>
                    </div>
                    <CardDescription>
                        {new Date().toLocaleDateString('ms-MY', { month: 'long', year: 'numeric' })}
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-sm text-muted-foreground">Target</p>
                            <p className="text-2xl font-bold">{formatCurrency(data.currentMonthTarget)}</p>
                        </div>
                        <div>
                            <p className="text-sm text-muted-foreground">Pencapaian</p>
                            <p className="text-2xl font-bold text-primary">
                                {formatCurrency(data.currentMonthSales)}
                            </p>
                        </div>
                    </div>

                    <div>
                        <div className="flex justify-between text-sm mb-2">
                            <span>Peratus Pencapaian</span>
                            <span className="font-semibold">{data.achievementPercent}%</span>
                        </div>
                        <Progress value={data.achievementPercent} className="h-3" />
                    </div>

                    <div className={`p-3 rounded-lg ${isTargetMet
                            ? 'bg-green-50 text-green-900'
                            : 'bg-amber-50 text-amber-900'
                        }`}>
                        {isTargetMet ? (
                            <p className="text-sm font-medium">
                                🎉 Tahniah! Target tercapai dengan lebihan {formatCurrency(Math.abs(remaining))}
                            </p>
                        ) : (
                            <p className="text-sm font-medium">
                                Masih perlu {formatCurrency(remaining)} lagi untuk mencapai target
                            </p>
                        )}
                    </div>
                </CardContent>
            </Card>

            {/* Rankings */}
            <div className="space-y-4">
                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <Award className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Ranking Pasukan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">#{data.teamRank}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                daripada {data.totalTeamMembers} ahli
                            </p>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-3">
                        <div className="flex items-center gap-2">
                            <TrendingUp className="h-5 w-5 text-primary" />
                            <CardTitle className="text-base">Ranking Keseluruhan</CardTitle>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-center">
                            <p className="text-4xl font-bold text-primary">#{data.overallRank}</p>
                            <p className="text-sm text-muted-foreground mt-1">
                                daripada {data.totalAgents} agents
                            </p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
