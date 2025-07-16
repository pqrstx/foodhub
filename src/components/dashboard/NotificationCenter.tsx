import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, BellOff, CheckCircle, Info, AlertTriangle, Calendar, MessageSquare, User, Settings } from 'lucide-react';

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'reminder';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
  metadata?: Record<string, any>;
}

interface NotificationCenterProps {
  reservations: any[];
  reviews: any[];
}

export const NotificationCenter = ({ reservations, reviews }: NotificationCenterProps) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [showAll, setShowAll] = useState(false);

  // Generate notifications based on user data
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];

    // Add reservation reminders
    reservations.forEach(reservation => {
      const reservationDate = new Date(reservation.date);
      const now = new Date();
      const daysBefore = Math.ceil((reservationDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
      
      if (daysBefore === 1 && reservation.status === 'confirmed') {
        notifications.push({
          id: `reminder-${reservation.id}`,
          type: 'reminder',
          title: 'Reservation Reminder',
          message: `Your reservation for ${reservation.guests} guests is tomorrow at ${reservation.time}`,
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2 hours ago
          read: false,
          metadata: { reservationId: reservation.id }
        });
      }
      
      if (reservation.status === 'pending') {
        notifications.push({
          id: `pending-${reservation.id}`,
          type: 'info',
          title: 'Reservation Pending',
          message: `Your reservation for ${reservation.date} is awaiting confirmation`,
          timestamp: reservation.created_at,
          read: false,
          metadata: { reservationId: reservation.id }
        });
      }
    });

    // Add review acknowledgments
    reviews.forEach(review => {
      notifications.push({
        id: `review-ack-${review.id}`,
        type: 'success',
        title: 'Review Published',
        message: `Thank you for your ${review.rating}-star review! It helps other diners choose our restaurant.`,
        timestamp: new Date(new Date(review.created_at).getTime() + 60 * 60 * 1000).toISOString(), // 1 hour after review
        read: Math.random() > 0.5,
        metadata: { reviewId: review.id }
      });
    });

    // Add system notifications
    notifications.push({
      id: 'welcome',
      type: 'info',
      title: 'Welcome to Our Restaurant!',
      message: 'Thank you for joining our family. Enjoy exclusive offers and priority reservations.',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days ago
      read: true
    });

    if (reservations.length >= 3) {
      notifications.push({
        id: 'loyalty',
        type: 'success',
        title: 'Loyalty Milestone Reached!',
        message: 'You\'ve made 3 reservations! You\'re now eligible for our loyalty program.',
        timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
        read: false
      });
    }

    // Add promotional notifications
    notifications.push({
      id: 'promo-weekend',
      type: 'info',
      title: 'Weekend Special Offer',
      message: 'Get 20% off your next weekend reservation. Use code WEEKEND20 at checkout.',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000).toISOString(), // 6 hours ago
      read: false
    });

    // Sort by timestamp (newest first)
    return notifications.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
  };

  const allNotifications = generateNotifications();
  const unreadCount = allNotifications.filter(n => !n.read).length;
  const displayNotifications = showAll ? allNotifications : allNotifications.slice(0, 5);

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
      case 'reminder':
        return <Calendar className="h-4 w-4 text-blue-500" />;
      case 'info':
      default:
        return <Info className="h-4 w-4 text-blue-500" />;
    }
  };

  const getNotificationBadge = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <Badge variant="outline" className="text-green-600">Success</Badge>;
      case 'warning':
        return <Badge variant="outline" className="text-yellow-600">Warning</Badge>;
      case 'reminder':
        return <Badge variant="outline" className="text-blue-600">Reminder</Badge>;
      case 'info':
      default:
        return <Badge variant="outline" className="text-blue-600">Info</Badge>;
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

  const markAsRead = (notificationId: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, read: true }
          : notification
      )
    );
  };

  const markAllAsRead = () => {
    setNotifications(prev => 
      prev.map(notification => ({ ...notification, read: true }))
    );
  };

  if (allNotifications.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" />
            Notifications
          </CardTitle>
          <CardDescription>Stay updated with your latest activity</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <BellOff className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No notifications yet</p>
            <p className="text-sm text-muted-foreground mt-2">
              We'll notify you about reservations, reviews, and special offers!
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5" />
              Notifications
              {unreadCount > 0 && (
                <Badge variant="destructive" className="ml-2">
                  {unreadCount}
                </Badge>
              )}
            </CardTitle>
            <CardDescription>Stay updated with your latest activity</CardDescription>
          </div>
          {unreadCount > 0 && (
            <Button variant="outline" size="sm" onClick={markAllAsRead}>
              Mark all as read
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {displayNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`flex items-start space-x-3 p-3 rounded-lg transition-all duration-200 hover:bg-muted/50 ${
                !notification.read ? 'bg-muted/30 border border-primary/20' : ''
              }`}
            >
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-background flex items-center justify-center border">
                {getNotificationIcon(notification.type)}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-1">
                  <p className={`font-medium text-sm ${!notification.read ? 'text-primary' : ''}`}>
                    {notification.title}
                  </p>
                  <div className="flex items-center space-x-2">
                    {getNotificationBadge(notification.type)}
                    <span className="text-xs text-muted-foreground">
                      {formatTimestamp(notification.timestamp)}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{notification.message}</p>
                {!notification.read && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-2 text-xs"
                    onClick={() => markAsRead(notification.id)}
                  >
                    Mark as read
                  </Button>
                )}
              </div>
            </div>
          ))}
          
          {allNotifications.length > 5 && (
            <div className="text-center pt-4">
              <Button
                variant="outline"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? 'Show Less' : `Show ${allNotifications.length - 5} More`}
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};