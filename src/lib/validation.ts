import { z } from "zod";

// Romanian phone number validation
const phoneRegex = /^(\+40|0040|0)[0-9]{9}$/;

// Common validations
const phoneValidation = z.string()
  .regex(phoneRegex, "Numărul de telefon trebuie să fie în format valid românesc");

const emailValidation = z.string()
  .email("Adresa de email nu este validă");

const currentYear = new Date().getFullYear();

// Sell Car Form Schema
export const SellCarSchema = z.object({
  // Car details
  marca: z.string().min(1, "Marca este obligatorie"),
  model: z.string().min(1, "Modelul este obligatoriu"),
  an: z.number()
    .min(1995, "Anul trebuie să fie minim 1995")
    .max(currentYear, `Anul trebuie să fie maxim ${currentYear}`),
  km: z.number()
    .min(1, "Kilometrajul trebuie să fie mai mare ca 0")
    .max(500000, "Kilometrajul pare prea mare"),
  combustibil: z.string().min(1, "Combustibilul este obligatoriu"),
  transmisie: z.string().min(1, "Transmisia este obligatorie"),
  caroserie: z.string().min(1, "Caroseria este obligatorie"),
  culoare: z.string().optional(),
  vin: z.string().optional(),
  pret: z.number().optional(),
  negociabil: z.boolean().default(false),
  
  // Location
  judet: z.string().min(1, "Județul este obligatoriu"),
  oras: z.string().min(1, "Orașul este obligatoriu"),
  
  // Images
  images: z.array(z.string())
    .min(3, "Sunt necesare minimum 3 imagini"),
  
  // Contact
  nume: z.string().min(2, "Numele trebuie să aibă minimum 2 caractere"),
  telefon: phoneValidation,
  email: emailValidation,
  preferinta_contact: z.enum(["telefon", "email"]).default("telefon"),
  interval_orar: z.string().optional(),
  
  // GDPR
  gdpr: z.boolean().refine(val => val === true, {
    message: "Trebuie să accepți termenii și condițiile"
  })
});

// Finance Form Schema
export const FinanceSchema = z.object({
  // Finance details
  pret: z.number()
    .min(1000, "Prețul trebuie să fie minim 1.000 lei")
    .max(500000, "Prețul trebuie să fie maxim 500.000 lei"),
  avans: z.number()
    .min(0, "Avansul nu poate fi negativ"),
  perioada: z.number()
    .min(12, "Perioada minimă este 12 luni")
    .max(84, "Perioada maximă este 84 luni"),
  dobanda: z.number()
    .min(1, "Dobânda trebuie să fie minim 1%")
    .max(25, "Dobânda trebuie să fie maxim 25%"),
  
  // Contact details
  nume: z.string().min(2, "Numele trebuie să aibă minimum 2 caractere"),
  email: emailValidation,
  telefon: phoneValidation,
  venit_lunar: z.number()
    .min(1000, "Venitul lunar trebuie să fie minim 1.000 lei")
    .optional(),
  tip_contract: z.enum(["permanent", "determinate", "freelancer", "pensionar", "other"])
    .optional(),
  istoric_creditare: z.enum(["foarte_bun", "bun", "mediu", "slab", "primul_credit"])
    .optional(),
  
  // Optional fields
  link_stoc: z.string().url("Link-ul trebuie să fie valid").optional().or(z.literal("")),
  mesaj: z.string().optional()
}).refine(data => data.avans < data.pret, {
  message: "Avansul trebuie să fie mai mic decât prețul vehiculului",
  path: ["avans"]
});

// Contact Form Schema
export const ContactSchema = z.object({
  nume: z.string().min(2, "Numele trebuie să aibă minimum 2 caractere"),
  email: emailValidation,
  telefon: phoneValidation.optional(),
  subiect: z.string()
    .min(5, "Subiectul trebuie să aibă minimum 5 caractere")
    .max(100, "Subiectul trebuie să aibă maxim 100 caractere"),
  mesaj: z.string()
    .min(20, "Mesajul trebuie să aibă minimum 20 caractere")
    .max(2000, "Mesajul trebuie să aibă maxim 2000 caractere"),
  
  // GDPR
  gdpr: z.boolean().refine(val => val === true, {
    message: "Trebuie să accepți termenii și condițiile"
  })
});

// Inferred types
export type SellCarInput = z.infer<typeof SellCarSchema>;
export type FinanceInput = z.infer<typeof FinanceSchema>;
export type ContactInput = z.infer<typeof ContactSchema>;

// Options for dropdowns
export const carOptions = {
  combustibil: [
    { value: "benzina", label: "Benzină" },
    { value: "motorina", label: "Motorină" },
    { value: "hibrid", label: "Hibrid" },
    { value: "electric", label: "Electric" },
    { value: "gpl", label: "GPL" }
  ],
  transmisie: [
    { value: "manuala", label: "Manuală" },
    { value: "automata", label: "Automată" },
    { value: "cvt", label: "CVT" }
  ],
  caroserie: [
    { value: "berlina", label: "Berlină" },
    { value: "break", label: "Break" },
    { value: "suv", label: "SUV" },
    { value: "coupe", label: "Coupe" },
    { value: "cabriolet", label: "Cabriolet" },
    { value: "hatchback", label: "Hatchback" },
    { value: "monovolum", label: "Monovolum" }
  ],
  preferinta_contact: [
    { value: "telefon", label: "Telefon" },
    { value: "email", label: "Email" }
  ],
  tip_contract: [
    { value: "permanent", label: "Contract permanent" },
    { value: "determinate", label: "Contract pe durată determinată" },
    { value: "freelancer", label: "Freelancer/PFA" },
    { value: "pensionar", label: "Pensionar" },
    { value: "other", label: "Altele" }
  ],
  istoric_creditare: [
    { value: "foarte_bun", label: "Foarte bun (fără restanțe)" },
    { value: "bun", label: "Bun (restanțe minore)" },
    { value: "mediu", label: "Mediu (câteva probleme)" },
    { value: "slab", label: "Slab (probleme majore)" },
    { value: "primul_credit", label: "Primul meu credit" }
  ]
};

// Romanian counties
export const judete = [
  "Alba", "Arad", "Argeș", "Bacău", "Bihor", "Bistrița-Năsăud", "Botoșani", "Brăila",
  "Brașov", "Buzău", "Caraș-Severin", "Călărași", "Cluj", "Constanța", "Covasna",
  "Dâmbovița", "Dolj", "Galați", "Giurgiu", "Gorj", "Harghita", "Hunedoara", "Ialomița",
  "Iași", "Ilfov", "Maramureș", "Mehedinți", "Mureș", "Neamț", "Olt", "Prahova",
  "Sălaj", "Satu Mare", "Sibiu", "Suceava", "Teleorman", "Timiș", "Tulcea", "Vâlcea",
  "Vaslui", "Vrancea", "București"
].sort();