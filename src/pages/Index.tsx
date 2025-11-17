import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Send, Shield, User, Sparkles } from "lucide-react";
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
            onClick={() => navigate("/order")}
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
              <Button onClick={() => navigate("/admin")} size="lg" className="rounded-full shadow-lg">
                الدخول للوحة التحكم
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default Index;
