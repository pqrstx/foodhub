import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Clock, Calendar, MessageSquare, User, Award, Star } from 'lucide-react';

interface Activity {
  id: string;
  type: 'reservation' | 'review' | 'profile' | 'achievement';
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  metadata?: Record<string, any>;
}

interface ActivityTimelineProps {
  reservations: any[];
  reviews: any[];
  profile: any;
}

export const ActivityTimeline = ({ reservations, reviews, profile }: ActivityTimelineProps) => {
  // Generate activity timeline from user data
  const generateActivities = (): Activity[] => {
    const activities: Activity[] = [];

    // Add reservation activities
    reservations.forEach(reservation => {
      activities.push({
        id: `reservation-${reservation.id}`,
        type: 'reservation',
        title: 'Reservation Made',
        description: `Table for ${reservation.guests} guests on ${reservation.date}`,
        timestamp: reservation.created_at,
        status: reservation.status,
        metadata: { guests: reservation.guests, date: reservation.date }
      });
    });

    // Add review activities
    reviews.forEach(review => {
      activities.push({
        id: `review-${review.id}`,
        type: 'review',
        title: 'Review Posted',
        description: `Gave ${review.rating} stars: "${review.comment.substring(0, 50)}..."`,
        timestamp: review.created_at,
        metadata: { rating: review.rating }
      });
    });

    // Add profile activities
    if (profile) {
      activities.push({
        id: 'profile-created',
        type: 'profile',
        title: 'Profile Created',
        description: 'Welcome to our restaurant family!',
        timestamp: profile.created_at || new Date().toISOString()
      });
    }

    // Add achievement activities
    if (reviews.length >= 5) {
      activities.push({
        id: 'achievement-reviewer',
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: 'Frequent Reviewer - Posted 5 reviews',
        timestamp: reviews[4]?.created_at || new Date().toISOString(),
        metadata: { achievement: 'frequent_reviewer' }
      });
    }

    if (reservations.length >= 3) {
      activities.push({
        id: 'achievement-diner',
        type: 'achievement',
        title: 'Achievement Unlocked',
        description: 'Regular Diner - Made 3 reservations',
        timestamp: reservations[2]?.created_at || new Date().toISOString(),
        metadata: { achievement: 'regular_diner' }
      });
    }

    // Sort by timestamp (newest first)
    return activities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const activities = generateActivities();

  const getActivityIcon = (type: Activity['type']) => {
    switch (type) {
      case 'reservation':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'review':
        return <MessageSquare className="h-4 w-4 text-green-500" />;
      case 'profile':
        return <User className="h-4 w-4 text-purple-500" />;
      case 'achievement':
        return <Award className="h-4 w-4 text-yellow-500" />;
      default:
        return <Clock className="h-4 w-4 text-gray-500" />;
    }
  };

  const getActivityBadge = (activity: Activity) => {
    switch (activity.type) {
      case 'reservation':
        const status = activity.status || 'pending';
        return (
          <Badge variant={
            status === 'confirmed' ? 'default' :
            status === 'pending' ? 'secondary' : 'destructive'
          }>
            {status}
          </Badge>
        );
      case 'review':
        return (
          <Badge variant="outline" className="text-yellow-600">
            <Star className="h-3 w-3 mr-1" />
            {activity.metadata?.rating} stars
          </Badge>
        );
      case 'achievement':
        return <Badge variant="outline" className="text-yellow-600">Achievement</Badge>;
      default:
        return null;
    }
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours} hours ago`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} days ago`;
    return date.toLocaleDateString();
  };

  if (activities.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Activity Timeline
          </CardTitle>
          <CardDescription>Your recent activity and achievements</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Clock className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No activity yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              Start by making a reservation or leaving a review!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Activity Timeline
        </CardTitle>
        <CardDescription>Your recent activity and achievements</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.slice(0, 10).map((activity, index) => (
            <div key={activity.id} className="flex items-start space-x-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                {getActivityIcon(activity.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="font-medium text-sm">{activity.title}</p>
                  <div className="flex items-center space-x-2">
                    {getActivityBadge(activity)}
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(activity.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activity.description}</p>
              </div>
            </div>
          ))}
          
          {activities.length > 10 && (
            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground">
                And {activities.length - 10} more activities...
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};