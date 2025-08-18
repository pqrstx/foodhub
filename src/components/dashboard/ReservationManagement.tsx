import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Calendar, Clock, Users, Edit3, Trash2, Filter, Search, CalendarDays, Eye, ShoppingBag } from 'lucide-react';
import { formatKsh } from '@/data/menu';

interface Reservation {
  id: string;
  guest_name: string;
  date: string;
  time: string;
  guests: number;
  status: string;
  special_requests: string;
  guest_email: string;
  guest_phone: string;
  created_at: string;
  reservation_orders?: {
    id: string;
    total_amount: number;
    payment_status: string;
    order_items: {
      name: string;
      quantity: number;
      price: number;
      special_requests?: string;
    }[];
  }[];
}

interface ReservationManagementProps {
  reservations: Reservation[];
  onReservationUpdate: () => void;
}

export const ReservationManagement = ({ reservations, onReservationUpdate }: ReservationManagementProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [viewMode, setViewMode] = useState<'list' | 'calendar'>('list');
  const [selectedReservation, setSelectedReservation] = useState<Reservation | null>(null);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const { toast } = useToast();

  const filteredReservations = reservations.filter(reservation => {
    const matchesSearch = reservation.guest_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         reservation.date.includes(searchTerm) ||
                         reservation.special_requests?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || reservation.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const upcomingReservations = filteredReservations.filter(r => new Date(r.date) >= new Date());
  const pastReservations = filteredReservations.filter(r => new Date(r.date) < new Date());

  const handleCancelReservation = async (reservationId: string) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status: 'cancelled' })
        .eq('id', reservationId);

      if (error) throw error;

      toast({
        title: "Reservation cancelled",
        description: "Your reservation has been cancelled successfully.",
      });
      
      onReservationUpdate();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to cancel reservation. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'default';
      case 'pending': return 'secondary';
      case 'cancelled': return 'destructive';
      default: return 'secondary';
    }
  };

  const ReservationCard = ({ reservation, isPast }: { reservation: Reservation; isPast: boolean }) => (
    <div className={`border rounded-lg p-4 transition-all duration-200 hover:shadow-md ${isPast ? 'opacity-70' : ''}`}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">{reservation.date} at {reservation.time}</span>
          </div>
          <Badge variant={getStatusColor(reservation.status)}>
            {reservation.status}
          </Badge>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            size="sm"
            variant="outline"
            onClick={() => {
              setSelectedReservation(reservation);
              setIsViewDialogOpen(true);
            }}
          >
            <Eye className="h-3 w-3" />
          </Button>
          {!isPast && reservation.status !== 'cancelled' && (
            <>
              <Button
                size="sm"
                variant="outline"
                onClick={() => {
                  setSelectedReservation(reservation);
                  setIsEditDialogOpen(true);
                }}
              >
                <Edit3 className="h-3 w-3" />
              </Button>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button size="sm" variant="outline" className="text-destructive hover:text-destructive">
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
                    <AlertDialogDescription>
                      Are you sure you want to cancel this reservation? This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() => handleCancelReservation(reservation.id)}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Cancel Reservation
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          )}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-muted-foreground">
        <div className="flex items-center space-x-2">
          <Users className="h-4 w-4" />
          <span>{reservation.guests} guests</span>
        </div>
        <div className="flex items-center space-x-2">
          <Calendar className="h-4 w-4" />
          <span>Booked {new Date(reservation.created_at).toLocaleDateString()}</span>
        </div>
      </div>
      
      {reservation.special_requests && (
        <div className="mt-3 p-2 bg-muted rounded-md">
          <p className="text-sm text-muted-foreground">
            <strong>Special requests:</strong> {reservation.special_requests}
          </p>
        </div>
      )}

      {/* Display food orders if available */}
      {reservation.reservation_orders && reservation.reservation_orders.length > 0 && (
        <div className="mt-3 p-3 bg-accent/50 rounded-md">
          <div className="flex items-center space-x-2 mb-2">
            <ShoppingBag className="h-4 w-4 text-primary" />
            <p className="text-sm font-medium">Pre-ordered Food</p>
          </div>
          {reservation.reservation_orders.map((order) => (
            <div key={order.id} className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-muted-foreground">
                  {order.order_items.length} item{order.order_items.length !== 1 ? 's' : ''}
                </span>
                <span className="font-medium">{formatKsh(order.total_amount)}</span>
              </div>
              <div className="space-y-1">
                {order.order_items.slice(0, 3).map((item, idx) => (
                  <div key={idx} className="flex justify-between text-xs">
                    <span>{item.name} x{item.quantity}</span>
                    <span>{formatKsh(item.price * item.quantity)}</span>
                  </div>
                ))}
                {order.order_items.length > 3 && (
                  <p className="text-xs text-muted-foreground">
                    +{order.order_items.length - 3} more item{order.order_items.length - 3 !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  if (reservations.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Your Reservations</CardTitle>
          <CardDescription>View and manage your restaurant reservations</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <Calendar className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">No reservations yet</p>
            <Button className="mt-4" onClick={() => window.location.href = '/#reservations'}>
              Make a Reservation
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-3 md:space-y-0">
          <div>
            <CardTitle>Your Reservations</CardTitle>
            <CardDescription>View and manage your restaurant reservations</CardDescription>
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant={viewMode === 'list' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('list')}
            >
              List View
            </Button>
            <Button
              variant={viewMode === 'calendar' ? 'default' : 'outline'}
              size="sm"
              onClick={() => setViewMode('calendar')}
            >
              <CalendarDays className="h-4 w-4 mr-2" />
              Calendar
            </Button>
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2 mt-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search reservations..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-full md:w-48">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reservations</SelectItem>
              <SelectItem value="confirmed">Confirmed</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      
      <CardContent>
        {viewMode === 'list' ? (
          <div className="space-y-6">
            {upcomingReservations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Calendar className="h-4 w-4 mr-2" />
                  Upcoming Reservations ({upcomingReservations.length})
                </h3>
                <div className="space-y-3">
                  {upcomingReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} isPast={false} />
                  ))}
                </div>
              </div>
            )}
            
            {pastReservations.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center">
                  <Clock className="h-4 w-4 mr-2" />
                  Past Reservations ({pastReservations.length})
                </h3>
                <div className="space-y-3">
                  {pastReservations.map((reservation) => (
                    <ReservationCard key={reservation.id} reservation={reservation} isPast={true} />
                  ))}
                </div>
              </div>
            )}
            
            {filteredReservations.length === 0 && (
              <div className="text-center py-8">
                <Search className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
                <p className="text-muted-foreground">No reservations match your search criteria</p>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center py-8">
            <CalendarDays className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-muted-foreground">Calendar view coming soon!</p>
          </div>
        )}
      </CardContent>

      {/* View Reservation Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>Complete information about your reservation</DialogDescription>
          </DialogHeader>
          {selectedReservation && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium">Date & Time</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.date} at {selectedReservation.time}</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Guests</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.guests} people</p>
                </div>
                <div>
                  <p className="text-sm font-medium">Status</p>
                  <Badge variant={getStatusColor(selectedReservation.status)}>
                    {selectedReservation.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm font-medium">Contact</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.guest_phone}</p>
                </div>
              </div>
              {selectedReservation.special_requests && (
                <div>
                  <p className="text-sm font-medium">Special Requests</p>
                  <p className="text-sm text-muted-foreground">{selectedReservation.special_requests}</p>
                </div>
              )}
              
              {/* Display detailed food order in dialog */}
              {selectedReservation.reservation_orders && selectedReservation.reservation_orders.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">Food Order</p>
                  {selectedReservation.reservation_orders.map((order) => (
                    <div key={order.id} className="space-y-2 p-3 bg-accent/20 rounded-md">
                      <div className="flex justify-between items-center">
                        <span className="text-xs text-muted-foreground">Order Total</span>
                        <span className="font-medium">{formatKsh(order.total_amount)}</span>
                      </div>
                      <div className="space-y-1">
                        {order.order_items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-sm">
                            <div>
                              <p className="font-medium">{item.name}</p>
                              {item.special_requests && (
                                <p className="text-xs text-muted-foreground italic">
                                  Note: {item.special_requests}
                                </p>
                              )}
                            </div>
                            <div className="text-right">
                              <p>x{item.quantity}</p>
                              <p className="text-xs text-muted-foreground">
                                {formatKsh(item.price * item.quantity)}
                              </p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </Card>
  );
};