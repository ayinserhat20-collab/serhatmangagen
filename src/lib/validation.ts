import { z } from "zod";

export const customerSchema = z.object({
  fullName: z.string().min(3, "Ad Soyad en az 3 karakter olmalıdır"),
  phone: z.string().regex(/^(05)[0-9]{9}$/, "Geçerli bir TR telefon numarası giriniz (05xx...)"),
  email: z.string().email("Geçerli bir e-posta adresi giriniz"),
  address: z.string().min(10, "Lütfen tam teslimat adresinizi giriniz"),
});

export const storySchema = z.object({
  longText: z.string().min(50, "Hikaye metni en az 50 karakter olmalıdır"),
  preface: z.string().optional(),
  musicPreference: z.string().optional(),
  customMusicPreference: z.string().optional(),
  specialBox: z.boolean().optional(),
  highlights: z.array(z.string()).optional(),
  periods: z.array(z.string()).optional(),
  locations: z.array(z.string()).optional(),
  isFiction: z.boolean().optional(),
  themes: z.array(z.string()).min(1, "En az bir tema seçiniz"),
});

export const characterSchema = z.object({
  name: z.string().min(2, "İsim zorunludur"),
  gender: z.string().optional(),
  age: z.string().min(1, "Yaş giriniz"),
  physical: z.string().optional(),
  personality: z.string().optional(),
  hair: z.string().optional(),
  eyes: z.string().optional(),
  photos: z.any().optional(),
});

export const orderSchema = z.object({
  packageType: z.enum(['standard', 'premium', 'children']),
  customer: customerSchema,
  story: storySchema,
  characters: z.array(characterSchema).min(1, "En az bir karakter eklemelisiniz"),
});
