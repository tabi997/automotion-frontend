import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, Clock, Filter } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

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
  processed: boolean;
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
  processed: boolean;
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
  processed: boolean;
  created_at: string;
}

const LeadManagement = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [selectedLead, setSelectedLead] = useState<any>(null);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const queryClient = useQueryClient();

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
        .from(table)
        .update({ processed: true })
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

  const handleMarkProcessed = (table: string, id: string) => {
    markProcessedMutation.mutate({ table, id });
  };

  const handleViewLead = (lead: any, type: string) => {
    setSelectedLead({ ...lead, type });
    setIsViewDialogOpen(true);
  };

  const filteredSellLeads = sellLeads?.filter(lead => {
    const matchesSearch = lead.marca.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.nume.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "processed" ? lead.processed : !lead.processed);
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredFinanceLeads = financeLeads?.filter(lead => {
    const matchesSearch = lead.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         lead.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "processed" ? lead.processed : !lead.processed);
    return matchesSearch && matchesFilter;
  }) || [];

  const filteredContactMessages = contactMessages?.filter(message => {
    const matchesSearch = message.nume.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subiect.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" || 
                         (filterStatus === "processed" ? message.processed : !message.processed);
    return matchesSearch && matchesFilter;
  }) || [];

  const getStatusBadge = (processed: boolean) => (
    <Badge variant={processed ? "default" : "secondary"}>
      {processed ? (
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
                            {getStatusBadge(lead.processed)}
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
                              
                              {!lead.processed && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkProcessed('lead_sell', lead.id)}
                                  disabled={markProcessedMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
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
                            {getStatusBadge(lead.processed)}
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
                              
                              {!lead.processed && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkProcessed('lead_finance', lead.id)}
                                  disabled={markProcessedMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
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
                            {getStatusBadge(message.processed)}
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
                              
                              {!message.processed && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleMarkProcessed('contact_messages', message.id)}
                                  disabled={markProcessedMutation.isPending}
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
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
                    <strong>Status:</strong> {selectedLead.processed ? 'Procesat' : 'În așteptare'}
                  </div>
                  
                  {!selectedLead.processed && (
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
