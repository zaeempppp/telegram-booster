import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowRight, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Order = () => {
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const { profile } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!amount || parseInt(amount) <= 0) {
      toast.error("يرجى إدخال عدد صحيح");
      return;
    }

    setLoading(true);

    const { error } = await supabase.from("rush_orders").insert({
      user_id: profile.id,
      amount: parseInt(amount),
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
          userId: profile.user_id,
        },
      });
    } catch (telegramError) {
      console.error('Failed to send Telegram notification:', telegramError);
      // Don't block the order if Telegram fails
    }

    toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته قريباً");
    navigate("/");
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-background p-4" dir="rtl">
      <div className="container mx-auto max-w-2xl py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6 rounded-full">
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="shadow-2xl border-2 bg-card/50 backdrop-blur">
          <CardHeader className="text-center">
            <div className="mx-auto bg-gradient-to-br from-primary to-accent rounded-2xl p-5 w-fit mb-4 shadow-lg">
              <Send className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              طلب رشق جديد
            </CardTitle>
            <CardDescription>قم بإدخال عدد الرشق المطلوب وسيتم مراجعة طلبك</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-medium">عدد الرشق المطلوب</label>
                <Input
                  type="number"
                  placeholder="مثال: 1000"
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Order;
