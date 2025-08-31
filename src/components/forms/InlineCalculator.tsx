import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Calculator, TrendingUp, Clock, DollarSign } from "lucide-react";
import { calculateMonthlyPayment } from "@/lib/actions";

interface CalculatorResult {
  monthlyPayment: number;
  totalInterest: number;
  totalAmount: number;
  dae: number;
}

interface InlineCalculatorProps {
  onCalculate?: (result: CalculatorResult) => void;
  defaultValues?: {
    pret?: number;
    avans?: number;
    perioada?: number;
    dobanda?: number;
  };
}

export function InlineCalculator({ onCalculate, defaultValues }: InlineCalculatorProps) {
  const [pret, setPret] = useState(defaultValues?.pret || 25000);
  const [avans, setAvans] = useState(defaultValues?.avans || 5000);
  const [perioada, setPerioda] = useState(defaultValues?.perioada || 60);
  const [dobanda, setDobanda] = useState(defaultValues?.dobanda || 8.5);

  const [result, setResult] = useState<CalculatorResult | null>(null);

  useEffect(() => {
    if (pret > avans && pret > 1000 && avans >= 0) {
      const loanAmount = pret - avans;
      const calculatedResult = calculateMonthlyPayment(loanAmount, dobanda, perioada);
      setResult(calculatedResult);
      if (onCalculate) {
        onCalculate(calculatedResult);
      }
    }
  }, [pret, avans, perioada, dobanda, onCalculate]);

  const loanAmount = pret - avans;
  const isValid = pret > avans && pret > 1000 && avans >= 0;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Calculator className="h-5 w-5 text-primary" />
          <span>Calculator Rata</span>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="pret">Prețul vehiculului</Label>
            <Input
              id="pret"
              type="number"
              value={pret}
              onChange={(e) => setPret(Number(e.target.value))}
              min={1000}
              max={500000}
              step={1000}
            />
            <p className="text-xs text-muted-foreground">
              {pret.toLocaleString('ro-RO')} lei
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="avans">Avansul</Label>
            <Input
              id="avans"
              type="number"
              value={avans}
              onChange={(e) => setAvans(Number(e.target.value))}
              min={0}
              max={pret * 0.9}
              step={1000}
            />
            <p className="text-xs text-muted-foreground">
              {avans.toLocaleString('ro-RO')} lei ({((avans / pret) * 100).toFixed(1)}%)
            </p>
          </div>
        </div>

        {/* Sliders */}
        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Perioada: {perioada} luni</Label>
            <Slider
              value={[perioada]}
              onValueChange={([value]) => setPerioda(value)}
              min={12}
              max={84}
              step={6}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>12 luni</span>
              <span>84 luni</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Dobânda anuală: {dobanda}%</Label>
            <Slider
              value={[dobanda]}
              onValueChange={([value]) => setDobanda(value)}
              min={5}
              max={20}
              step={0.1}
              className="py-4"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>5%</span>
              <span>20%</span>
            </div>
          </div>
        </div>

        {/* Results */}
        {isValid && result ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-4 border-t">
            <div className="text-center">
              <Badge variant="outline" className="w-full p-3 flex flex-col items-center space-y-1">
                <DollarSign className="h-4 w-4 text-primary" />
                <span className="text-xs text-muted-foreground">Rata lunară</span>
                <span className="font-bold text-lg">
                  {result.monthlyPayment.toLocaleString('ro-RO')} lei
                </span>
              </Badge>
            </div>

            <div className="text-center">
              <Badge variant="outline" className="w-full p-3 flex flex-col items-center space-y-1">
                <TrendingUp className="h-4 w-4 text-accent" />
                <span className="text-xs text-muted-foreground">DAE estimat</span>
                <span className="font-bold">
                  {result.dae}%
                </span>
              </Badge>
            </div>

            <div className="text-center">
              <Badge variant="outline" className="w-full p-3 flex flex-col items-center space-y-1">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Dobânzi totale</span>
                <span className="font-bold">
                  {result.totalInterest.toLocaleString('ro-RO')} lei
                </span>
              </Badge>
            </div>

            <div className="text-center">
              <Badge variant="outline" className="w-full p-3 flex flex-col items-center space-y-1">
                <Calculator className="h-4 w-4 text-success" />
                <span className="text-xs text-muted-foreground">Cost total</span>
                <span className="font-bold">
                  {result.totalAmount.toLocaleString('ro-RO')} lei
                </span>
              </Badge>
            </div>
          </div>
        ) : (
          <div className="text-center py-4 text-muted-foreground">
            <p>Introduceți valori valide pentru a calcula rata</p>
          </div>
        )}

        {/* Loan Amount Info */}
        <div className="text-center pt-2 border-t">
          <p className="text-sm text-muted-foreground">
            Suma finanțată: <span className="font-semibold">{loanAmount.toLocaleString('ro-RO')} lei</span>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}