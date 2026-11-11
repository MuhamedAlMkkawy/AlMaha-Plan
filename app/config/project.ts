export interface ProjectConfig {
  planNo: string;
  name: string;
  nameEn: string;
  seller: string;
  marketer: string;
  commissionRate: number; // 2.5%
  vatRate: number;        // 15%
  rettRate: number;       // 5%
  logoUrl: string;
  quotationValidityDays: number;
  publicShowPrices: boolean;
  texts: {
    checkLand: string;
    checkBrokerage: string;
    rettPayment: string;
    attachments: string;
    validityNote: string;
    footer: string;
  };
}

export const projectConfig: ProjectConfig = {
  planNo: '4047',
  name: 'مخطط المها / مها الشرق',
  nameEn: 'Al Maha Plan',
  seller: 'شركة القادسية الاولى',
  marketer: 'شركة تارقيت العقارية',
  commissionRate: 0.025, // 2.5%
  vatRate: 0.15,         // 15%
  rettRate: 0.05,        // 5% ضريبة التصرفات العقارية
  logoUrl: '/logo-targt.png',
  quotationValidityDays: 7,
  publicShowPrices: true,
  texts: {
    checkLand: 'يتم اصدار شيك مصدق بقيمة الارض باسم شركة القادسية الاولى',
    checkBrokerage: 'يتم اصدار شيك مصدق بقيمة السعي باسم شركة تارقيت العقارية',
    rettPayment: 'يتم السداد المباشر لهيئة الضريبة العقارية من خلال رقم سداد يتم تزويدكم به قبل الافراغ للسداد',
    attachments: 'صورة من شيك الارض وشيك السعي، الهوية او السجل التجاري – صورة الوكالة للموكل بالشراء',
    validityNote: 'عرض السعر لمدة 7 ايام من تاريخ الاصدار وبعدها الحجز ملغي',
    footer: 'شركة تارقيت العقارية',
  },
};

