import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Send, Users, DollarSign, Shield } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";

const Index = () => {
  const { user, profile, isAdmin, signOut, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10" dir="rtl">
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-primary flex items-center gap-3">
              <Send className="h-10 w-10" />
              رشق تليجرام
            </h1>
            <p className="text-muted-foreground mt-2">مرحباً بك {profile?.username}</p>
          </div>
          <Button variant="outline" onClick={signOut}>
            تسجيل الخروج
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open("https://t.me/your_channel", "_blank")}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <Users className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>قناة المطور</CardTitle>
              <CardDescription>تابع آخر التحديثات والعروض</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => window.open("https://t.me/your_username", "_blank")}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-accent/10 rounded-full p-4 w-fit">
                <Send className="h-8 w-8 text-accent" />
              </div>
              <CardTitle>المطور</CardTitle>
              <CardDescription>تواصل مع المطور مباشرة</CardDescription>
            </CardHeader>
          </Card>

          <Card className="hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate("/order")}>
            <CardHeader className="text-center">
              <div className="mx-auto bg-primary/10 rounded-full p-4 w-fit">
                <DollarSign className="h-8 w-8 text-primary" />
              </div>
              <CardTitle>طلب رشق</CardTitle>
              <CardDescription>اطلب رشق جديد الآن</CardDescription>
            </CardHeader>
          </Card>
        </div>

        {isAdmin && (
          <Card className="border-2 border-primary shadow-lg">
            <CardHeader className="bg-primary/5">
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-6 w-6" />
                لوحة التحكم - الإدارة
              </CardTitle>
              <CardDescription>إدارة الطلبات والمستخدمين</CardDescription>
            </CardHeader>
            <div className="p-6">
              <Button className="w-full" size="lg" onClick={() => navigate("/admin")}>
                فتح لوحة التحكم
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
