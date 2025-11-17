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
    } else {
      toast.success("تم إرسال طلبك بنجاح! سيتم مراجعته قريباً");
      navigate("/");
    }

    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4" dir="rtl">
      <div className="container mx-auto max-w-2xl py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="shadow-2xl">
          <CardHeader className="text-center">
            <div className="mx-auto bg-primary rounded-2xl p-4 w-fit mb-4">
              <Send className="h-12 w-12 text-primary-foreground" />
            </div>
            <CardTitle className="text-3xl font-bold">طلب رشق جديد</CardTitle>
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
                  className="text-right text-lg"
                />
              </div>

              <div className="bg-muted p-4 rounded-lg">
                <p className="text-sm text-muted-foreground text-center">
                  سيتم مراجعة طلبك من قبل الإدارة وتنفيذه في أقرب وقت ممكن
                </p>
              </div>

              <Button type="submit" className="w-full" size="lg" disabled={loading}>
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
