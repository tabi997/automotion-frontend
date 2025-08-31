import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, Clock, Filter, Trash2, AlertTriangle } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { deleteOldLeadsFromAllTables, getLeadCleanupStats } from "@/lib/actions";

interface LeadSell {
  id: string;
  marca: string;
  model: string;
  an: number;
  km: number;
  combustibil: string;
  transmisie: string;
  caroserie: string;
  culoare: string;
  vin: string;
  pret: number;
  negociabil: boolean;
  judet: string;
  oras: string;
  nume: string;
  telefon: string;
  email: string;
  preferinta_contact: string;
  interval_orar: string;
  gdpr: boolean;
  status: string;
  created_at: string;
}

interface LeadFinance {
  id: string;
  pret: number;
  avans: number;
  perioada: number;
  dobanda: number;
  nume: string;
  email: string;
  telefon: string;
  venit_lunar: number;
  tip_contract: string;
  istoric_creditare: string;
  link_stoc: string;
  mesaj: string;
  status: string;
  created_at: string;
}

interface ContactMessage {
  id: string;
  nume: string;
  email: string;
  telefon: string;
  subiect: string;
  mesaj: string;
  gdpr: boolean;
  status: string;
  created_at: string;
}

interface SelectedLead {
  id: string;
  type: 'sell' | 'finance' | 'contact';
  nume: string;
  email: string;
  telefon: string;
  status: string;
  created_at: string;
  [key: string]: any;
}

