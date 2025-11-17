import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Check, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const Admin = () => {
  const { isAdmin } = useAuth();
  const navigate = useNavigate();
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [adminNote, setAdminNote] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    if (!isAdmin) {
      navigate("/");
      return;
    }
    loadOrders();
  }, [isAdmin, navigate]);

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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/10 via-background to-accent/10 p-4" dir="rtl">
      <div className="container mx-auto py-8">
        <Button variant="ghost" onClick={() => navigate("/")} className="mb-6">
          <ArrowRight className="h-4 w-4 ml-2" />
          العودة للرئيسية
        </Button>

        <Card className="shadow-2xl">
          <CardHeader>
            <CardTitle className="text-3xl font-bold">لوحة تحكم الإدارة</CardTitle>
            <CardDescription>إدارة طلبات الرشق</CardDescription>
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
                        <TableCell className="font-medium">{order.profiles?.username}</TableCell>
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

export default Admin;
