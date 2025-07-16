import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, MessageSquare, User, Settings, LogOut, Clock, Users, Star, TrendingUp, BookOpen, Plus, Edit3 } from 'lucide-react';
import Navigation from '@/components/Navigation';

interface Profile {
  id: string;
  full_name: string;
  phone: string;
  dietary_preferences: string[];
}

interface Reservation {
  id: string;
  guest_name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  special_requests: string;
}

interface Review {
  id: string;
  reviewer_name: string;
  rating: number;
  comment: string;
  created_at: string;
}

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const { toast } = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate('/auth');
      return;
    }

    if (user) {
      loadUserData();
    }
  }, [user, loading, navigate]);

  const loadUserData = async () => {
    try {
      setLoadingData(true);
      
      // Load profile
      const { data: profileData } = await supabase
        .from('profiles')
        .select('*')
        .eq('user_id', user?.id)
        .single();
      
      if (profileData) setProfile(profileData);

      // Load reservations
      const { data: reservationsData } = await supabase
        .from('reservations')
        .select('*')
        .eq('user_id', user?.id)
        .order('date', { ascending: false });
      
      if (reservationsData) setReservations(reservationsData);

      // Load reviews
      const { data: reviewsData } = await supabase
        .from('reviews')
        .select('*')
        .eq('user_id', user?.id)
        .order('created_at', { ascending: false });
      
      if (reviewsData) setReviews(reviewsData);

    } catch (error) {
      toast({
        title: "Error loading data",
        description: "There was an issue loading your information.",
        variant: "destructive"
      });
    } finally {
      setLoadingData(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-muted-foreground">Loading your dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <Card className="bg-gradient-primary text-white border-0 shadow-soft">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center text-2xl font-bold">
                    {(profile?.full_name || user?.email)?.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold mb-1">
                      Welcome back, {profile?.full_name || user?.email?.split('@')[0]}!
                    </h1>
                    <p className="text-white/80 text-lg">
                      {reservations.length > 0 ? 
                        `Your next reservation is on ${reservations[0]?.date}` : 
                        'Ready to make your next reservation?'
                      }
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center space-x-4 mb-3">
                    <div className="text-center">
                      <div className="text-2xl font-bold">{reservations.length}</div>
                      <div className="text-xs text-white/70">Reservations</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold">{reviews.length}</div>
                      <div className="text-xs text-white/70">Reviews</div>
                    </div>
                  </div>
                  <Button variant="secondary" onClick={handleSignOut} className="bg-white/20 text-white hover:bg-white/30 border-white/30">
                    <LogOut className="mr-2 h-4 w-4" />
                    Sign Out
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-soft transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Reservations</CardTitle>
              <Calendar className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{reservations.length}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <TrendingUp className="h-3 w-3 mr-1 text-green-500" />
                  Active
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                {reservations.filter(r => r.status === 'confirmed').length} confirmed
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => navigate('/#reservations')}>
                <Plus className="mr-2 h-3 w-3" />
                New Reservation
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-soft transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Reviews Written</CardTitle>
              <MessageSquare className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold">{reviews.length}</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <Star className="h-3 w-3 mr-1 text-yellow-500" />
                  {reviews.length > 0 ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1) : '0.0'}
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Average rating given
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full" onClick={() => navigate('/#reviews')}>
                <Edit3 className="mr-2 h-3 w-3" />
                Write Review
              </Button>
            </CardContent>
          </Card>
          
          <Card className="hover:shadow-soft transition-all duration-300 group">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Account Status</CardTitle>
              <User className="h-4 w-4 text-primary group-hover:scale-110 transition-transform" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center justify-between">
                <div className="text-2xl font-bold text-green-600">Active</div>
                <div className="flex items-center text-xs text-muted-foreground">
                  <BookOpen className="h-3 w-3 mr-1" />
                  Member
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground">
                Since {new Date(user?.created_at || '').toLocaleDateString() || 'Recently'}
              </div>
              <Button size="sm" variant="outline" className="mt-3 w-full">
                <Settings className="mr-2 h-3 w-3" />
                Edit Profile
              </Button>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="reservations" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted p-1 rounded-lg">
            <TabsTrigger 
              value="reservations" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              My Reservations
              {reservations.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {reservations.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="reviews" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 flex items-center gap-2"
            >
              <MessageSquare className="h-4 w-4" />
              My Reviews
              {reviews.length > 0 && (
                <Badge variant="secondary" className="ml-1 text-xs">
                  {reviews.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger 
              value="profile" 
              className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground transition-all duration-200 flex items-center gap-2"
            >
              <User className="h-4 w-4" />
              Profile Settings
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="reservations" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reservations</CardTitle>
                <CardDescription>
                  View and manage your restaurant reservations
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reservations.length === 0 ? (
                  <div className="text-center py-8">
                    <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No reservations yet</p>
                    <Button className="mt-4" onClick={() => navigate('/#reservations')}>
                      Make a Reservation
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reservations.map((reservation) => (
                      <div key={reservation.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            <Clock className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{reservation.date} at {reservation.time}</span>
                          </div>
                          <Badge variant={
                            reservation.status === 'confirmed' ? 'default' :
                            reservation.status === 'pending' ? 'secondary' : 'destructive'
                          }>
                            {reservation.status}
                          </Badge>
                        </div>
                        <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                          <div className="flex items-center space-x-1">
                            <Users className="h-4 w-4" />
                            <span>{reservation.guests} guests</span>
                          </div>
                          {reservation.special_requests && (
                            <span>• {reservation.special_requests}</span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="reviews" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Your Reviews</CardTitle>
                <CardDescription>
                  Reviews you've written about your dining experiences
                </CardDescription>
              </CardHeader>
              <CardContent>
                {reviews.length === 0 ? (
                  <div className="text-center py-8">
                    <MessageSquare className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                    <p className="text-muted-foreground">No reviews yet</p>
                    <Button className="mt-4" onClick={() => navigate('/#reviews')}>
                      Write a Review
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {reviews.map((review) => (
                      <div key={review.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center space-x-2">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`h-4 w-4 ${
                                  i < review.rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-muted-foreground">
                            {new Date(review.created_at).toLocaleDateString()}
                          </span>
                        </div>
                        <p className="text-foreground">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="profile" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Profile Settings</CardTitle>
                <CardDescription>
                  Manage your account information and preferences
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium">Full Name</label>
                    <p className="text-muted-foreground">{profile?.full_name || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Email</label>
                    <p className="text-muted-foreground">{user?.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Phone</label>
                    <p className="text-muted-foreground">{profile?.phone || 'Not set'}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium">Dietary Preferences</label>
                    <p className="text-muted-foreground">
                      {profile?.dietary_preferences?.length ? 
                        profile.dietary_preferences.join(', ') : 
                        'None specified'
                      }
                    </p>
                  </div>
                </div>
                <Button className="mt-4">
                  <Settings className="mr-2 h-4 w-4" />
                  Edit Profile
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Dashboard;