import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../primitives/card';
import { Badge } from '../../primitives/badge';
import { Trophy, Medal, Award } from 'lucide-react';

interface TeamMember {
    rank: number;
    agentId: string;
    agentName: string;
    totalSales: number;
    isCurrentUser?: boolean;
}

interface TeamLeaderboardProps {
    leaderboard: TeamMember[];
    currentAgentId?: string;
}

export function TeamLeaderboard({ leaderboard, currentAgentId }: TeamLeaderboardProps) {
    const formatCurrency = (amount: number) => {
        return `RM ${amount.toLocaleString('ms-MY', { minimumFractionDigits: 2 })}`;
    };

    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return <Trophy className="h-5 w-5 text-yellow-500" />;
            case 2:
                return <Medal className="h-5 w-5 text-gray-400" />;
            case 3:
                return <Award className="h-5 w-5 text-amber-600" />;
            default:
                return <span className="text-sm font-semibold text-muted-foreground">#{rank}</span>;
        }
    };

    return (
        <Card>
            <CardHeader>
                <CardTitle>Papan Pendahulu Pasukan</CardTitle>
                <CardDescription>Top 5 agents dalam team</CardDescription>
            </CardHeader>
            <CardContent>
                <div className="space-y-3">
                    {leaderboard.map((member) => {
                        const isCurrentUser = member.agentId === currentAgentId || member.isCurrentUser;

                        return (
                            <div
                                key={member.agentId}
                                className={`flex items-center gap-3 p-3 rounded-lg transition-colors ${isCurrentUser
                                        ? 'bg-primary/10 border border-primary/20'
                                        : 'bg-muted/50 hover:bg-muted'
                                    }`}
                            >
                                {/* Rank */}
                                <div className="flex items-center justify-center w-8">
                                    {getRankIcon(member.rank)}
                                </div>

                                {/* Agent Info */}
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2">
                                        <p className={`text-sm font-medium truncate ${isCurrentUser ? 'text-primary' : ''
                                            }`}>
                                            {member.agentName}
                                        </p>
                                        {isCurrentUser && (
                                            <Badge variant="outline" className="text-xs">
                                                Anda
                                            </Badge>
                                        )}
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        {formatCurrency(member.totalSales)}
                                    </p>
                                </div>

                                {/* Position Badge for Top 3 */}
                                {member.rank <= 3 && (
                                    <Badge
                                        variant={member.rank === 1 ? 'default' : 'secondary'}
                                        className="text-xs font-semibold"
                                    >
                                        #{member.rank}
                                    </Badge>
                                )}
                            </div>
                        );
                    })}
                </div>

                {leaderboard.length === 0 && (
                    <div className="text-center py-8 text-muted-foreground">
                        <p className="text-sm">Tiada data papan pendahulu</p>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
