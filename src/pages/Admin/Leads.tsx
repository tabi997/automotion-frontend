import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { getSellLeads, getFinanceLeads, getContactLeads, setLeadStatus } from "@/lib/admin";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  CheckCircle, 
  Clock, 
  Loader2,
  Users,
  TrendingUp,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import type { Database } from "@/integrations/supabase/types";

type LeadSellRow = Database["public"]["Tables"]["lead_sell"]["Row"];
type LeadFinanceRow = Database["public"]["Tables"]["lead_finance"]["Row"];
type ContactMessageRow = Database["public"]["Tables"]["contact_messages"]["Row"];

export default function Leads() {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: sellLeads, isLoading: sellLoading, error: sellError } = useQuery({
    queryKey: ["sell-leads"],
    queryFn: getSellLeads,
  });

  const { data: financeLeads, isLoading: financeLoading, error: financeError } = useQuery({
    queryKey: ["finance-leads"],
    queryFn: getFinanceLeads,
  });

  const { data: contactLeads, isLoading: contactLoading, error: contactError } = useQuery({
    queryKey: ["contact-leads"],
    queryFn: getContactLeads,
  });

  const handleStatusChange = async (
    table: "lead_sell" | "lead_finance" | "contact_messages",
    id: string,
    currentStatus: string
  ) => {
    const newStatus = currentStatus === "new" ? "processed" : "new";
    
    try {
      await setLeadStatus(table, id, newStatus);
      toast({
        title: "Status actualizat",
        description: `Lead-ul a fost marcat ca ${newStatus === "processed" ? "procesat" : "nou"}.`,
      });
      
      // Invalidate relevant queries
      if (table === "lead_sell") {
        queryClient.invalidateQueries({ queryKey: ["sell-leads"] });
      } else if (table === "lead_finance") {
        queryClient.invalidateQueries({ queryKey: ["finance-leads"] });
      } else {
        queryClient.invalidateQueries({ queryKey: ["contact-leads"] });
      }
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] });
    } catch (error) {
      toast({
        title: "Eroare",
        description: error instanceof Error ? error.message : "A apărut o eroare neașteptată.",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    if (status === "new") {
      return <Badge variant="default">Nou</Badge>;
    } else if (status === "processed") {
      return <Badge variant="secondary">Procesat</Badge>;
    }
    return <Badge variant="outline">{status}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("ro-RO", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Gestionare Lead-uri</h1>
        <p className="text-gray-600 mt-2">
          Gestionează toate lead-urile și mesajele de contact
        </p>
      </div>

      <Tabs defaultValue="sell" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sell" className="flex items-center space-x-2">
            <Users className="h-4 w-4" />
            <span>Vânzare ({sellLeads?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center space-x-2">
            <TrendingUp className="h-4 w-4" />
            <span>Finanțare ({financeLeads?.length || 0})</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center space-x-2">
            <MessageSquare className="h-4 w-4" />
            <span>Contact ({contactLeads?.length || 0})</span>
          </TabsTrigger>
        </TabsList>

        {/* Sell Leads Tab */}
        <TabsContent value="sell" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead-uri Vânzare</CardTitle>
              <CardDescription>
                Cereri de vânzare vehicule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sellLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : sellError ? (
                <div className="text-center text-red-600 py-4">
                  Eroare la încărcarea lead-urilor: {sellError.message}
                </div>
              ) : sellLeads?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nu există lead-uri de vânzare
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Vehicul</TableHead>
                      <TableHead>Preț</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {sellLeads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.nume}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.telefon}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {lead.marca} {lead.model}
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.an} • {lead.km.toLocaleString()} km
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.caroserie} • {lead.combustibil} • {lead.transmisie}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          {lead.pret ? `${lead.pret.toLocaleString()} €` : "Necunoscut"}
                        </TableCell>
                        <TableCell>{formatDate(lead.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("lead_sell", lead.id, lead.status)}
                          >
                            {lead.status === "new" ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marchează procesat
                              </>
                            ) : (
                              <>
                                <Clock className="mr-2 h-4 w-4" />
                                Marchează nou
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Leads Tab */}
        <TabsContent value="finance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Lead-uri Finanțare</CardTitle>
              <CardDescription>
                Cereri de finanțare vehicule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {financeLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : financeError ? (
                <div className="text-center text-red-600 py-4">
                  Eroare la încărcarea lead-urilor: {financeError.message}
                </div>
              ) : financeLeads?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nu există lead-uri de finanțare
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Detalii Finanțare</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {financeLeads?.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{lead.nume}</div>
                            <div className="text-sm text-gray-500">{lead.email}</div>
                            <div className="text-sm text-gray-500">{lead.telefon}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {lead.pret.toLocaleString()} €
                            </div>
                            <div className="text-sm text-gray-500">
                              Avans: {lead.avans.toLocaleString()} €
                            </div>
                            <div className="text-sm text-gray-500">
                              {lead.perioada} luni • {lead.dobanda}% dobândă
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(lead.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(lead.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("lead_finance", lead.id, lead.status)}
                          >
                            {lead.status === "new" ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marchează procesat
                              </>
                            ) : (
                              <>
                                <Clock className="mr-2 h-4 w-4" />
                                Marchează nou
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Messages Tab */}
        <TabsContent value="contact" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Mesaje Contact</CardTitle>
              <CardDescription>
                Mesaje primite prin formularul de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contactLoading ? (
                <div className="flex items-center justify-center h-32">
                  <Loader2 className="h-6 w-6 animate-spin text-primary" />
                </div>
              ) : contactError ? (
                <div className="text-center text-red-600 py-4">
                  Eroare la încărcarea mesajelor: {contactError.message}
                </div>
              ) : contactLeads?.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Nu există mesaje de contact
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Contact</TableHead>
                      <TableHead>Subiect</TableHead>
                      <TableHead>Mesaj</TableHead>
                      <TableHead>Data</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Acțiuni</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contactLeads?.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div>
                            <div className="font-medium">{message.nume}</div>
                            <div className="text-sm text-gray-500">{message.email}</div>
                            {message.telefon && (
                              <div className="text-sm text-gray-500">{message.telefon}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="font-medium">{message.subiect}</TableCell>
                        <TableCell>
                          <div className="max-w-xs truncate" title={message.mesaj}>
                            {message.mesaj}
                          </div>
                        </TableCell>
                        <TableCell>{formatDate(message.created_at)}</TableCell>
                        <TableCell>{getStatusBadge(message.status)}</TableCell>
                        <TableCell>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleStatusChange("contact_messages", message.id, message.status)}
                          >
                            {message.status === "new" ? (
                              <>
                                <CheckCircle className="mr-2 h-4 w-4" />
                                Marchează procesat
                              </>
                            ) : (
                              <>
                                <Clock className="mr-2 h-4 w-4" />
                                Marchează nou
                              </>
                            )}
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
