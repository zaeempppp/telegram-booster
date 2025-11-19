import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Send, Shield, User, Sparkles, ArrowRight, Check, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const queryClient = new QueryClient();

// Force dark mode
if (typeof document !== 'undefined') {
  document.documentElement.classList.add('dark');
}

// Auth Page Component
const AuthPage = ({ onSuccess }: { onSuccess: () => void }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const { signIn, signUp } = useAuth();

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    await signIn(email, password);
    onSuccess();
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    await signUp(email, password, username);
    onSuccess();
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/5 p-4" dir="rtl">
      <Card className="w-full max-w-md shadow-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl">
        <CardHeader className="text-center space-y-4">
          <div className="mx-auto bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-6 w-24 h-24 flex items-center justify-center mb-2 shadow-2xl shadow-primary/20 animate-pulse">
            <Sparkles className="h-12 w-12 text-primary-foreground" />
          </div>
          <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent animate-fade-in">
            رشق تليجرام
          </CardTitle>
          <CardDescription className="text-base">منصة إدارة طلبات الرشق الاحترافية</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="w-full">
            <TabsList className="grid w-full grid-cols-2 rounded-xl p-1 bg-muted/50">
              <TabsTrigger value="signin" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground">تسجيل الدخول</TabsTrigger>
              <TabsTrigger value="signup" className="rounded-lg data-[state=active]:bg-gradient-to-r data-[state=active]:from-primary data-[state=active]:to-accent data-[state=active]:text-primary-foreground">حساب جديد</TabsTrigger>
            </TabsList>
            <TabsContent value="signin">
              <form onSubmit={handleSignIn} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">كلمة المرور</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl text-right"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-primary to-accent" size="lg">
                  <ArrowRight className="ml-2 h-5 w-5" />
                  تسجيل الدخول
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup">
              <form onSubmit={handleSignUp} className="space-y-4 mt-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">اسم المستخدم</label>
                  <Input
                    type="text"
                    placeholder="اسم المستخدم"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required
                    className="rounded-xl text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">البريد الإلكتروني</label>
                  <Input
                    type="email"
                    placeholder="example@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="rounded-xl text-right"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">كلمة المرور</label>
                  <Input
                    type="password"
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="rounded-xl text-right"
                  />
                </div>
                <Button type="submit" className="w-full rounded-full shadow-lg hover:shadow-xl hover:scale-105 transition-all bg-gradient-to-r from-primary to-accent" size="lg">
                  <Sparkles className="ml-2 h-5 w-5" />
                  إنشاء حساب
                </Button>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

// Home Page Component
const HomePage = ({ onNavigate, isAdmin }: { onNavigate: (page: 'auth' | 'home' | 'order' | 'admin') => void; isAdmin: boolean }) => {
  const { profile, signOut } = useAuth();

  return (
    <div className="min-h-screen bg-background" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-12">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Sparkles className="h-8 w-8 text-primary" />
              <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                رشق تليجرام
              </h1>
            </div>
            <p className="text-muted-foreground text-lg">مرحباً، {profile?.username}</p>
          </div>
          <Button variant="outline" onClick={signOut} className="rounded-full">
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid md:grid-cols-2 gap-6 mb-8 max-w-3xl mx-auto">
          <Card className="hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-primary bg-card/50 backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mx-auto bg-gradient-to-br from-primary/20 to-accent/20 rounded-2xl p-5 w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <User className="h-10 w-10 text-primary" />
              </div>
              <h3 className="text-2xl font-bold mb-3">المطور</h3>
              <p className="text-muted-foreground mb-4">@O_D_E_0</p>
              <Button 
                variant="outline" 
                className="w-full rounded-full"
                onClick={() => window.open('https://t.me/O_D_E_0', '_blank')}
              >
                تواصل معنا
              </Button>
            </CardContent>
          </Card>

          <Card 
            className="hover:shadow-2xl transition-all cursor-pointer border-2 hover:border-primary bg-gradient-to-br from-primary/10 to-accent/10 backdrop-blur"
            onClick={() => onNavigate('order')}
          >
            <CardContent className="p-8 text-center">
              <div className="mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl p-5 w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <Send className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-2xl font-bold mb-3">طلب رشق</h3>
              <p className="text-muted-foreground mb-4">أرسل طلبك الآن</p>
              <Button className="w-full rounded-full shadow-lg" size="lg">
                إرسال طلب جديد
              </Button>
            </CardContent>
          </Card>
        </div>

        {isAdmin && (
          <Card className="bg-gradient-to-br from-primary/20 to-accent/20 border-2 border-primary max-w-2xl mx-auto backdrop-blur">
            <CardContent className="p-8 text-center">
              <div className="mx-auto bg-primary rounded-2xl p-5 w-20 h-20 flex items-center justify-center mb-6 shadow-lg">
                <Shield className="h-10 w-10 text-primary-foreground" />
              </div>
              <h3 className="text-3xl font-bold mb-4">لوحة تحكم الإدارة</h3>
              <Button onClick={() => onNavigate('admin')} size="lg" className="rounded-full shadow-lg">
                الدخول للوحة التحكم
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

// Order Page Component
const OrderPage = ({ onNavigate }: { onNavigate: (page: 'auth' | 'home' | 'order' | 'admin') => void }) => {
  const [amount, setAmount] = useState("");
  const [serviceType, setServiceType] = useState("members");
  const [loading, setLoading] = useState(false);
  const [isChecking, setIsChecking] = useState(true);
  const [canOrder, setCanOrder] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);
  const { profile } = useAuth();

  useEffect(() => {
    checkOrderLimit();
  }, [profile]);

  const checkOrderLimit = async () => {
    if (!profile) return;
    
    setIsChecking(true);
    try {
      const { data, error } = await supabase
        .rpc('count_user_pending_orders', { p_user_id: profile.id });
      
      if (error) throw error;
      
      const count = data || 0;
      setPendingCount(count);
      setCanOrder(count < 3);
    } catch (error) {
      console.error('Error checking order limit:', error);
      toast.error('حدث خطأ في التحقق من عدد الطلبات');
    } finally {
      setIsChecking(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) <= 0) {
      toast.error("يرجى إدخال عدد صحيح");
      return;
    }

    if (!canOrder) {
      toast.error("لقد وصلت للحد الأقصى من الطلبات (3 طلبات)");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("rush_orders").insert({
      user_id: profile.id,
      amount: parseInt(amount),
      service_type: serviceType,
      status: "pending",
    });

    if (error) {
      toast.error("حدث خطأ في إرسال الطلب");
      console.error(error);
      setLoading(false);
      return;
    }

    // Send notification to Telegram
    try {
      await supabase.functions.invoke('notify-telegram', {
        body: {
          username: profile.username,
          amount: parseInt(amount),
          serviceType: serviceType,
          userId: profile.user_id,
        },
      });
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError);
    }

    toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته قريباً");
    onNavigate('home');
    setLoading(false);
    checkOrderLimit();
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      members: "رشق أعضاء",
      engagement: "رشق تفاعل",
      views: "رشق مشاهدات",
      likes: "رشق لايكات"
    };
    return labels[type] || type;
  };

  if (isChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">جاري التحقق من الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4" dir="rtl">
      <div className="container mx-auto max-w-2xl py-8">
        <Button variant="ghost" onClick={() => onNavigate('home')} className="mb-6 rounded-full hover:bg-primary/10 transition-all">
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="shadow-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl">
          <CardHeader className="text-center space-y-4">
            <div className="mx-auto bg-gradient-to-br from-primary via-primary to-accent rounded-3xl p-6 w-fit mb-2 shadow-2xl shadow-primary/20 animate-pulse">
              <Send className="h-14 w-14 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              طلب رشق جديد
            </CardTitle>
            <CardDescription>
              {canOrder 
                ? `يمكنك تقديم ${3 - pendingCount} طلب${3 - pendingCount === 1 ? '' : 'ات'} إضافي${3 - pendingCount === 1 ? '' : 'ة'}`
                : "وصلت للحد الأقصى من الطلبات (3 طلبات)"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            {!canOrder ? (
              <div className="text-center py-8">
                <div className="mx-auto bg-destructive/10 rounded-full p-6 w-20 h-20 flex items-center justify-center mb-4">
                  <X className="h-10 w-10 text-destructive" />
                </div>
                <h3 className="text-xl font-semibold mb-2">تم الوصول للحد الأقصى</h3>
                <p className="text-muted-foreground mb-4">
                  لديك حالياً {pendingCount} طلبات معلقة أو مقبولة
                </p>
                <p className="text-sm text-muted-foreground">
                  يرجى انتظار اكتمال الطلبات الحالية قبل تقديم طلب جديد
                </p>
                <Button onClick={() => onNavigate('home')} className="mt-6 rounded-full" variant="outline">
                  العودة للصفحة الرئيسية
                </Button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium">نوع الخدمة</label>
                  <Select value={serviceType} onValueChange={setServiceType}>
                    <SelectTrigger className="w-full rounded-xl text-right">
                      <SelectValue placeholder="اختر نوع الخدمة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="members">رشق أعضاء</SelectItem>
                      <SelectItem value="engagement">رشق تفاعل</SelectItem>
                      <SelectItem value="views">رشق مشاهدات</SelectItem>
                      <SelectItem value="likes">رشق لايكات</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">الكمية المطلوبة</label>
                  <Input
                    type="number"
                    placeholder="أدخل الكمية المطلوبة"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    required
                    min="1"
                    className="text-right text-lg rounded-xl"
                  />
                </div>

                <div className="bg-muted/50 p-4 rounded-xl border">
                  <p className="text-sm text-muted-foreground text-center">
                    سيتم مراجعة طلبك من قبل الإدارة وتنفيذه في أقرب وقت ممكن
                  </p>
                </div>

                <Button type="submit" className="w-full rounded-full shadow-lg" size="lg" disabled={loading}>
                  {loading ? "جاري الإرسال..." : "إرسال الطلب"}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Admin Page Component
const AdminPage = ({ onNavigate }: { onNavigate: (page: 'auth' | 'home' | 'order' | 'admin') => void }) => {
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    loadOrders();
  }, []);

  const loadOrders = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("rush_orders")
      .select(`
        *,
        profiles:user_id (username, user_id)
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error loading orders:", error);
      toast.error("حدث خطأ في تحميل الطلبات");
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  const updateOrderStatus = async (orderId: string, status: string, note: string = "") => {
    const { error } = await supabase
      .from("rush_orders")
      .update({ 
        status, 
        admin_note: note || null 
      })
      .eq("id", orderId);

    if (error) {
      toast.error("حدث خطأ في تحديث الطلب");
      console.error(error);
    } else {
      toast.success(`تم ${status === "approved" ? "قبول" : "رفض"} الطلب`);
      loadOrders();
    }
  };

  const getServiceLabel = (type: string) => {
    const labels: Record<string, string> = {
      members: "رشق أعضاء",
      engagement: "رشق تفاعل",
      views: "رشق مشاهدات",
      likes: "رشق لايكات"
    };
    return labels[type] || type;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5 p-4" dir="rtl">
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => onNavigate('home')} className="mb-6 rounded-full hover:bg-primary/10 transition-all">
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="shadow-2xl border-2 border-primary/20 bg-card/80 backdrop-blur-xl">
          <CardHeader className="bg-gradient-to-r from-primary/5 via-accent/5 to-primary/5 rounded-t-xl space-y-4">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-4 shadow-lg animate-pulse">
                <Shield className="h-8 w-8 text-primary-foreground" />
              </div>
              <div>
                <CardTitle className="text-4xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent">
                  لوحة تحكم الإدارة
                </CardTitle>
                <CardDescription className="text-base">إدارة ومراجعة جميع طلبات الرشق</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            {orders.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">لا توجد طلبات حالياً</p>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="text-right">المستخدم</TableHead>
                      <TableHead className="text-right">نوع الخدمة</TableHead>
                      <TableHead className="text-right">العدد</TableHead>
                      <TableHead className="text-right">الحالة</TableHead>
                      <TableHead className="text-right">التاريخ</TableHead>
                      <TableHead className="text-right">ملاحظة</TableHead>
                      <TableHead className="text-right">الإجراءات</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {orders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-medium">
                          {order.profiles?.username || "غير معروف"}
                        </TableCell>
                        <TableCell>{getServiceLabel(order.service_type)}</TableCell>
                        <TableCell>{order.amount.toLocaleString()}</TableCell>
                        <TableCell>
                          <Badge
                            variant={
                              order.status === "approved"
                                ? "default"
                                : order.status === "rejected"
                                ? "destructive"
                                : "secondary"
                            }
                          >
                            {order.status === "approved"
                              ? "مقبول"
                              : order.status === "rejected"
                              ? "مرفوض"
                              : "قيد المراجعة"}
                          </Badge>
                        </TableCell>
                        <TableCell>{new Date(order.created_at).toLocaleDateString("ar")}</TableCell>
                        <TableCell>
                          {order.status === "pending" ? (
                            <Input
                              placeholder="ملاحظة (اختياري)"
                              value={adminNote[order.id] || ""}
                              onChange={(e) =>
                                setAdminNote({ ...adminNote, [order.id]: e.target.value })
                              }
                              className="w-40"
                            />
                          ) : (
                            <span className="text-sm text-muted-foreground">
                              {order.admin_note || "-"}
                            </span>
                          )}
                        </TableCell>
                        <TableCell>
                          {order.status === "pending" && (
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                onClick={() =>
                                  updateOrderStatus(order.id, "approved", adminNote[order.id])
                                }
                              >
                                <Check className="h-4 w-4" />
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() =>
                                  updateOrderStatus(order.id, "rejected", adminNote[order.id])
                                }
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

// Main App Component
const AppContent = () => {
  const { user, isAdmin, loading } = useAuth();
  const [currentPage, setCurrentPage] = useState<'auth' | 'home' | 'order' | 'admin'>('auth');

  useEffect(() => {
    if (!loading) {
      if (user) {
        setCurrentPage('home');
      } else {
        setCurrentPage('auth');
      }
    }
  }, [user, loading]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user && currentPage !== 'auth') {
    return <AuthPage onSuccess={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'auth') {
    return <AuthPage onSuccess={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'home') {
    return <HomePage onNavigate={setCurrentPage} isAdmin={isAdmin} />;
  }

  if (currentPage === 'order') {
    return <OrderPage onNavigate={setCurrentPage} />;
  }

  if (currentPage === 'admin' && isAdmin) {
    return <AdminPage onNavigate={setCurrentPage} />;
  }

  return <HomePage onNavigate={setCurrentPage} isAdmin={isAdmin} />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
