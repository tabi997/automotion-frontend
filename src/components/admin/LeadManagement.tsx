import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Search, Eye, CheckCircle, Clock, Filter, Trash2, AlertTriangle, Users, TrendingUp, MessageSquare } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { deleteOldLeadsFromAllTables, getLeadCleanupStats } from "@/lib/actions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

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

  const getStatusVariant = (status: string) => {
    if (status === 'processed') return 'default';
    if (status === 'new') return 'outline';
    if (status === 'archived') return 'secondary';
    return 'secondary';
  };

  const getStatusText = (status: string) => {
    if (status === 'processed') return 'Procesat';
    if (status === 'new') return 'Nou';
    if (status === 'archived') return 'Arhivat';
    return 'În așteptare';
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Gestionare Lead-uri</h2>
          <p className="text-sm sm:text-base text-gray-600">Administrează cererile de vânzare, finanțare și mesajele de contact</p>
        </div>
        
        <Button 
          variant="outline" 
          onClick={() => setIsCleanupDialogOpen(true)}
          className="w-full sm:w-auto"
        >
          <Trash2 className="h-4 w-4 mr-2" />
          <span className="hidden sm:inline">Curăță Lead-uri</span>
          <span className="sm:hidden">Curăță</span>
        </Button>
      </div>

      {/* Search and Filter */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Caută după nume, email sau telefon..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <Select value={filterStatus} onValueChange={setFilterStatus}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toate lead-urile</SelectItem>
            <SelectItem value="new">Noi</SelectItem>
            <SelectItem value="processed">Procesate</SelectItem>
            <SelectItem value="archived">Arhivate</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sell" className="w-full">
        <TabsList className="grid w-full grid-cols-1 sm:grid-cols-3 h-auto sm:h-10">
          <TabsTrigger value="sell" className="flex items-center gap-2 py-2 sm:py-0 text-xs sm:text-sm">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Lead-uri Vânzare</span>
            <span className="sm:hidden">Vânzare</span>
          </TabsTrigger>
          <TabsTrigger value="finance" className="flex items-center gap-2 py-2 sm:py-0 text-xs sm:text-sm">
            <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Lead-uri Finanțare</span>
            <span className="sm:hidden">Finanțare</span>
          </TabsTrigger>
          <TabsTrigger value="contact" className="flex items-center gap-2 py-2 sm:py-0 text-xs sm:text-sm">
            <MessageSquare className="h-3 w-3 sm:h-4 sm:w-4" />
            <span className="hidden sm:inline">Mesaje Contact</span>
            <span className="sm:hidden">Contact</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="sell" className="mt-4 sm:mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-32 sm:min-w-40">Client</TableHead>
                    <TableHead className="hidden sm:table-cell">Vehicul</TableHead>
                    <TableHead className="hidden lg:table-cell">Preț</TableHead>
                    <TableHead className="hidden lg:table-cell">Locație</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead className="min-w-20 sm:min-w-24">Status</TableHead>
                    <TableHead className="w-20 sm:w-24">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {sellLeadsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          <span className="ml-2">Se încarcă...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredSellLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <Users className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">Nu s-au găsit lead-uri de vânzare</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredSellLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm sm:text-base">{lead.nume}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{lead.email}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{lead.telefon}</span>
                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                              {lead.marca} {lead.model} • €{lead.pret.toLocaleString()}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">{lead.marca} {lead.model}</span>
                            <span className="text-sm text-gray-500">{lead.an} • {lead.km.toLocaleString()} km</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell font-semibold">€{lead.pret.toLocaleString()}</TableCell>
                        <TableCell className="hidden lg:table-cell">{lead.judet}, {lead.oras}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {new Date(lead.created_at).toLocaleDateString('ro-RO')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(lead.status)}>
                            {getStatusText(lead.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLead(lead, 'sell')}
                              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="finance" className="mt-4 sm:mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-32 sm:min-w-40">Client</TableHead>
                    <TableHead className="hidden sm:table-cell">Finanțare</TableHead>
                    <TableHead className="hidden lg:table-cell">Venit</TableHead>
                    <TableHead className="hidden lg:table-cell">Istoric</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead className="min-w-20 sm:min-w-24">Status</TableHead>
                    <TableHead className="w-20 sm:w-24">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {financeLeadsLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          <span className="ml-2">Se încarcă...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredFinanceLeads.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <TrendingUp className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">Nu s-au găsit lead-uri de finanțare</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredFinanceLeads.map((lead) => (
                      <TableRow key={lead.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm sm:text-base">{lead.nume}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{lead.email}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{lead.telefon}</span>
                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                              €{lead.pret.toLocaleString()} • {lead.avans}% avans
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">
                          <div className="flex flex-col">
                            <span className="font-medium">€{lead.pret.toLocaleString()}</span>
                            <span className="text-sm text-gray-500">{lead.avans}% avans • {lead.perioada} luni</span>
                          </div>
                        </TableCell>
                        <TableCell className="hidden lg:table-cell">€{lead.venit_lunar.toLocaleString()}/lună</TableCell>
                        <TableCell className="hidden lg:table-cell">{lead.istoric_creditare}</TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {new Date(lead.created_at).toLocaleDateString('ro-RO')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(lead.status)}>
                            {getStatusText(lead.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLead(lead, 'finance')}
                              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="contact" className="mt-4 sm:mt-6">
          <div className="bg-white rounded-lg shadow overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-32 sm:min-w-40">Client</TableHead>
                    <TableHead className="hidden sm:table-cell">Subiect</TableHead>
                    <TableHead className="hidden lg:table-cell">Mesaj</TableHead>
                    <TableHead className="hidden sm:table-cell">Data</TableHead>
                    <TableHead className="min-w-20 sm:min-w-24">Status</TableHead>
                    <TableHead className="w-20 sm:w-24">Acțiuni</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contactMessagesLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex items-center justify-center">
                          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
                          <span className="ml-2">Se încarcă...</span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : filteredContactMessages.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8">
                        <div className="flex flex-col items-center">
                          <MessageSquare className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-gray-500">Nu s-au găsit mesaje de contact</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredContactMessages.map((message) => (
                      <TableRow key={message.id}>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm sm:text-base">{message.nume}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{message.email}</span>
                            <span className="text-xs sm:text-sm text-gray-500">{message.telefon}</span>
                            <div className="sm:hidden text-xs text-gray-500 mt-1">
                              {message.subiect}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell">{message.subiect}</TableCell>
                        <TableCell className="hidden lg:table-cell">
                          <div className="max-w-xs truncate">{message.mesaj}</div>
                        </TableCell>
                        <TableCell className="hidden sm:table-cell text-sm">
                          {new Date(message.created_at).toLocaleDateString('ro-RO')}
                        </TableCell>
                        <TableCell>
                          <Badge variant={getStatusVariant(message.status)}>
                            {getStatusText(message.status)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleViewLead(message, 'contact')}
                              className="h-8 w-8 p-0 sm:h-9 sm:w-9"
                            >
                              <Eye className="h-3 w-3 sm:h-4 sm:w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
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
    </div>
  );
};

export default LeadManagement;
