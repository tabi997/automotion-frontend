import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Plus, Trash2, Save, Edit, X } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

interface FormOption {
  id: string;
  value: string;
  label: string;
  category: string;
  order: number;
}

interface FormText {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

interface SiteSetting {
  id: string;
  key: string;
  value: string;
  description: string;
  category: string;
}

const SettingsManagement = () => {
  const [editingOption, setEditingOption] = useState<FormOption | null>(null);
  const [editingText, setEditingText] = useState<FormText | null>(null);
  const [editingSetting, setEditingSetting] = useState<SiteSetting | null>(null);
  const [newOption, setNewOption] = useState({ value: "", label: "", category: "brands" });
  const [newText, setNewText] = useState({ key: "", value: "", description: "", category: "forms" });
  const [newSetting, setNewSetting] = useState({ key: "", value: "", description: "", category: "site" });
  const queryClient = useQueryClient();

  // Fetch form options
  const { data: formOptions, isLoading: optionsLoading } = useQuery({
    queryKey: ["admin-form-options"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_options')
        .select('*')
        .order('category')
        .order('order');

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch form texts
  const { data: formTexts, isLoading: textsLoading } = useQuery({
    queryKey: ["admin-form-texts"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('form_texts')
        .select('*')
        .order('category')
        .order('key');

      if (error) throw error;
      return data || [];
    }
  });

  // Fetch site settings
  const { data: siteSettings, isLoading: settingsLoading } = useQuery({
    queryKey: ["admin-site-settings"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .order('category')
        .order('key');

      if (error) throw error;
      return data || [];
    }
  });

  // Add form option mutation
  const addOptionMutation = useMutation({
    mutationFn: async (data: Omit<FormOption, 'id' | 'order'>) => {
      const maxOrder = Math.max(0, ...(formOptions?.filter(o => o.category === data.category).map(o => o.order) || []));
      const { error } = await supabase
        .from('form_options')
        .insert([{ ...data, order: maxOrder + 1 }]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-form-options"] });
      setNewOption({ value: "", label: "", category: "brands" });
      toast({
        title: "Succes",
        description: "Opțiunea a fost adăugată cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la adăugarea opțiunii. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Update form option mutation
  const updateOptionMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormOption> }) => {
      const { error } = await supabase
        .from('form_options')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-form-options"] });
      setEditingOption(null);
      toast({
        title: "Succes",
        description: "Opțiunea a fost actualizată cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la actualizarea opțiunii. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Delete form option mutation
  const deleteOptionMutation = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('form_options')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-form-options"] });
      toast({
        title: "Succes",
        description: "Opțiunea a fost ștearsă cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la ștergerea opțiunii. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Add form text mutation
  const addTextMutation = useMutation({
    mutationFn: async (data: Omit<FormText, 'id'>) => {
      const { error } = await supabase
        .from('form_texts')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-form-texts"] });
      setNewText({ key: "", value: "", description: "", category: "forms" });
      toast({
        title: "Succes",
        description: "Textul a fost adăugat cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la adăugarea textului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Update form text mutation
  const updateTextMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<FormText> }) => {
      const { error } = await supabase
        .from('form_texts')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-form-texts"] });
      setEditingText(null);
      toast({
        title: "Succes",
        description: "Textul a fost actualizat cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la actualizarea textului. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Add site setting mutation
  const addSettingMutation = useMutation({
    mutationFn: async (data: Omit<SiteSetting, 'id'>) => {
      const { error } = await supabase
        .from('site_settings')
        .insert([data]);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      setNewSetting({ key: "", value: "", description: "", category: "site" });
      toast({
        title: "Succes",
        description: "Setarea a fost adăugată cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la adăugarea setării. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  // Update site setting mutation
  const updateSettingMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<SiteSetting> }) => {
      const { error } = await supabase
        .from('site_settings')
        .update(data)
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-site-settings"] });
      setEditingSetting(null);
      toast({
        title: "Succes",
        description: "Setarea a fost actualizată cu succes!",
      });
    },
    onError: (error) => {
      toast({
        title: "Eroare",
        description: "Eroare la actualizarea setării. Încearcă din nou.",
        variant: "destructive",
      });
    }
  });

  const handleAddOption = () => {
    if (newOption.value && newOption.label) {
      addOptionMutation.mutate(newOption);
    }
  };

  const handleUpdateOption = () => {
    if (editingOption) {
      updateOptionMutation.mutate({ id: editingOption.id, data: editingOption });
    }
  };

  const handleDeleteOption = (id: string) => {
    deleteOptionMutation.mutate(id);
  };

  const handleAddText = () => {
    if (newText.key && newText.value) {
      addTextMutation.mutate(newText);
    }
  };

  const handleUpdateText = () => {
    if (editingText) {
      updateTextMutation.mutate({ id: editingText.id, data: editingText });
    }
  };

  const handleAddSetting = () => {
    if (newSetting.key && newSetting.value) {
      addSettingMutation.mutate(newSetting);
    }
  };

  const handleUpdateSetting = () => {
    if (editingSetting) {
      updateSettingMutation.mutate({ id: editingSetting.id, data: editingSetting });
    }
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      brands: "Mărci",
      fuelTypes: "Tipuri Combustibil",
      transmissions: "Transmisii",
      bodyTypes: "Tipuri Caroserie",
      conditions: "Stări",
      forms: "Formulare",
      site: "Site"
    };
    return labels[category] || category;
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      brands: "bg-blue-100 text-blue-800",
      fuelTypes: "bg-green-100 text-green-800",
      transmissions: "bg-purple-100 text-purple-800",
      bodyTypes: "bg-orange-100 text-orange-800",
      conditions: "bg-red-100 text-red-800",
      forms: "bg-indigo-100 text-indigo-800",
      site: "bg-gray-100 text-gray-800"
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestionare Setări</h2>
        <p className="text-gray-600">Administrează opțiunile din formulare și setările site-ului</p>
      </div>

      {/* Settings Tabs */}
      <Tabs defaultValue="options" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="options">Opțiuni Formulare</TabsTrigger>
          <TabsTrigger value="texts">Texte Formulare</TabsTrigger>
          <TabsTrigger value="settings">Setări Site</TabsTrigger>
        </TabsList>

        {/* Form Options Tab */}
        <TabsContent value="options" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Opțiuni Formulare</CardTitle>
              <CardDescription>
                Gestionează opțiunile din dropdown-urile formularelor
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add New Option */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Adaugă Opțiune Nouă</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="option-category">Categorie</Label>
                    <select
                      id="option-category"
                      value={newOption.category}
                      onChange={(e) => setNewOption({ ...newOption, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="brands">Mărci</option>
                      <option value="fuelTypes">Tipuri Combustibil</option>
                      <option value="transmissions">Transmisii</option>
                      <option value="bodyTypes">Tipuri Caroserie</option>
                      <option value="conditions">Stări</option>
                    </select>
                  </div>
                  <div>
                    <Label htmlFor="option-value">Valoare</Label>
                    <Input
                      id="option-value"
                      value={newOption.value}
                      onChange={(e) => setNewOption({ ...newOption, value: e.target.value })}
                      placeholder="bmw"
                    />
                  </div>
                  <div>
                    <Label htmlFor="option-label">Etichetă</Label>
                    <Input
                      id="option-label"
                      value={newOption.label}
                      onChange={(e) => setNewOption({ ...newOption, label: e.target.value })}
                      placeholder="BMW"
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddOption}
                  disabled={addOptionMutation.isPending || !newOption.value || !newOption.label}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addOptionMutation.isPending ? "Se adaugă..." : "Adaugă Opțiune"}
                </Button>
              </div>

              {/* Options List */}
              {optionsLoading ? (
                <div className="text-center py-8">Se încarcă...</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    formOptions?.reduce((acc, option) => {
                      if (!acc[option.category]) acc[option.category] = [];
                      acc[option.category].push(option);
                      return acc;
                    }, {} as Record<string, FormOption[]>) || {}
                  ).map(([category, options]) => (
                    <div key={category} className="border rounded-lg">
                      <div className="p-3 bg-gray-50 border-b">
                        <h4 className="font-semibold">{getCategoryLabel(category)}</h4>
                      </div>
                      <div className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                          {options.map((option) => (
                            <div key={option.id} className="flex items-center justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{option.label}</div>
                                <div className="text-sm text-gray-500">{option.value}</div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => setEditingOption(option)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleDeleteOption(option.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Form Texts Tab */}
        <TabsContent value="texts" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Texte Formulare</CardTitle>
              <CardDescription>
                Gestionează textele implicite din formulare
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add New Text */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Adaugă Text Nou</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="text-key">Cheie</Label>
                    <Input
                      id="text-key"
                      value={newText.key}
                      onChange={(e) => setNewText({ ...newText, key: e.target.value })}
                      placeholder="placeholder_brand"
                    />
                  </div>
                  <div>
                    <Label htmlFor="text-category">Categorie</Label>
                    <select
                      id="text-category"
                      value={newText.category}
                      onChange={(e) => setNewText({ ...newText, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="forms">Formulare</option>
                      <option value="validation">Validare</option>
                      <option value="messages">Mesaje</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="text-description">Descriere</Label>
                    <Input
                      id="text-description"
                      value={newText.description}
                      onChange={(e) => setNewText({ ...newText, description: e.target.value })}
                      placeholder="Descrierea textului..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="text-value">Valoare</Label>
                    <Textarea
                      id="text-value"
                      value={newText.value}
                      onChange={(e) => setNewText({ ...newText, value: e.target.value })}
                      placeholder="Valoarea textului..."
                      rows={2}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddText}
                  disabled={addTextMutation.isPending || !newText.key || !newText.value}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addTextMutation.isPending ? "Se adaugă..." : "Adaugă Text"}
                </Button>
              </div>

              {/* Texts List */}
              {textsLoading ? (
                <div className="text-center py-8">Se încarcă...</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    formTexts?.reduce((acc, text) => {
                      if (!acc[text.category]) acc[text.category] = [];
                      acc[text.category].push(text);
                      return acc;
                    }, {} as Record<string, FormText[]>) || {}
                  ).map(([category, texts]) => (
                    <div key={category} className="border rounded-lg">
                      <div className="p-3 bg-gray-50 border-b">
                        <h4 className="font-semibold">{getCategoryLabel(category)}</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          {texts.map((text) => (
                            <div key={text.id} className="flex items-start justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{text.key}</div>
                                <div className="text-sm text-gray-500 mb-2">{text.description}</div>
                                <div className="text-sm bg-gray-50 p-2 rounded">{text.value}</div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingText(text)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Site Settings Tab */}
        <TabsContent value="settings" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Setări Site</CardTitle>
              <CardDescription>
                Gestionează setările generale ale site-ului
              </CardDescription>
            </CardHeader>
            <CardContent>
              {/* Add New Setting */}
              <div className="mb-6 p-4 border rounded-lg bg-gray-50">
                <h4 className="font-semibold mb-3">Adaugă Setare Nouă</h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="setting-key">Cheie</Label>
                    <Input
                      id="setting-key"
                      value={newSetting.key}
                      onChange={(e) => setNewSetting({ ...newSetting, key: e.target.value })}
                      placeholder="site_name"
                    />
                  </div>
                  <div>
                    <Label htmlFor="setting-category">Categorie</Label>
                    <select
                      id="setting-category"
                      value={newSetting.category}
                      onChange={(e) => setNewSetting({ ...newSetting, category: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="site">Site</option>
                      <option value="contact">Contact</option>
                      <option value="social">Social Media</option>
                      <option value="seo">SEO</option>
                    </select>
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="setting-description">Descriere</Label>
                    <Input
                      id="setting-description"
                      value={newSetting.description}
                      onChange={(e) => setNewSetting({ ...newSetting, description: e.target.value })}
                      placeholder="Descrierea setării..."
                    />
                  </div>
                  <div className="col-span-2">
                    <Label htmlFor="setting-value">Valoare</Label>
                    <Textarea
                      id="setting-value"
                      value={newSetting.value}
                      onChange={(e) => setNewSetting({ ...newSetting, value: e.target.value })}
                      placeholder="Valoarea setării..."
                      rows={2}
                    />
                  </div>
                </div>
                <Button 
                  onClick={handleAddSetting}
                  disabled={addSettingMutation.isPending || !newSetting.key || !newSetting.value}
                  className="mt-3"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  {addSettingMutation.isPending ? "Se adaugă..." : "Adaugă Setare"}
                </Button>
              </div>

              {/* Settings List */}
              {settingsLoading ? (
                <div className="text-center py-8">Se încarcă...</div>
              ) : (
                <div className="space-y-4">
                  {Object.entries(
                    siteSettings?.reduce((acc, setting) => {
                      if (!acc[setting.category]) acc[setting.category] = [];
                      acc[setting.category].push(setting);
                      return acc;
                    }, {} as Record<string, SiteSetting[]>) || {}
                  ).map(([category, settings]) => (
                    <div key={category} className="border rounded-lg">
                      <div className="p-3 bg-gray-50 border-b">
                        <h4 className="font-semibold">{getCategoryLabel(category)}</h4>
                      </div>
                      <div className="p-4">
                        <div className="space-y-3">
                          {settings.map((setting) => (
                            <div key={setting.id} className="flex items-start justify-between p-3 border rounded-lg">
                              <div className="flex-1">
                                <div className="font-medium">{setting.key}</div>
                                <div className="text-sm text-gray-500 mb-2">{setting.description}</div>
                                <div className="text-sm bg-gray-50 p-2 rounded">{setting.value}</div>
                              </div>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEditingSetting(setting)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Edit Option Dialog */}
      {editingOption && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Editează Opțiune</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-option-category">Categorie</Label>
                <select
                  id="edit-option-category"
                  value={editingOption.category}
                  onChange={(e) => setEditingOption({ ...editingOption, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="brands">Mărci</option>
                  <option value="fuelTypes">Tipuri Combustibil</option>
                  <option value="transmissions">Transmisii</option>
                  <option value="bodyTypes">Tipuri Caroserie</option>
                  <option value="conditions">Stări</option>
                </select>
              </div>
              <div>
                <Label htmlFor="edit-option-value">Valoare</Label>
                <Input
                  id="edit-option-value"
                  value={editingOption.value}
                  onChange={(e) => setEditingOption({ ...editingOption, value: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-option-label">Etichetă</Label>
                <Input
                  id="edit-option-label"
                  value={editingOption.label}
                  onChange={(e) => setEditingOption({ ...editingOption, label: e.target.value })}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingOption(null)}>
                <X className="h-4 w-4 mr-2" />
                Anulează
              </Button>
              <Button onClick={handleUpdateOption}>
                <Save className="h-4 w-4 mr-2" />
                Salvează
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Text Dialog */}
      {editingText && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Editează Text</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-text-key">Cheie</Label>
                <Input
                  id="edit-text-key"
                  value={editingText.key}
                  onChange={(e) => setEditingText({ ...editingText, key: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-text-description">Descriere</Label>
                <Input
                  id="edit-text-description"
                  value={editingText.description}
                  onChange={(e) => setEditingText({ ...editingText, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-text-value">Valoare</Label>
                <Textarea
                  id="edit-text-value"
                  value={editingText.value}
                  onChange={(e) => setEditingText({ ...editingText, value: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingText(null)}>
                <X className="h-4 w-4 mr-2" />
                Anulează
              </Button>
              <Button onClick={handleUpdateText}>
                <Save className="h-4 w-4 mr-2" />
                Salvează
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Setting Dialog */}
      {editingSetting && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h3 className="text-lg font-semibold mb-4">Editează Setare</h3>
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-setting-key">Cheie</Label>
                <Input
                  id="edit-setting-key"
                  value={editingSetting.key}
                  onChange={(e) => setEditingSetting({ ...editingSetting, key: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-setting-description">Descriere</Label>
                <Input
                  id="edit-setting-description"
                  value={editingSetting.description}
                  onChange={(e) => setEditingSetting({ ...editingSetting, description: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="edit-setting-value">Valoare</Label>
                <Textarea
                  id="edit-setting-value"
                  value={editingSetting.value}
                  onChange={(e) => setEditingSetting({ ...editingSetting, value: e.target.value })}
                  rows={3}
                />
              </div>
            </div>
            <div className="flex justify-end gap-2 mt-6">
              <Button variant="outline" onClick={() => setEditingSetting(null)}>
                <X className="h-4 w-4 mr-2" />
                Anulează
              </Button>
              <Button onClick={handleUpdateSetting}>
                <Save className="h-4 w-4 mr-2" />
                Salvează
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsManagement;
