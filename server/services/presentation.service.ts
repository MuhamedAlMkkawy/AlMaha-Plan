import pptxgen from 'pptxgenjs';
import path from 'path';
import fs from 'fs';

export async function createPresentationBuffer(): Promise<Buffer> {
  const pres = new pptxgen();

  pres.layout = 'LAYOUT_16x9'; // 10 x 5.625 inches
  pres.author = 'مخطط المها / مها الشرق';
  pres.company = 'شركة تارقيت العقارية & شركة القادسية الأولى';
  pres.title = 'منظومة بوابة مبيعات وعروض أسعار مخطط المها';

  // Palette Constants (Emerald & Sand)
  const C = {
    emerald: '126B58',       // Primary Brand
    forest: '174A40',        // Deep Forest Header & Accents
    darkEmerald: '0D5143',   // Active / Darker
    sage: '71998A',          // Secondary Accents
    softSage: 'E5EEE9',      // Soft Backgrounds
    gold: 'B89A68',          // Sand Gold
    champagne: 'D8C5A0',     // Light Champagne
    warmSand: 'F5F1E8',      // Background sections
    ivory: 'FAF9F5',         // Soft Ivory Page
    white: 'FFFFFF',         // Cards & Clean Surfaces
    darkSlate: '293B36',     // Primary Text
    mutedSlate: '718078',    // Secondary Text
    border: 'E5E9E5',        // Borders
  };

  const FONT = 'Cairo';

  // Helper for consistent slide headers
  function addSlideHeader(slide: any, titleAr: string, subtitleAr?: string, category = 'نظام مبيعات مخطط المها') {
    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 0.1,
      fill: { color: C.gold },
      line: { color: C.gold }
    });

    slide.addText(category, {
      x: 0.8, y: 0.25, w: 8.4, h: 0.3,
      fontSize: 10, bold: true, color: C.emerald, fontFace: FONT, align: 'right'
    });

    slide.addText(titleAr, {
      x: 0.8, y: 0.55, w: 8.4, h: 0.55,
      fontSize: 22, bold: true, color: C.forest, fontFace: FONT, align: 'right'
    });

    if (subtitleAr) {
      slide.addText(subtitleAr, {
        x: 0.8, y: 1.1, w: 8.4, h: 0.35,
        fontSize: 11, color: C.mutedSlate, fontFace: FONT, align: 'right'
      });
    }

    slide.addShape(pres.ShapeType.line, {
      x: 0.8, y: 1.5, w: 8.4, h: 0,
      line: { color: C.border, width: 1 }
    });
  }

  // ==========================================
  // SLIDE 1: COVER SLIDE
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.forest };

    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 0.15,
      fill: { color: C.gold },
      line: { color: C.gold }
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.0, w: 8.4, h: 3.8, r: 0.3,
      fill: { color: '123D35' },
      line: { color: 'B89A68', width: 1.5 }
    });

    slide.addText('مشروع مخطط المها / مها الشرق · مخطط رقم 4047', {
      x: 1.2, y: 1.3, w: 7.6, h: 0.4,
      fontSize: 13, bold: true, color: C.champagne, fontFace: FONT, align: 'center'
    });

    slide.addText('بوابة المبيعات وعروض الأسعار وإدارة العقود', {
      x: 1.0, y: 1.8, w: 8.0, h: 0.9,
      fontSize: 30, bold: true, color: C.white, fontFace: FONT, align: 'center'
    });

    slide.addText('عرض تنفيذي متكامل للإدارة العليا حول مزايا النظام والتقنيات وتجربة المستخدم', {
      x: 1.2, y: 2.75, w: 7.6, h: 0.5,
      fontSize: 14, color: 'D5E4DC', fontFace: FONT, align: 'center'
    });

    const chips = [
      { num: '973', lbl: 'إجمالي القطع' },
      { num: '41', lbl: 'بلك سكني وتجاري' },
      { num: '4', lbl: 'مناطق رئيسية (Zones)' },
      { num: '660+ مليون', lbl: 'القيمة التقديرية (ر.س)' }
    ];

    chips.forEach((ch, idx) => {
      const xPos = 1.3 + idx * 1.9;
      slide.addShape(pres.ShapeType.roundRect, {
        x: xPos, y: 3.4, w: 1.7, h: 1.0, r: 0.15,
        fill: { color: C.forest },
        line: { color: '2A6357', width: 1 }
      });
      slide.addText(ch.num, {
        x: xPos, y: 3.48, w: 1.7, h: 0.45,
        fontSize: 16, bold: true, color: C.gold, fontFace: FONT, align: 'center'
      });
      slide.addText(ch.lbl, {
        x: xPos, y: 3.95, w: 1.7, h: 0.35,
        fontSize: 9.5, color: 'FFFFFF', fontFace: FONT, align: 'center'
      });
    });

    slide.addText('المطور والمسوق: شركة تارقيت العقارية · البائع: شركة القادسية الأولى · التحديث: 2026', {
      x: 0.8, y: 5.1, w: 8.4, h: 0.35,
      fontSize: 9.5, color: C.champagne, fontFace: FONT, align: 'center'
    });
  }

  // ==========================================
  // SLIDE 2: OBJECTIVES
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'الرؤية والهدف الاستراتيجي من المنظومة', 'تحويل ملفات البيانات التقليدية إلى نظام رقمي تفاعلي للمبيعات وإصدار العروض الفورية');

    const pillars = [
      {
        title: 'ربط مباشر بالمصدر الحي',
        desc: 'قراءة وكتابة البيانات مباشرة مع Google Sheets كمصدر موثوق وموحد للبيانات دون أي تشتت للملفات، مع مزامنة لحظية للتحديثات.',
        icon: '🔗'
      },
      {
        title: 'إصدار العروض الفورية (Sheet1)',
        desc: 'تحويل أي قطعة أو سلة قطع (حتى 10 قطع) إلى عرض سعر رسمي تفاعلي بضغطة زر مطابق للهوية الرسمية وجاهز للطباعة والحفظ A4 PDF.',
        icon: '📄'
      },
      {
        title: 'إدارة وتوليد العقود التلقائية',
        desc: 'نظام توليد عقود الشراء والإفراغ الفوري آلياً بصفحة واحدة مع حماية البيانات ومطابقة الشروط والضوابط القانونية المعتمدة.',
        icon: '✍️'
      },
      {
        title: 'صلاحيات دقيقة وأمان للموظفين',
        desc: 'بوابة محمية للموظفين بروابط مشفرة وجلسات آمنة تمنح كل موظف صلاحيات محددة فقط (عرض/إضافة/تعديل/حذف) لكل قسم وصفحة.',
        icon: '🛡️'
      }
    ];

    pillars.forEach((p, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 5.2 : 0.8;
      const y = 1.75 + row * 1.75;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 4.0, h: 1.55, r: 0.15,
        fill: { color: C.white },
        line: { color: C.border, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 3.25, y: y + 0.15, w: 0.6, h: 0.6, r: 0.1,
        fill: { color: C.softSage },
        line: { color: C.softSage }
      });

      slide.addText(p.icon, {
        x: x + 3.25, y: y + 0.18, w: 0.6, h: 0.55,
        fontSize: 16, align: 'center'
      });

      slide.addText(p.title, {
        x: x + 0.2, y: y + 0.15, w: 2.95, h: 0.35,
        fontSize: 13, bold: true, color: C.forest, fontFace: FONT, align: 'right'
      });

      slide.addText(p.desc, {
        x: x + 0.2, y: y + 0.55, w: 3.65, h: 0.9,
        fontSize: 10, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 3: PALETTE & DESIGN
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'الهوية البصرية: باليت الزمرد والرمال (Emerald & Sand)', 'تصميم عقاري فاخر يعكس الفخامة والموثوقية المؤسسية متوافق بالكامل مع بيئة RTL العربية');

    const colors = [
      { name: 'Emerald Green', hex: '#126B58', role: 'اللون الأساسي التفاعلي للأزرار والإحصائيات الحيوية', darkText: false },
      { name: 'Deep Forest', hex: '#174A40', role: 'لون خلفيات الهيدر التنفيذي والبطاقات الداكنة والعمق', darkText: false },
      { name: 'Sand Gold', hex: '#B89A68', role: 'لون التمييز الذهبي للعروض والقيم والمحددات الفاخرة', darkText: false },
      { name: 'Sage Green', hex: '#71998A', role: 'الألوان المساعدة والمؤشرات الثانوية المريحة للعين', darkText: false },
      { name: 'Soft Sage', hex: '#E5EEE9', role: 'خلفيات الحالات المختارة والوسوم الدلالية الناعمة', darkText: true },
      { name: 'Soft Ivory', hex: '#FAF9F5', role: 'اللون العام لخلفية كافة الصفحات لتوفير الدفء والوضوح', darkText: true },
    ];

    colors.forEach((clr, idx) => {
      const col = idx % 3;
      const row = Math.floor(idx / 3);
      const x = 0.8 + col * 2.85;
      const y = 1.75 + row * 1.75;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 2.7, h: 1.55, r: 0.15,
        fill: { color: C.white },
        line: { color: C.border, width: 1 }
      });

      slide.addShape(pres.ShapeType.roundRect, {
        x: x + 0.15, y: y + 0.15, w: 2.4, h: 0.5, r: 0.1,
        fill: { color: clr.hex.replace('#', '') },
        line: { color: clr.hex.replace('#', '') }
      });

      slide.addText(clr.hex, {
        x: x + 0.15, y: y + 0.22, w: 2.4, h: 0.35,
        fontSize: 11, bold: true, color: clr.darkText ? '293B36' : 'FFFFFF', fontFace: FONT, align: 'center'
      });

      slide.addText(clr.name, {
        x: x + 0.15, y: y + 0.72, w: 2.4, h: 0.3,
        fontSize: 12, bold: true, color: C.forest, fontFace: FONT, align: 'right'
      });

      slide.addText(clr.role, {
        x: x + 0.15, y: y + 1.02, w: 2.4, h: 0.45,
        fontSize: 9, color: C.mutedSlate, fontFace: FONT, align: 'right'
      });
    });
  }

  // ==========================================
  // SLIDE 4: DUAL EXPERIENCE & DASHBOARD
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'الرئيسية الذكية: تجربة مزدوجة (Dual Experience)', 'فصل كامل بين الزائر العام والموظف المصرح له مع لوحة مؤشرات قيادية تفاعلية');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.75, w: 4.0, h: 3.5, r: 0.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1.5 }
    });
    slide.addShape(pres.ShapeType.rect, {
      x: 0.8, y: 1.75, w: 4.0, h: 0.1,
      fill: { color: C.gold }
    });
    slide.addText('1. الواجهة الترحيبية للزوار (Public Landing)', {
      x: 1.0, y: 1.95, w: 3.6, h: 0.35,
      fontSize: 13, bold: true, color: C.forest, fontFace: FONT, align: 'right'
    });
    slide.addText([
      { text: '• مخصصة للجمهور والزوار دون تسجيل دخول.\n' },
      { text: '• حجب صارم لكافة البيانات الحساسة أو الأسعار الداخلية في السيرفر.\n' },
      { text: '• استعراض تعريفي بمميزات المخطط وموقعه الاستراتيجي.\n' },
      { text: '• بوابة وصول محمية للموظفين عبر كود مسار مشفر (Hash).' }
    ], {
      x: 1.0, y: 2.35, w: 3.6, h: 1.3,
      fontSize: 10.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 18
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 1.1, y: 3.75, w: 3.4, h: 1.3, r: 0.15,
      fill: { color: C.forest },
      line: { color: C.forest }
    });
    slide.addText('مخطط المها / مها الشرق · رقم 4047', {
      x: 1.2, y: 3.9, w: 3.2, h: 0.3,
      fontSize: 11, bold: true, color: C.champagne, fontFace: FONT, align: 'center'
    });
    slide.addText('وجهتكم العقارية الأولى لأرقى القطع السكنية والتجارية', {
      x: 1.2, y: 4.25, w: 3.2, h: 0.3,
      fontSize: 9, color: 'FFFFFF', fontFace: FONT, align: 'center'
    });

    // Right Box: Authenticated Dashboard
    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.2, y: 1.75, w: 4.0, h: 3.5, r: 0.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1.5 }
    });
    slide.addShape(pres.ShapeType.rect, {
      x: 5.2, y: 1.75, w: 4.0, h: 0.1,
      fill: { color: C.emerald }
    });
    slide.addText('2. لوحة تحكم الموظفين والمدراء (Dashboard)', {
      x: 5.4, y: 1.95, w: 3.6, h: 0.35,
      fontSize: 13, bold: true, color: C.forest, fontFace: FONT, align: 'right'
    });
    slide.addText([
      { text: '• تظهر فوراً للموظفين حاملي صلاحية `view_stats` أو المدراء.\n' },
      { text: '• بطاقات مؤشرات حية: إجمالي القطع، المساحات، القيم، والمتاح.\n' },
      { text: '• رسوم بيانية تفاعلية لتوزيع المساحات والقيم (Chart.js).\n' },
      { text: '• جدول مقارنة الاستخدام × الحالة مطابق لتقرير Rep الرسمي.' }
    ], {
      x: 5.4, y: 2.35, w: 3.6, h: 1.3,
      fontSize: 10.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 18
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.5, y: 3.75, w: 3.4, h: 1.3, r: 0.15,
      fill: { color: C.softSage },
      line: { color: 'B3D1C6', width: 1 }
    });
    const statCards = [
      { l: 'إجمالي القطع', v: '973' },
      { l: 'المساحة الإجمالية', v: '381,753 م²' },
      { l: 'القطع المتاحة', v: '887 متاح' }
    ];
    statCards.forEach((sc, i) => {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.65 + i * 1.05, y: 3.9, w: 0.98, h: 1.0, r: 0.1,
        fill: { color: C.white },
        line: { color: C.border, width: 0.5 }
      });
      slide.addText(sc.l, {
        x: 5.67 + i * 1.05, y: 3.98, w: 0.94, h: 0.35,
        fontSize: 7.5, color: C.mutedSlate, fontFace: FONT, align: 'center'
      });
      slide.addText(sc.v, {
        x: 5.67 + i * 1.05, y: 4.38, w: 0.94, h: 0.4,
        fontSize: 10, bold: true, color: C.emerald, fontFace: FONT, align: 'center'
      });
    });
  }

  // ==========================================
  // SLIDE 5: PLOTS TABLE & FORMULAS
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'جدول ومستودع القطع الشامل (/plots)', 'محرك بحث وفلاتر متعددة الأبعاد تدعم سرعة التصفح وتصدير البيانات');

    const tableFeatures = [
      {
        t: 'فلاتر متعددة الأبعاد',
        d: 'فرز حسب البلك (41 بلك)، الزون (A1, A2, B1, B2)، الاستخدام (سكني/تجاري/مرافق)، والحالة (متاح، محجوز، مباع).',
        ic: '🔍'
      },
      {
        t: 'حسابات مالية فورية',
        d: 'حساب قيمة الأرض، السعي 2.5% + ضريبة القيمة المضافة 15%، وضريبة التصرفات العقارية RETT 5% تلقائياً دون لمس معادلات الإكسل.',
        ic: '🧮'
      },
      {
        t: 'تصدير وتحديد متعدد',
        d: 'تحديد قطع متعددة بنقرة واحدة لتوليد عروض أسعار مجمعة، وتصدير النتائج إلى ملفات Excel/CSV مع إخفاء بيانات المشترين لغير المدراء.',
        ic: '📊'
      }
    ];

    tableFeatures.forEach((tf, i) => {
      const x = 0.8 + i * 2.85;
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 1.75, w: 2.7, h: 1.5, r: 0.15,
        fill: { color: C.white },
        line: { color: C.border, width: 1 }
      });
      slide.addText(tf.ic, { x: x + 2.05, y: 1.85, w: 0.5, h: 0.4, fontSize: 16, align: 'center' });
      slide.addText(tf.t, { x: x + 0.15, y: 1.9, w: 1.9, h: 0.35, fontSize: 12, bold: true, color: C.forest, fontFace: FONT, align: 'right' });
      slide.addText(tf.d, { x: x + 0.15, y: 2.35, w: 2.4, h: 0.8, fontSize: 9.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 14 });
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 3.45, w: 8.4, h: 1.8, r: 0.15,
      fill: { color: C.white },
      line: { color: C.border, width: 1 }
    });

    slide.addShape(pres.ShapeType.rect, {
      x: 0.8, y: 3.45, w: 8.4, h: 0.35,
      fill: { color: C.softSage }
    });
    const cols = ['الإجراءات', 'الحالة', 'ضريبة التصرفات (5%)', 'السعي شامل الضريبة', 'قيمة الأرض (ر.س)', 'سعر م²', 'المساحة', 'الاستخدام', 'البلك', 'رقم القطعة'];
    cols.forEach((colName, idx) => {
      slide.addText(colName, {
        x: 0.8 + idx * 0.84, y: 3.48, w: 0.84, h: 0.3,
        fontSize: 7.5, bold: true, color: C.forest, fontFace: FONT, align: 'center'
      });
    });

    const rows = [
      ['عرض سعر', 'متاح', '25,500', '14,662.50', '510,000', '1,700', '300 م²', 'سكنى', '12', '673'],
      ['عرض سعر', 'متاح', '29,250', '16,818.75', '585,000', '1,800', '325 م²', 'سكنى', '15', '881'],
      ['محجوز', 'محجوز', '45,000', '25,875.00', '900,000', '2,000', '450 م²', 'تجارى', '02', '104']
    ];

    rows.forEach((rData, rIdx) => {
      const rowY = 3.85 + rIdx * 0.42;
      slide.addShape(pres.ShapeType.line, {
        x: 0.8, y: rowY + 0.4, w: 8.4, h: 0,
        line: { color: C.border, width: 0.5 }
      });
      rData.forEach((val, cIdx) => {
        const isBadge = cIdx === 1;
        if (isBadge) {
          const badgeBg = val === 'متاح' ? 'E8F7F0' : 'FFF8E6';
          const badgeText = val === 'متاح' ? '0E7048' : 'B87700';
          slide.addShape(pres.ShapeType.roundRect, {
            x: 0.8 + cIdx * 0.84 + 0.1, y: rowY + 0.08, w: 0.64, h: 0.25, r: 0.08,
            fill: { color: badgeBg }
          });
          slide.addText(val, {
            x: 0.8 + cIdx * 0.84, y: rowY + 0.06, w: 0.84, h: 0.28,
            fontSize: 7.5, bold: true, color: badgeText, fontFace: FONT, align: 'center'
          });
        } else {
          slide.addText(val, {
            x: 0.8 + cIdx * 0.84, y: rowY + 0.08, w: 0.84, h: 0.28,
            fontSize: 7.5, color: cIdx === 0 ? C.emerald : C.darkSlate, bold: cIdx === 9 || cIdx === 0, fontFace: FONT, align: 'center'
          });
        }
      });
    });
  }

  // ==========================================
  // SLIDE 6: PRICE QUOTATION & REAL SCREENSHOT
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'نظام عروض الأسعار الرسمية (Price Quotation)', 'مطابقة تامة لنموذج Sheet1 المعتمد مع إمكانية التوليد الفردي والمجمع حتى 10 قطع');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.75, w: 4.0, h: 3.5, r: 0.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1.5 }
    });

    slide.addText('مميزات صانع عروض الأسعار (/quote):', {
      x: 1.0, y: 1.95, w: 3.6, h: 0.35,
      fontSize: 13, bold: true, color: C.forest, fontFace: FONT, align: 'right'
    });

    slide.addText([
      { text: '• تخصيص مرن: إمكانية إدخال اسم المشتري، رقم الجوال، وتاريخ العرض.\n' },
      { text: '• إضافة حتى 10 قطع في نموذج واحد مع تعديل اختياري لسعر المتر للقطعة.\n' },
      { text: '• نصوص الشيكات المصرفية المعتمدة:\n' },
      { text: '   - شيك ثمن الأرض باسم "شركة القادسية الأولى"\n' },
      { text: '   - شيك السعي شامل الضريبة باسم "شركة تارقيت العقارية"\n' },
      { text: '• إرشادات سداد ضريبة التصرفات العقارية (RETT) مباشرة عبر سداد.\n' },
      { text: '• مهلة العرض القانونية (صلاحية 7 أيام من تاريخ الإصدار).\n' },
      { text: '• طباعة وتصدير A4 PDF نظيفة ومطابقة للمواصفات الرسمية.' }
    ], {
      x: 1.0, y: 2.35, w: 3.6, h: 2.7,
      fontSize: 9.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 15
    });

    const screenshotPath = path.resolve('presentation_screenshots', 'quotation_reference.png');
    if (fs.existsSync(screenshotPath)) {
      slide.addShape(pres.ShapeType.roundRect, {
        x: 5.15, y: 1.75, w: 4.1, h: 3.5, r: 0.2,
        fill: { color: C.white },
        line: { color: C.border, width: 1.5 }
      });
      slide.addImage({
        path: screenshotPath,
        x: 5.25, y: 1.85, w: 3.9, h: 3.3
      });
    }
  }

  // ==========================================
  // SLIDE 7: CONTRACTS
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'إدارة وتوليد العقود الإلكترونية (/contracts)', 'توليد عقود الشراء (الإفراغ الفوري) بضغطة زر وبصفحة واحدة متكاملة وجاهزة للطباعة والتوثيق');

    const contractCards = [
      {
        h: 'عقد صفحة واحدة (One-Page Contract)',
        b: 'تمت هندسة نموذج العقد بدقة ليتسع لجميع بيانات الأطراف، بيانات العقار المالية، الشروط والأحكام، وتواقيع الطرفين في صفحة A4 واحدة دون أي تداخل.'
      },
      {
        h: 'حماية وتوثيق الشروط',
        b: 'شروط موثقة ومنقحة تشمل التزامات البائع والمشتري، فك الرهن، سداد التصرفات العقارية، والسعي، مع إزالة أي نصوص زائدة لضمان التركيز والوضوح.'
      },
      {
        h: 'تعديل وحفظ مسودات العقود',
        b: 'إمكانية تعديل بيانات المشتري وتحديث بيانات العقد مباشرة للموظفين المصرح لهم (صلاحية `edit_contracts`) مع حفظ التعديلات والرجوع لها.'
      },
      {
        h: 'تصدير PDF والتنقل السريع',
        b: 'طباعة فورية وحفظ PDF بأعلى جودة متجهية، مع شريط تنقل فوري بين عقود المخطط (السابق والتالي) لتسهيل مراجعة وإبرام الصفقات.'
      }
    ];

    contractCards.forEach((cc, idx) => {
      const col = idx % 2;
      const row = Math.floor(idx / 2);
      const x = col === 0 ? 5.2 : 0.8;
      const y = 1.75 + row * 1.75;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 4.0, h: 1.55, r: 0.15,
        fill: { color: C.white },
        line: { color: C.border, width: 1 }
      });
      slide.addText(cc.h, {
        x: x + 0.2, y: y + 0.15, w: 3.6, h: 0.35,
        fontSize: 12, bold: true, color: C.forest, fontFace: FONT, align: 'right'
      });
      slide.addText(cc.b, {
        x: x + 0.2, y: y + 0.55, w: 3.6, h: 0.9,
        fontSize: 9.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 15
      });
    });
  }

  // ==========================================
  // SLIDE 8: BLOCKS & ZONES
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'المستكشف المكاني: البلوكات والمناطق (/blocks, /zones)', 'عرض بصري جغرافي للمخطط يتيح تتبع نسب الإنجاز والمبيعات في كل قطاع');

    slide.addShape(pres.ShapeType.roundRect, {
      x: 0.8, y: 1.75, w: 4.0, h: 3.5, r: 0.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1 }
    });
    slide.addText('1. مستكشف البلوكات (41 بلك)', {
      x: 1.0, y: 1.95, w: 3.6, h: 0.35,
      fontSize: 13, bold: true, color: C.forest, fontFace: FONT, align: 'right'
    });
    slide.addText([
      { text: '• بطاقة تفاعلية لكل بلك توضح عدد القطع وإجمالي المساحة.\n' },
      { text: '• مؤشر نسبة المبيعات اللوني (شريط تقدم ثلاثي الألوان: أخضر للمتاح، أصفر للمحجوز، أحمر للمباع).\n' },
      { text: '• الدخول للبلك يعرض شبكة القطع التابعة له كبلاطات تفاعلية تتيح الانتقال السريع للقطعة.' }
    ], {
      x: 1.0, y: 2.35, w: 3.6, h: 1.5,
      fontSize: 10, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 16
    });

    slide.addShape(pres.ShapeType.roundRect, {
      x: 5.2, y: 1.75, w: 4.0, h: 3.5, r: 0.2,
      fill: { color: C.white },
      line: { color: C.border, width: 1 }
    });
    slide.addText('2. مستكشف المناطق (A1, A2, B1, B2)', {
      x: 5.4, y: 1.95, w: 3.6, h: 0.35,
      fontSize: 13, bold: true, color: C.forest, fontFace: FONT, align: 'right'
    });
    slide.addText([
      { text: '• توزيع استراتيجي للمخطط عبر 4 زونات رئيسية.\n' },
      { text: '• ملخص إحصائي شامل لكل زون: متوسط سعر المتر، القيمة السوقية الإجمالية، ونسب الحجز والبيع.\n' },
      { text: '• تصفية سريعة بنقرة واحدة تقود مباشرة لجدول قطع الزون المحدد.' }
    ], {
      x: 5.4, y: 2.35, w: 3.6, h: 1.5,
      fontSize: 10, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 16
    });
  }

  // ==========================================
  // SLIDE 9: ADMIN & AUDIT
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'مركز الإدارة والأمان وصلاحيات الموظفين Granular RBAC', 'تحكم مركزي كامل في صلاحيات الوصول وسجل رقابي لجميع التعديلات والعمليات الإدارية');

    const adminPillars = [
      {
        t: 'منظومة الصلاحيات الفردية (Granular)',
        d: 'أكثر من 20 صلاحية دقيقة لكل موظف تشمل: تصفح/تعديل/إضافة/حذف القطع، العقود، الزونات، البلوكات، الإحصائيات، وتصدير البيانات. تظهر للموظف فقط الصفحات المسموحة له في القوائم.',
        bg: C.white,
        border: C.border
      },
      {
        t: 'حماية معادلات الإكسل (G, H, T)',
        d: 'عند التعديل أو إضافة قطع جديدة، يمنع النظام الكتابة على خلايا المعادلات (قيمة الأرض، السعي، الضريبة) ويقوم باستنساخها وصيانتها آلياً لضمان سلامة الإكسل المصدري 100%.',
        bg: C.white,
        border: C.border
      },
      {
        t: 'سجل الرقابة الشامل (Audit Log)',
        d: 'تسجيل تاريخي غير قابل للحذف لكل عملية (إضافة، تعديل، حذف، تغيير حالة) مع تفاصيل الحساب، وقت العملية، والبيانات قبل وبعد التعديل لمتابعة دقيقة لمجريات المبيعات.',
        bg: C.white,
        border: C.border
      }
    ];

    adminPillars.forEach((ap, i) => {
      const x = 0.8 + i * 2.85;
      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: 1.75, w: 2.7, h: 3.5, r: 0.15,
        fill: { color: ap.bg },
        line: { color: ap.border, width: 1 }
      });

      slide.addShape(pres.ShapeType.rect, {
        x: x, y: 1.75, w: 2.7, h: 0.08,
        fill: { color: i === 0 ? C.emerald : i === 1 ? C.gold : C.forest }
      });

      slide.addText(ap.t, {
        x: x + 0.15, y: 2.0, w: 2.4, h: 0.65,
        fontSize: 12, bold: true, color: C.forest, fontFace: FONT, align: 'right'
      });

      slide.addText(ap.d, {
        x: x + 0.15, y: 2.7, w: 2.4, h: 2.3,
        fontSize: 9.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 16
      });
    });
  }

  // ==========================================
  // SLIDE 10: USER EXPERIENCE & SKELETON LOADING
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'تجربة المستخدم والأداء: Skeleton Loading & Transitions', 'واجهة حديثة وسريعة الاستجابة تضمن أعلى معايير راحة وسلاسة الاستخدام');

    const uxFeatures = [
      {
        h: 'هياكل التحميل الذكية (App Skeleton)',
        p: 'استبدال دوائر التحميل التقليدية بهياكل عظمية متناسقة مع شكل الصفحة تعطي انطباعاً فورياً بالسرعة والاحترافية وتقلل معدل الانتظار الذهني لدى المستخدم.'
      },
      {
        h: 'مؤشر التقدم العلوي (Loading Indicator)',
        p: 'شريط زمردي نحيف وديناميكي في أعلى الشاشة يوضح تقدم الانتقال اللحظي بين الصفحات ومسارات التطبيق.'
      },
      {
        h: 'انتقالات المسارات السلسة (Page Transitions)',
        p: 'حركات تلاشي خفيفة وإزاحة عمودية ناعمة (Fade & Slide) عند التبديل بين الشاشات دون وميض أو تقطيع في المحتوى.'
      },
      {
        h: 'نماذج إدخال فارغة ومنظمة بالكامل',
        p: 'جميع نماذج الإضافة (إضافة قطعة، إضافة موظف، إضافة عقد) تفتح نظيفة وخالية من أي بيانات مسبقة أو تجريبية مع نصوص إرشادية وتدقيق Zod فوري.'
      }
    ];

    uxFeatures.forEach((uf, i) => {
      const col = i % 2;
      const row = Math.floor(i / 2);
      const x = col === 0 ? 5.2 : 0.8;
      const y = 1.75 + row * 1.75;

      slide.addShape(pres.ShapeType.roundRect, {
        x: x, y: y, w: 4.0, h: 1.55, r: 0.15,
        fill: { color: C.white },
        line: { color: C.border, width: 1 }
      });

      slide.addText(uf.h, {
        x: x + 0.2, y: y + 0.15, w: 3.6, h: 0.35,
        fontSize: 12, bold: true, color: C.emerald, fontFace: FONT, align: 'right'
      });

      slide.addText(uf.p, {
        x: x + 0.2, y: y + 0.55, w: 3.6, h: 0.9,
        fontSize: 9.5, color: C.darkSlate, fontFace: FONT, align: 'right', lineSpacing: 15
      });
    });
  }

  // ==========================================
  // SLIDE 11: TECHNICAL STACK
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.ivory };
    addSlideHeader(slide, 'البنية التقنية والتكامل (Technical Architecture)', 'معمارية سحابية متقدمة مبنية بأحدث تقنيات الويب الحديثة لضمان الأمان والسرعة');

    const stackItems = [
      { cat: 'واجهة المستخدم (Frontend)', spec: 'Nuxt 4 + Vue 3 + Tailwind CSS + PrimeVue + Cairo Font (Arabic RTL First)' },
      { cat: 'خادم التطبيق والـ API (Backend)', spec: 'Nitro Server + Node.js Engine + Secure Session Auth + Route Obfuscation' },
      { cat: 'مصدر البيانات (Data Source)', spec: 'Google Sheets API v4 (Service Account JWT) كمصدر بيانات حي ونهائي بدون وسيط' },
      { cat: 'التحقق والأمان (Security & Validation)', spec: 'Zod Validation Schemas + Granular Role-Based Access Control (RBAC)' },
      { cat: 'الطباعة والتقارير (Export & Reports)', spec: 'Vector-perfect A4 Print Stylesheet + Client-side PDF Generation + CSV Export' },
      { cat: 'إدارة الذاكرة المؤقتة (Caching)', spec: 'Nitro Storage Cache (60s TTL) لتسريع التصفح وحماية معدلات استهلاك Google Quotas' }
    ];

    stackItems.forEach((st, i) => {
      const y = 1.75 + i * 0.58;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 0.8, y: y, w: 8.4, h: 0.5, r: 0.1,
        fill: { color: C.white },
        line: { color: C.border, width: 1 }
      });
      slide.addText(st.cat, {
        x: 6.2, y: y + 0.08, w: 2.8, h: 0.35,
        fontSize: 10, bold: true, color: C.forest, fontFace: FONT, align: 'right'
      });
      slide.addText(st.spec, {
        x: 1.0, y: y + 0.08, w: 5.1, h: 0.35,
        fontSize: 9, color: C.darkSlate, fontFace: FONT, align: 'left'
      });
    });
  }

  // ==========================================
  // SLIDE 12: CONCLUSION
  // ==========================================
  {
    const slide = pres.addSlide();
    slide.background = { color: C.forest };

    slide.addShape(pres.ShapeType.rect, {
      x: 0, y: 0, w: 10, h: 0.15,
      fill: { color: C.gold }
    });

    slide.addText('خلاصة وتوصيات الإدارة العليا', {
      x: 1.0, y: 0.8, w: 8.0, h: 0.5,
      fontSize: 24, bold: true, color: C.champagne, fontFace: FONT, align: 'center'
    });

    slide.addText('منظومة مخطط المها جاهزة للتشغيل الكامل وخدمة المبيعات والعملاء', {
      x: 1.0, y: 1.35, w: 8.0, h: 0.4,
      fontSize: 13, color: 'FFFFFF', fontFace: FONT, align: 'center'
    });

    const deliverables = [
      '✅ تمكين فريق المبيعات من إصدار عروض أسعار موثقة وفورية خلال أقل من دقيقة.',
      '✅ توفير شاشة موحدة للمدراء لمتابعة نسب الإنجاز والمبيعات وقيم القطع بدقة رقمية عالية.',
      '✅ حماية كاملة لملف الإكسل الأصلي من الأخطاء البشرية أو تلف المعادلات الحسابية.',
      '✅ نظام عقود إلكترونية موحدة من صفحة واحدة تسهل إتمام الصفقات وتوثيق الاتفاقيات.'
    ];

    deliverables.forEach((item, i) => {
      const y = 2.0 + i * 0.65;
      slide.addShape(pres.ShapeType.roundRect, {
        x: 1.2, y: y, w: 7.6, h: 0.55, r: 0.12,
        fill: { color: '123D35' },
        line: { color: '2A6357', width: 1 }
      });
      slide.addText(item, {
        x: 1.4, y: y + 0.1, w: 7.2, h: 0.35,
        fontSize: 11, bold: true, color: 'FFFFFF', fontFace: FONT, align: 'right'
      });
    });

    slide.addText('شكراً لكم · مشروع مخطط المها 4047 · 2026', {
      x: 1.0, y: 4.9, w: 8.0, h: 0.4,
      fontSize: 11, bold: true, color: C.champagne, fontFace: FONT, align: 'center'
    });
  }

  // Export as Node Buffer
  const rawOutput = await pres.write({ outputType: 'nodebuffer' });
  return Buffer.isBuffer(rawOutput) ? rawOutput : Buffer.from(rawOutput as ArrayBuffer);
}