const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState<SelectedLead | null>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isCleanupDialogOpen, setIsCleanupDialogOpen] = useState(false);
  const [cleanupOptions, setCleanupOptions] = useState({
    daysOld: 90,
    onlyProcessed: true
  });
  const queryClient = useQueryClient();

  // Fetch cleanup stats
  const { data: cleanupStats, refetch: refetchCleanupStats } = useQuery({
    queryKey: ["admin-cleanup-stats"],
    queryFn: async () => {
      const result = await getLeadCleanupStats();
      if (!result.success) throw new Error(result.error);
      return result.data;
    }
  });

  // Fetch sell leads
  const { data: sellLeads, isLoading: sellLeadsLoading } = useQuery({
    queryKey: ["admin-sell-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_sell')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch finance leads
  const { data: financeLeads, isLoading: financeLeadsLoading } = useQuery({
    queryKey: ["admin-finance-leads"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('lead_finance')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch contact messages
  const { data: contactMessages, isLoading: contactMessagesLoading } = useQuery({
    queryKey: ["admin-contact-messages"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('contact_messages')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
    }
  });

  // Mark lead as processed mutation
  const markProcessedMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase
        .from(table as any)
        .update({ status: 'processed' })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { table }) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${table}`] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({
        title: "Succes",
        description: "Lead-ul a fost marcat ca procesat!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la marcarea lead-ului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Delete lead mutation
  const deleteLeadMutation = useMutation({
    mutationFn: async ({ table, id }: { table: string; id: string }) => {
      const { error } = await supabase
        .from(table as any)
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: (_, { table }) => {
      queryClient.invalidateQueries({ queryKey: [`admin-${table}`] });
      queryClient.invalidateQueries({ queryKey: ["admin-stats"] });
      toast({
        title: "Succes",
        description: "Lead-ul a fost șters cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la ștergerea lead-ului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  const handleMarkProcessed = (table: string, id: string) => {
    markProcessedMutation.mutate({ table, id });
  };

  const handleDeleteLead = (table: string, id: string, leadName: string) => {
    if (confirm(`Ești sigur că vrei să ștergi lead-ul pentru ${leadName}? Această acțiune nu poate fi anulată.`)) {
      deleteLeadMutation.mutate({ table, id });
    }
  };

  const handleViewLead = (lead: any, type: 'sell' | 'finance' | 'contact') => {
    setSelectedLead({ ...lead, type });
    setIsViewDialogOpen(true);
  };

  const filteredSellLeads = sellLeads?.filter(lead => {
    const matchesSearch = lead.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.nume.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "processed" ? lead.status === 'processed' : lead.status !== 'processed');
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredFinanceLeads = financeLeads?.filter(lead => {
    const matchesSearch = lead.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "processed" ? lead.status === 'processed' : lead.status !== 'processed');
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredContactMessages = contactMessages?.filter(message => {
    const matchesSearch = message.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subiect.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "processed" ? message.status === 'processed' : message.status !== 'processed');
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusBadge = (status: string) => (
    <Badge variant={status === 'processed' ? "default" : "secondary"}>
      {status === 'processed' ? (
        <>
          <CheckCircle className="h-3 w-3 mr-1" />
          Procesat
        </>
      ) : (
        <>
          <Clock className="h-3 w-3 mr-1" />
          În așteptare
        </>
      )}
    </Badge>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestionare Lead-uri</h2>
        <p className="text-gray-600">Administrează lead-urile și mesajele de contact</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Caută după nume, email sau detalii..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">Toate</option>
              <option value="pending">În așteptare</option>
              <option value="processed">Procesate</option>
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Cleanup Section */}
      <Card data-testid="cleanup-section">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trash2 className="h-5 w-5 text-red-600" />
            Curățare Lead-uri Vechi
          </CardTitle>
          <CardDescription>
            Șterge lead-urile vechi pentru a menține baza de date curată
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {(cleanupStats as any)?.sellLeads?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Lead-uri Vânzare</div>
              <div className="text-xs text-gray-500">
                {(cleanupStats as any)?.sellLeads?.old90Days || 0} mai vechi de 90 zile
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {(cleanupStats as any)?.financeLeads?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Lead-uri Finanțare</div>
              <div className="text-xs text-gray-500">
                {(cleanupStats as any)?.financeLeads?.old90Days || 0} mai vechi de 90 zile
              </div>
            </div>
            <div className="text-center p-4 bg-gray-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {(cleanupStats as any)?.contactMessages?.total || 0}
              </div>
              <div className="text-sm text-gray-600">Mesaje Contact</div>
              <div className="text-xs text-gray-500">
                {(cleanupStats as any)?.contactMessages?.old90Days || 0} mai vechi de 90 zile
              </div>
            </div>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4">
            <Button
              variant="outline"
              onClick={() => refetchCleanupStats()}
              className="flex items-center gap-2"
            >
              <Filter className="h-4 w-4" />
              Actualizează Statistici
            </Button>
            
            <Dialog open={isCleanupDialogOpen} onOpenChange={setIsCleanupDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="destructive" className="flex items-center gap-2">
                  <Trash2 className="h-4 w-4" />
                  Șterge Lead-uri Vechi
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <AlertTriangle className="h-5 w-5 text-red-600" />
                    Confirmare Ștergere
                  </DialogTitle>
                  <DialogDescription>
                    Această acțiune va șterge definitiv lead-urile vechi. Nu poate fi anulată.
                  </DialogDescription>
                </DialogHeader>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Vârsta minimă (zile)
                    </label>
                    <select
                      value={cleanupOptions.daysOld}
                      onChange={(e) => setCleanupOptions(prev => ({ ...prev, daysOld: Number(e.target.value) }))}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    >
                      <option value={30}>30 zile</option>
                      <option value={60}>60 zile</option>
                      <option value={90}>90 zile</option>
                      <option value={180}>180 zile</option>
                      <option value={365}>1 an</option>
                    </select>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="onlyProcessed"
                      checked={cleanupOptions.onlyProcessed}
                      onChange={(e) => setCleanupOptions(prev => ({ ...prev, onlyProcessed: e.target.checked }))}
                      className="rounded"
                    />
                    <label htmlFor="onlyProcessed" className="text-sm">
                      Șterge doar lead-urile procesate
                    </label>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <AlertTriangle className="h-4 w-4" />
                      <span className="font-medium">Atenție!</span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Această acțiune va șterge toate lead-urile mai vechi de {cleanupOptions.daysOld} zile
                      {cleanupOptions.onlyProcessed ? ' care sunt marcate ca procesate' : ''}.
                    </p>
                  </div>
                </div>
                
                <div className="flex justify-end gap-3 pt-4">
                  <Button
                    variant="outline"
                    onClick={() => setIsCleanupDialogOpen(false)}
                  >
                    Anulează
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={async () => {
                      try {
                        const result = await deleteOldLeadsFromAllTables(cleanupOptions);
                        if (result.success) {
                          toast({
                            title: "Succes",
                            description: result.message || `${(result.data as any)?.totalDeleted || 0} lead-uri au fost șterse.`,
                          });
                          // Refresh data
                          queryClient.invalidateQueries({ queryKey: ["admin-sell-leads"] });
                          queryClient.invalidateQueries({ queryKey: ["admin-finance-leads"] });
                          queryClient.invalidateQueries({ queryKey: ["admin-contact-messages"] });
                          queryClient.invalidateQueries({ queryKey: ["admin-cleanup-stats"] });
                          refetchCleanupStats();
                        } else {
                          toast({
                            title: "Eroare",
                            description: result.error || "Eroare la ștergerea lead-urilor.",
                            variant: "destructive",
                          });
                        }
                      } catch (error) {
                        toast({
                          title: "Eroare",
                          description: "Eroare neașteptată la ștergerea lead-urilor.",
                          variant: "destructive",
                        });
                      }
                      setIsCleanupDialogOpen(false);
                    }}
                  >
                    Șterge Lead-uri
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </CardContent>
      </Card>

      {/* Leads Tabs */}
      <Tabs defaultValue="sell" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sell">
            Lead-uri Vânzare ({filteredSellLeads.length})
          </TabsTrigger>
          <TabsTrigger value="finance">
            Lead-uri Finanțare ({filteredFinanceLeads.length})
          </TabsTrigger>
          <TabsTrigger value="contact">
            Mesaje Contact ({filteredContactMessages.length})
          </TabsTrigger>
        </TabsList>

        {/* Sell Leads Tab */}
        <TabsContent value="sell" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead-uri Vânzare Vehicule</CardTitle>
              <CardDescription>
                Cereri de vânzare de vehicule de la utilizatori
              </CardDescription>
            </CardHeader>
            <CardContent>
              {sellLeadsLoading ? (
                <div className="text-center py-8">Se încarcă...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilizator</TableHead>
                        <TableHead>Vehicul</TableHead>
                        <TableHead>Preț</TableHead>
                        <TableHead>Locație</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSellLeads.map((lead) => (
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
                              <div className="font-medium">{lead.marca} {lead.model}</div>
                              <div className="text-sm text-gray-500">
                                {lead.an} • {lead.km.toLocaleString()} km
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">€{lead.pret.toLocaleString()}</div>
                            {lead.negociabil && (
                              <Badge variant="outline" className="text-xs">Negociabil</Badge>
                            )}
                          </TableCell>
                          <TableCell>
                            <div>{lead.oras}, {lead.judet}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString('ro-RO')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(lead.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewLead(lead, 'sell')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {lead.status !== 'processed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkProcessed('lead_sell', lead.id)}
                                  disabled={markProcessedMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLead('lead_sell', lead.id, lead.nume)}
                                disabled={deleteLeadMutation.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Finance Leads Tab */}
        <TabsContent value="finance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Lead-uri Finanțare</CardTitle>
              <CardDescription>
                Cereri de finanțare pentru vehicule
              </CardDescription>
            </CardHeader>
            <CardContent>
              {financeLeadsLoading ? (
                <div className="text-center py-8">Se încarcă...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilizator</TableHead>
                        <TableHead>Detalii Finanțare</TableHead>
                        <TableHead>Venit Lunar</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredFinanceLeads.map((lead) => (
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
                              <div className="font-medium">€{lead.pret.toLocaleString()}</div>
                              <div className="text-sm text-gray-500">
                                Avans: €{lead.avans.toLocaleString()} • {lead.perioada} luni
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">€{lead.venit_lunar.toLocaleString()}</div>
                          </TableCell>
                          <TableCell>
                            {new Date(lead.created_at).toLocaleDateString('ro-RO')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(lead.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewLead(lead, 'finance')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {lead.status !== 'processed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkProcessed('lead_finance', lead.id)}
                                  disabled={markProcessedMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLead('lead_finance', lead.id, lead.nume)}
                                disabled={deleteLeadMutation.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Contact Messages Tab */}
        <TabsContent value="contact" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Mesaje de Contact</CardTitle>
              <CardDescription>
                Mesaje primite prin formularul de contact
              </CardDescription>
            </CardHeader>
            <CardContent>
              {contactMessagesLoading ? (
                <div className="text-center py-8">Se încarcă...</div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Utilizator</TableHead>
                        <TableHead>Subiect</TableHead>
                        <TableHead>Data</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Acțiuni</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredContactMessages.map((message) => (
                        <TableRow key={message.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{message.nume}</div>
                              <div className="text-sm text-gray-500">{message.email}</div>
                              <div className="text-sm text-gray-500">{message.telefon}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="font-medium">{message.subiect}</div>
                            <div className="text-sm text-gray-500 truncate max-w-xs">
                              {message.mesaj}
                            </div>
                          </TableCell>
                          <TableCell>
                            {new Date(message.created_at).toLocaleDateString('ro-RO')}
                          </TableCell>
                          <TableCell>
                            {getStatusBadge(message.status)}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewLead(message, 'contact')}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              
                              {message.status !== 'processed' && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkProcessed('contact_messages', message.id)}
                                  disabled={markProcessedMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}

                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleDeleteLead('contact_messages', message.id, message.nume)}
                                disabled={deleteLeadMutation.isPending}
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* View Lead Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedLead?.type === 'sell' && 'Detalii Lead Vânzare'}
              {selectedLead?.type === 'finance' && 'Detalii Lead Finanțare'}
              {selectedLead?.type === 'contact' && 'Detalii Mesaj Contact'}
            </DialogTitle>
            <DialogDescription>
              Informații complete despre lead
            </DialogDescription>
          </DialogHeader>
          
          {selectedLead && (
            <div className="space-y-4">
              {selectedLead.type === 'sell' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informații Utilizator</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nume:</strong> {selectedLead.nume}</div>
                      <div><strong>Email:</strong> {selectedLead.email}</div>
                      <div><strong>Telefon:</strong> {selectedLead.telefon}</div>
                      <div><strong>Preferință contact:</strong> {selectedLead.preferinta_contact}</div>
                      <div><strong>Interval orar:</strong> {selectedLead.interval_orar}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Informații Vehicul</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Marcă:</strong> {selectedLead.marca}</div>
                      <div><strong>Model:</strong> {selectedLead.model}</div>
                      <div><strong>An:</strong> {selectedLead.an}</div>
                      <div><strong>Kilometri:</strong> {selectedLead.km.toLocaleString()} km</div>
                      <div><strong>Combustibil:</strong> {selectedLead.combustibil}</div>
                      <div><strong>Transmisie:</strong> {selectedLead.transmisie}</div>
                      <div><strong>Caroserie:</strong> {selectedLead.caroserie}</div>
                      <div><strong>Culoare:</strong> {selectedLead.culoare}</div>
                      <div><strong>VIN:</strong> {selectedLead.vin}</div>
                      <div><strong>Preț:</strong> €{selectedLead.pret.toLocaleString()}</div>
                      <div><strong>Negociabil:</strong> {selectedLead.negociabil ? 'Da' : 'Nu'}</div>
                      <div><strong>Locație:</strong> {selectedLead.oras}, {selectedLead.judet}</div>
                    </div>
                  </div>
                </div>
              )}
              
              {selectedLead.type === 'finance' && (
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">Informații Utilizator</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Nume:</strong> {selectedLead.nume}</div>
                      <div><strong>Email:</strong> {selectedLead.email}</div>
                      <div><strong>Telefon:</strong> {selectedLead.telefon}</div>
                      <div><strong>Venit lunar:</strong> €{selectedLead.venit_lunar.toLocaleString()}</div>
                      <div><strong>Tip contract:</strong> {selectedLead.tip_contract}</div>
                      <div><strong>Istoric creditare:</strong> {selectedLead.istoric_creditare}</div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Detalii Finanțare</h4>
                    <div className="space-y-2 text-sm">
                      <div><strong>Preț vehicul:</strong> €{selectedLead.pret.toLocaleString()}</div>
                      <div><strong>Avans:</strong> €{selectedLead.avans.toLocaleString()}</div>
                      <div><strong>Perioada:</strong> {selectedLead.perioada} luni</div>
                      <div><strong>Dobândă:</strong> {selectedLead.dobanda}%</div>
                      <div><strong>Link stoc:</strong> {selectedLead.link_stoc}</div>
                    </div>
                  </div>
                  
                  {selectedLead.mesaj && (
                    <div className="col-span-2">
                      <h4 className="font-semibold mb-2">Mesaj</h4>
                      <p className="text-sm bg-gray-50 p-3 rounded">{selectedLead.mesaj}</p>
                    </div>
                  )}
                </div>
              )}
              
              {selectedLead.type === 'contact' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-semibold mb-2">Informații Utilizator</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Nume:</strong> {selectedLead.nume}</div>
                        <div><strong>Email:</strong> {selectedLead.email}</div>
                        <div><strong>Telefon:</strong> {selectedLead.telefon}</div>
                      </div>
                    </div>
                    
                    <div>
                      <h4 className="font-semibold mb-2">Detalii Mesaj</h4>
                      <div className="space-y-2 text-sm">
                        <div><strong>Subiect:</strong> {selectedLead.subiect}</div>
                        <div><strong>Data:</strong> {new Date(selectedLead.created_at).toLocaleDateString('ro-RO')}</div>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Mesaj</h4>
                    <p className="text-sm bg-gray-50 p-3 rounded">{selectedLead.mesaj}</p>
                  </div>
                </div>
              )}
              
                                <div className="pt-4 border-t">
                    <div className="flex justify-between items-center">
                      <div className="text-sm text-gray-500">
                        <strong>Status:</strong> {selectedLead.status === 'processed' ? 'Procesat' : 'În așteptare'}
                      </div>
                      
                      {selectedLead.status !== 'processed' && (
                        <Button
                          onClick={() => {
                            handleMarkProcessed(
                              selectedLead.type === 'sell' ? 'lead_sell' : 
                              selectedLead.type === 'finance' ? 'lead_finance' : 'contact_messages',
                              selectedLead.id
                            );
                            setIsViewDialogOpen(false);
                          }}
                          disabled={markProcessedMutation.isPending}
                        >
                          <CheckCircle className="h-4 w-4 mr-2" />
                          Marchează ca Procesat
                        </Button>
                      )}
                    </div>
                  </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LeadManagement;
